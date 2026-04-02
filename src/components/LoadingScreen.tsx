"use client";

import { useState, useEffect } from "react";

const loadingSteps = [
  { text: "Website wird aufgerufen...", icon: "🌐" },
  { text: "Inhalte werden gescannt...", icon: "📡" },
  { text: "Karriereseite wird gesucht...", icon: "🔍" },
  { text: "Stellenanzeigen werden extrahiert...", icon: "📋" },
  { text: "Firmendaten werden analysiert...", icon: "🧠" },
  { text: "Branche & Benefits werden identifiziert...", icon: "🏢" },
  { text: "Tonalität wird bewertet...", icon: "🎯" },
  { text: "Ergebnisse werden zusammengestellt...", icon: "✨" },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cf-dark relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cf-orange/3 blur-[150px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-cf-orange/5 blur-[100px] animate-pulse-ring" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-orange-600/5 blur-[80px] animate-pulse-ring" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#e8530e 1px, transparent 1px), linear-gradient(90deg, #e8530e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo with rings */}
        <div className="relative w-40 h-40 mx-auto mb-12">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-cf-orange/20 animate-spin-slow" />
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border border-cf-orange/30 animate-spin-reverse" />
          {/* Inner ring */}
          <div className="absolute inset-8 rounded-full border border-cf-orange/10 animate-spin-slow" style={{ animationDuration: "12s" }} />

          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cf-orange to-orange-700 flex items-center justify-center shadow-lg shadow-cf-orange/30">
              <svg viewBox="0 0 32 32" fill="none" className="w-12 h-12">
                <path d="M6 8h4v16H6zM12 8h4v5h-4zM12 19h4v5h-4zM18 8h4v16h-4z" fill="white" />
              </svg>
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cf-orange shadow-lg shadow-cf-orange/50" />
          </div>
          <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: "10s" }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cf-orange/60" />
          </div>
        </div>

        {/* Brand name */}
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          CANDIDATE FLOW<sup className="text-[0.6em]">®</sup>
        </h2>
        <p className="text-cf-gray text-sm mb-10 uppercase tracking-[0.3em]">
          Lead Enrichment
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-10">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                index < currentStep
                  ? "bg-cf-orange/10 border border-cf-orange/20"
                  : index === currentStep
                  ? "bg-cf-card border border-cf-orange/40 shadow-lg shadow-cf-orange/5"
                  : "opacity-30"
              }`}
            >
              <span className="text-sm w-5 flex-shrink-0">
                {index < currentStep ? (
                  <svg className="w-5 h-5 text-cf-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </span>
              <span
                className={`text-sm text-left flex-1 ${
                  index === currentStep ? "text-white" : index < currentStep ? "text-cf-orange/80" : "text-cf-gray"
                }`}
              >
                {step.text}
                {index === currentStep && <span className="text-cf-orange">{dots}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-cf-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cf-orange to-orange-400 rounded-full animate-progress-bar"
          />
        </div>
        <p className="text-cf-gray text-xs mt-3">
          KI analysiert die Website – bitte einen Moment Geduld
        </p>
      </div>
    </div>
  );
}
