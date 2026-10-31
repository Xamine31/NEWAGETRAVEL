-- V18.26: badges indépendants, sans suppression des badges actuels.
-- Exécuter UNE fois dans Supabase > SQL Editor.
DO $$ BEGIN
  IF to_regclass('public.destinations') IS NULL OR to_regclass('public.voyages') IS NULL THEN
    RAISE EXCEPTION 'Tables voyages/destinations manquantes';
  END IF;
END $$;
ALTER TABLE public.destinations
 ADD COLUMN IF NOT EXISTS badge_2 text,
 ADD COLUMN IF NOT EXISTS badge_color text DEFAULT '#075aa8',
 ADD COLUMN IF NOT EXISTS badge_text_color text DEFAULT '#ffffff',
 ADD COLUMN IF NOT EXISTS badge_2_color text DEFAULT '#df6635',
 ADD COLUMN IF NOT EXISTS badge_2_text_color text DEFAULT '#ffffff';
ALTER TABLE public.voyages
 ADD COLUMN IF NOT EXISTS badge_2 text,
 ADD COLUMN IF NOT EXISTS badge_color text DEFAULT '#075aa8',
 ADD COLUMN IF NOT EXISTS badge_text_color text DEFAULT '#ffffff',
 ADD COLUMN IF NOT EXISTS badge_2_color text DEFAULT '#df6635',
 ADD COLUMN IF NOT EXISTS badge_2_text_color text DEFAULT '#ffffff';
