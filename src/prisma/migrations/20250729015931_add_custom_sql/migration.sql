-- Habilita a extensão unaccent
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION f_unaccent(text)
RETURNS text AS $$
SELECT public.unaccent('public.unaccent', $1)
$$ LANGUAGE sql IMMUTABLE;

CREATE INDEX "idx_gin_records_unaccented_content" ON "records"
USING GIN (f_unaccent(dados_json->>'content') gin_trgm_ops);