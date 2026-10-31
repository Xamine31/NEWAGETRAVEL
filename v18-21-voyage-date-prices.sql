-- New Age Travel — V18.21
-- Prix spécifique pour chaque période de voyage.
-- À exécuter une seule fois dans Supabase > SQL Editor.

alter table public.voyage_dates
  add column if not exists price text,
  add column if not exists price_value numeric;

comment on column public.voyage_dates.price is 'Prix affiché pour cette période, ex. 1 290 €';
comment on column public.voyage_dates.price_value is 'Prix numérique de cette période, utilisé pour calculs et filtres';
