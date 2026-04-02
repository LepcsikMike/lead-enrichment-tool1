"use client";

import { useState } from "react";
import Logo from "./Logo";

interface LandingSectionProps {
  onAnalyze: (companyName: string, websiteUrl: string) => void;
}

export default function LandingSection({ onAnalyze }: LandingSectionProps) {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; url?: string } = {};

    if (!companyName.trim()) {
      newErrors.name = "Bitte Firmennamen eingeben";
    }
    if (!websiteUrl.trim()) {
      newErrors.url = "Bitte Website-URL eingeben";
    } else {
      try {
        let testUrl = websiteUrl.trim();
        if (!testUrl.startsWith("http")) {
          testUrl = "https://" + testUrl;
        }
        new URL(testUrl);
      } catch {
        newErrors.url = "Bitte eine gültige URL eingeben";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    let finalUrl = websiteUrl.trim();
    if (!finalUrl.startsWith("http")) {
      finalUrl = "https://" + finalUrl;
    }
    onAnalyze(companyName.trim(), finalUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-cf-card-border bg-cf-dark/80 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-6" />
          <span className="text-xs text-cf-gray uppercase tracking-widest">
            Lead Enrichment
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="max-w-2xl w-full text-center">
          {/* Glow effect behind form */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[600px] h-[600px] rounded-full bg-cf-orange/5 blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cf-card-border bg-cf-card text-sm text-cf-gray mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              KI-gestützte Firmenanalyse
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Firmendaten in{" "}
              <span className="relative">
                <span className="text-cf-orange">Sekunden</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-cf-orange/40 rounded-full" />
              </span>{" "}
              analysieren
            </h1>

            <p className="text-lg text-cf-gray mb-12 max-w-lg mx-auto">
              Gib einfach den Firmennamen und die Website ein – unsere KI
              extrahiert alle relevanten Daten für dein Recruiting.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Firmenname"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    className={`w-full px-5 py-4 bg-cf-card border ${
                      errors.name ? "border-red-500" : "border-cf-card-border"
                    } rounded-xl text-white placeholder-cf-gray focus:outline-none focus:border-cf-orange focus:ring-1 focus:ring-cf-orange/50 transition-all`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Website-URL (z.B. www.firma.de)"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      if (errors.url) setErrors((p) => ({ ...p, url: undefined }));
                    }}
                    className={`w-full px-5 py-4 bg-cf-card border ${
                      errors.url ? "border-red-500" : "border-cf-card-border"
                    } rounded-xl text-white placeholder-cf-gray focus:outline-none focus:border-cf-orange focus:ring-1 focus:ring-cf-orange/50 transition-all`}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.url}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-cf-orange hover:bg-cf-orange-hover text-white font-bold text-lg rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer shadow-lg shadow-cf-orange/20 hover:shadow-cf-orange/40"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Analyse starten
                </button>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-cf-gray">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Kostenlos
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                KI-gestützt
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Sekunden
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
