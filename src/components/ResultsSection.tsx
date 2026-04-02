"use client";

import type { AnalysisResult } from "@/app/page";
import Logo from "./Logo";

interface ResultsSectionProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsSection({ result, onReset }: ResultsSectionProps) {
  return (
    <div className="min-h-screen bg-cf-dark">
      {/* Navbar */}
      <nav className="w-full border-b border-cf-card-border bg-cf-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-6" />
          <button
            onClick={onReset}
            className="text-sm text-cf-gray hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neue Analyse
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Analyse abgeschlossen
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {result.company_name}
          </h1>
          <a
            href={result.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cf-orange hover:text-cf-orange-hover transition-colors text-sm"
          >
            {result.website_url} ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branche */}
          <div className="bg-cf-card border border-cf-card-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cf-orange/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cf-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Branche</h2>
            </div>
            <p className="text-cf-gray leading-relaxed">{result.branche}</p>
          </div>

          {/* Tonalität */}
          <div className="bg-cf-card border border-cf-card-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Tonalität & Vibe</h2>
            </div>
            <p className="text-cf-gray leading-relaxed">{result.tonalitaet}</p>
          </div>

          {/* Benefits - full width */}
          <div className="md:col-span-2 bg-cf-card border border-cf-card-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Benefits</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Karriereseite */}
          {result.karriere_seite_url && (
            <div className="md:col-span-2 bg-cf-card border border-cf-card-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Karriereseite</h2>
              </div>
              <a
                href={result.karriere_seite_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
              >
                {result.karriere_seite_url} ↗
              </a>
            </div>
          )}

          {/* Offene Stellen */}
          <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cf-orange/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cf-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">
                Offene Stellen
                <span className="ml-2 text-sm font-normal text-cf-gray">
                  ({result.offene_stellen.length} gefunden)
                </span>
              </h2>
            </div>

            {result.offene_stellen.length > 0 ? (
              <div className="space-y-4">
                {result.offene_stellen.map((stelle, index) => (
                  <div
                    key={index}
                    className="bg-cf-card border border-cf-card-border rounded-2xl p-6 hover:border-cf-orange/30 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-cf-orange">
                      {stelle.titel}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Aufgaben */}
                      <div>
                        <h4 className="text-sm font-medium text-cf-gray mb-3 uppercase tracking-wider">
                          Aufgaben
                        </h4>
                        <ul className="space-y-2">
                          {stelle.aufgaben.map((aufgabe, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-cf-orange mt-1 flex-shrink-0">•</span>
                              {aufgabe}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Vorteile */}
                      <div>
                        <h4 className="text-sm font-medium text-cf-gray mb-3 uppercase tracking-wider">
                          Arbeitgebervorteile
                        </h4>
                        <ul className="space-y-2">
                          {stelle.vorteile.map((vorteil, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                              {vorteil}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-cf-card border border-cf-card-border rounded-2xl p-8 text-center">
                <p className="text-cf-gray">
                  Keine offenen Stellen auf der Website gefunden.
                </p>
              </div>
            )}
          </div>

          {/* Zusammenfassung */}
          <div className="md:col-span-2 bg-cf-card border border-cf-card-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Zusammenfassung</h2>
            </div>
            <p className="text-cf-gray leading-relaxed whitespace-pre-line">
              {result.rohdaten_zusammenfassung}
            </p>
          </div>
        </div>

        {/* Footer action */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onReset}
            className="px-8 py-3 bg-cf-orange hover:bg-cf-orange-hover text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-cf-orange/20 hover:shadow-cf-orange/40"
          >
            Weitere Firma analysieren
          </button>
          <p className="text-cf-gray text-xs mt-4">
            Daten wurden erfolgreich gespeichert und per E-Mail benachrichtigt.
          </p>
        </div>
      </div>
    </div>
  );
}
