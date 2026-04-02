-- ===========================================
-- Supabase Schema für Lead Enrichment Tool
-- ===========================================
-- Führe dieses SQL im Supabase SQL Editor aus

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  branche TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  tonalitaet TEXT,
  offene_stellen JSONB DEFAULT '[]'::jsonb,
  karriere_seite_url TEXT,
  rohdaten_zusammenfassung TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Suche nach Firmenname
CREATE INDEX IF NOT EXISTS idx_leads_company_name ON leads (company_name);

-- Index für chronologische Sortierung
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

-- RLS (Row Level Security) deaktivieren für Service Key Zugriff
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Service Key kann alles
CREATE POLICY "Service key full access" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);
