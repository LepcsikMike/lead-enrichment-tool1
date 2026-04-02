import * as cheerio from "cheerio";

export interface ScrapedData {
  mainPageText: string;
  careerPageText: string | null;
  careerPageUrl: string | null;
  metaDescription: string | null;
  title: string | null;
}

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(html: string, maxLength = 15000): string {
  const $ = cheerio.load(html);

  // Remove irrelevant elements
  $("script, style, noscript, iframe, svg, nav, footer, header").remove();

  // Get meaningful text
  const text = $("body").text().replace(/\s+/g, " ").trim();

  return text.slice(0, maxLength);
}

function findCareerPageUrl(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);
  const careerKeywords = [
    "karriere",
    "career",
    "careers",
    "jobs",
    "stellenangebote",
    "stellenanzeigen",
    "offene-stellen",
    "arbeiten-bei",
    "join",
    "team",
    "bewerbung",
  ];

  let careerUrl: string | null = null;

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().toLowerCase();

    if (!href) return;

    const hrefLower = href.toLowerCase();
    const isCareerLink = careerKeywords.some(
      (kw) => hrefLower.includes(kw) || text.includes(kw)
    );

    if (isCareerLink) {
      try {
        careerUrl = new URL(href, baseUrl).href;
        return false; // break
      } catch {
        // ignore invalid URLs
      }
    }
  });

  return careerUrl;
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  // Fetch main page
  const mainHtml = await fetchPage(url);
  const $ = cheerio.load(mainHtml);

  const mainPageText = extractText(mainHtml);
  const metaDescription =
    $('meta[name="description"]').attr("content") || null;
  const title = $("title").text() || null;

  // Find and fetch career page
  const careerPageUrl = findCareerPageUrl(mainHtml, url);
  let careerPageText: string | null = null;

  if (careerPageUrl) {
    try {
      const careerHtml = await fetchPage(careerPageUrl);
      careerPageText = extractText(careerHtml);
    } catch (err) {
      console.error("Failed to fetch career page:", err);
    }
  }

  // If no career page found, try common paths
  if (!careerPageText) {
    const commonPaths = ["/karriere", "/career", "/careers", "/jobs", "/stellenangebote"];
    for (const path of commonPaths) {
      try {
        const testUrl = new URL(path, url).href;
        const html = await fetchPage(testUrl);
        const text = extractText(html);
        if (text.length > 200) {
          careerPageText = text;
          break;
        }
      } catch {
        // path doesn't exist, continue
      }
    }
  }

  return {
    mainPageText,
    careerPageText,
    careerPageUrl,
    metaDescription,
    title,
  };
}
