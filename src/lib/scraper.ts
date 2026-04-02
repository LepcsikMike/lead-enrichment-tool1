import * as cheerio from "cheerio";

export interface ScrapedData {
  mainPageText: string;
  careerPageText: string | null;
  careerPageUrl: string | null;
  metaDescription: string | null;
  title: string | null;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0",
};

async function fetchPage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: HEADERS,
      redirect: "follow",
    });

    // Don't throw on non-200 – return null so we can degrade gracefully
    if (!response.ok) {
      console.warn(`Fetch ${url} returned ${response.status} – skipping`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      console.warn(`Fetch ${url} returned non-HTML content type: ${contentType}`);
      return null;
    }

    return await response.text();
  } catch (err) {
    console.warn(`Fetch ${url} failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(html: string, maxLength = 12000): string {
  const $ = cheerio.load(html);

  // Remove noise
  $(
    "script, style, noscript, iframe, svg, nav, footer, header, [class*='cookie'], [class*='banner'], [id*='cookie']"
  ).remove();

  // Prefer main content areas
  const contentSelectors = ["main", "article", "#content", ".content", "#main", ".main", "body"];
  let text = "";
  for (const sel of contentSelectors) {
    const el = $(sel);
    if (el.length) {
      text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 200) break;
    }
  }

  // Fallback to full body
  if (text.length < 200) {
    text = $("body").text().replace(/\s+/g, " ").trim();
  }

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
    "join-us",
    "join",
    "bewerbung",
    "recruiting",
    "team",
  ];

  let careerUrl: string | null = null;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().toLowerCase().trim();
    const hrefLower = href.toLowerCase();

    const isMatch = careerKeywords.some(
      (kw) => hrefLower.includes(kw) || text.includes(kw)
    );

    if (isMatch) {
      try {
        const resolved = new URL(href, baseUrl).href;
        // Only follow same-origin or relative links
        if (resolved.startsWith(new URL(baseUrl).origin)) {
          careerUrl = resolved;
          return false; // break
        }
      } catch {
        // ignore
      }
    }
  });

  return careerUrl;
}

async function tryCommonCareerPaths(baseUrl: string): Promise<{ url: string; text: string } | null> {
  const paths = [
    "/karriere",
    "/careers",
    "/career",
    "/jobs",
    "/stellenangebote",
    "/stellenanzeigen",
    "/arbeiten-bei-uns",
    "/ueber-uns/karriere",
    "/ueber-uns/jobs",
    "/unternehmen/karriere",
    "/en/careers",
  ];

  for (const path of paths) {
    try {
      const url = new URL(path, baseUrl).href;
      const html = await fetchPage(url);
      if (html) {
        const text = extractText(html);
        if (text.length > 300) {
          return { url, text };
        }
      }
    } catch {
      // path doesn't exist
    }
  }
  return null;
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  // Fetch main page
  const mainHtml = await fetchPage(url);

  if (!mainHtml) {
    // Website completely blocked – return minimal data so LLM can still work
    console.warn("Main page unreachable, proceeding with URL-only analysis");
    return {
      mainPageText: "",
      careerPageText: null,
      careerPageUrl: null,
      metaDescription: null,
      title: null,
    };
  }

  const $ = cheerio.load(mainHtml);
  const mainPageText = extractText(mainHtml);
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    null;
  const title =
    $("title").text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    null;

  // Find career page from links
  let careerPageUrl = findCareerPageUrl(mainHtml, url);
  let careerPageText: string | null = null;

  if (careerPageUrl) {
    const careerHtml = await fetchPage(careerPageUrl);
    if (careerHtml) {
      careerPageText = extractText(careerHtml);
    }
  }

  // If still no career page, try common paths
  if (!careerPageText) {
    const found = await tryCommonCareerPaths(url);
    if (found) {
      careerPageUrl = found.url;
      careerPageText = found.text;
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
