"use client";

import { useState } from "react";
import LandingSection from "@/components/LandingSection";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsSection from "@/components/ResultsSection";

export interface AnalysisResult {
  id: string;
  company_name: string;
  website_url: string;
  branche: string;
  benefits: string[];
  tonalitaet: string;
  offene_stellen: {
    titel: string;
    aufgaben: string[];
    vorteile: string[];
  }[];
  karriere_seite_url: string | null;
  rohdaten_zusammenfassung: string;
  created_at: string;
}

type AppState = "landing" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async (companyName: string, websiteUrl: string) => {
    setState("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analyse fehlgeschlagen");
      }

      setResult(data);
      setState("results");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unerwarteter Fehler ist aufgetreten"
      );
      setState("error");
    }
  };

  const handleReset = () => {
    setState("landing");
    setResult(null);
    setError("");
  };

  return (
    <main className="flex-1">
      {state === "landing" && <LandingSection onAnalyze={handleAnalyze} />}
      {state === "loading" && <LoadingScreen />}
      {state === "results" && result && (
        <ResultsSection result={result} onReset={handleReset} />
      )}
      {state === "error" && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Analyse fehlgeschlagen</h2>
            <p className="text-cf-gray mb-8">{error}</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-cf-orange hover:bg-cf-orange-hover text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
