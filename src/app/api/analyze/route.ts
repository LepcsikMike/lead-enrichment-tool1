import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { analyzeWithLLM } from "@/lib/analyzer";
import { getSupabase } from "@/lib/supabase";
import { sendNotificationEmail } from "@/lib/email";

export const maxDuration = 60; // Allow up to 60s for scraping + LLM

export async function POST(request: NextRequest) {
  try {
    const { companyName, websiteUrl } = await request.json();

    if (!companyName || !websiteUrl) {
      return NextResponse.json(
        { error: "Firmenname und Website-URL sind erforderlich" },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl: string;
    try {
      validUrl = new URL(websiteUrl).href;
    } catch {
      return NextResponse.json(
        { error: "Ungültige URL" },
        { status: 400 }
      );
    }

    // Step 1: Scrape the website
    console.log(`Scraping ${validUrl}...`);
    const scrapedData = await scrapeWebsite(validUrl);

    // Step 2: Analyze with LLM
    console.log("Analyzing with LLM...");
    const analysis = await analyzeWithLLM(companyName, validUrl, scrapedData);

    // Step 3: Save to Supabase
    console.log("Saving to Supabase...");
    const record = {
      company_name: companyName,
      website_url: validUrl,
      branche: analysis.branche,
      benefits: analysis.benefits,
      tonalitaet: analysis.tonalitaet,
      offene_stellen: analysis.offene_stellen,
      karriere_seite_url: scrapedData.careerPageUrl,
      rohdaten_zusammenfassung: analysis.zusammenfassung,
    };

    const supabase = getSupabase();
    const { data: savedData, error: dbError } = await supabase
      .from("leads")
      .insert(record)
      .select()
      .single();

    if (dbError) {
      console.error("Supabase error:", dbError);
      throw new Error(`Datenbank-Fehler: ${dbError.message}`);
    }

    // Step 4: Send notification email
    console.log("Sending notification email...");
    await sendNotificationEmail({
      companyName,
      websiteUrl: validUrl,
      branche: analysis.branche,
      benefitsCount: analysis.benefits.length,
      stellenCount: analysis.offene_stellen.length,
      id: savedData.id,
    });

    console.log("Analysis complete!");

    return NextResponse.json(savedData);
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
