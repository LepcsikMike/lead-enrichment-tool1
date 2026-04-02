import type { ScrapedData } from "./scraper";

export interface AnalyzedData {
  branche: string;
  benefits: string[];
  tonalitaet: string;
  offene_stellen: {
    titel: string;
    aufgaben: string[];
    vorteile: string[];
  }[];
  zusammenfassung: string;
}

export async function analyzeWithLLM(
  companyName: string,
  websiteUrl: string,
  scrapedData: ScrapedData
): Promise<AnalyzedData> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  const useAnthropic = !!process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("No LLM API key configured (ANTHROPIC_API_KEY or OPENAI_API_KEY)");
  }

  const prompt = `Analysiere die folgenden Website-Inhalte der Firma "${companyName}" (${websiteUrl}) und extrahiere strukturierte Daten.

WEBSITE HAUPTSEITE:
${scrapedData.mainPageText.slice(0, 8000)}

${scrapedData.careerPageText ? `KARRIERESEITE:\n${scrapedData.careerPageText.slice(0, 8000)}` : "Keine Karriereseite gefunden."}

${scrapedData.metaDescription ? `META BESCHREIBUNG: ${scrapedData.metaDescription}` : ""}
${scrapedData.title ? `SEITENTITEL: ${scrapedData.title}` : ""}

Bitte extrahiere folgende Informationen und antworte AUSSCHLIESSLICH mit validem JSON (ohne Markdown-Codeblöcke):

{
  "branche": "Die Branche/Industrie des Unternehmens (z.B. 'IT & Software', 'Handwerk - SHK', 'Automobilindustrie')",
  "benefits": ["Liste der Arbeitgeber-Benefits die auf der Website erwähnt werden, z.B. 'Homeoffice', 'Firmenwagen', '30 Tage Urlaub'"],
  "tonalitaet": "Beschreibung der Tonalität/Vibe der Website und Arbeitgeberkommunikation. Ist sie formell, locker, modern, traditionell, jung und dynamisch, etc.? 2-3 Sätze.",
  "offene_stellen": [
    {
      "titel": "Jobtitel der ausgeschriebenen Stelle",
      "aufgaben": ["Liste der Hauptaufgaben der Stelle"],
      "vorteile": ["Spezifische Vorteile/Benefits dieser Stelle"]
    }
  ],
  "zusammenfassung": "Eine kurze Zusammenfassung (3-4 Sätze) über das Unternehmen, was es tut, wie es sich als Arbeitgeber positioniert und was den Candidate Flow für potenzielle Bewerber ausmacht."
}

Wichtig:
- Wenn keine Stellen gefunden werden, gib ein leeres Array zurück.
- Wenn Benefits nicht explizit erwähnt werden, versuche sie aus dem Kontext abzuleiten.
- Die Tonalität soll aus der Art der Sprache, Anrede (Du/Sie) und dem Gesamteindruck abgeleitet werden.
- Antworte NUR mit dem JSON-Objekt, keine zusätzlichen Erklärungen.`;

  if (useAnthropic) {
    return analyzeWithAnthropic(apiKey, prompt);
  } else {
    return analyzeWithOpenAI(apiKey, prompt);
  }
}

async function analyzeWithAnthropic(
  apiKey: string,
  prompt: string
): Promise<AnalyzedData> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  return parseJSON(text);
}

async function analyzeWithOpenAI(
  apiKey: string,
  prompt: string
): Promise<AnalyzedData> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Du bist ein Experte für Firmenanalyse und Recruiting. Antworte ausschließlich mit validem JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  return parseJSON(text);
}

function parseJSON(text: string): AnalyzedData {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      branche: parsed.branche || "Unbekannt",
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
      tonalitaet: parsed.tonalitaet || "Keine Analyse möglich",
      offene_stellen: Array.isArray(parsed.offene_stellen)
        ? parsed.offene_stellen.map((s: Record<string, unknown>) => ({
            titel: (s.titel as string) || "Unbekannte Stelle",
            aufgaben: Array.isArray(s.aufgaben) ? s.aufgaben : [],
            vorteile: Array.isArray(s.vorteile) ? s.vorteile : [],
          }))
        : [],
      zusammenfassung: parsed.zusammenfassung || "",
    };
  } catch {
    throw new Error("Failed to parse LLM response as JSON");
  }
}
