import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Enrichment | Candidate Flow®",
  description: "KI-gestützte Firmenanalyse für maximale Recruiting-Effizienz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-cf-dark text-foreground"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
