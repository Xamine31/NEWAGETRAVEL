-- New Age Travel — V14 migration combinée
-- À exécuter UNE SEULE FOIS sur votre base actuelle (V12/V12.3).
-- Elle contient les ajouts V13 + V14 et conserve les données existantes.

-- V13 : promotions, dates départ/retour, réseaux sociaux, demandes
alter table public.voyages add column if not exists is_promo boolean not null default false;

create table if not exists public.voyage_dates (
  id uuid primary key default gen_random_uuid(),
  voyage_id text not null references public.voyages(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint voyage_dates_valid_range check (end_date >= start_date)
);
create index if not exists voyage_dates_voyage_idx on public.voyage_dates(voyage_id,start_date);
alter table public.voyage_dates enable row level security;
drop policy if exists "public read active voyage dates" on public.voyage_dates;
create policy "public read active voyage dates" on public.voyage_dates for select using (active = true or public.is_admin());
drop policy if exists "admin manage voyage dates" on public.voyage_dates;
create policy "admin manage voyage dates" on public.voyage_dates for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.voyage_dates to anon, authenticated;
grant all on public.voyage_dates to authenticated;

alter table public.quote_requests add column if not exists voyage_id text references public.voyages(id) on delete set null;
alter table public.quote_requests add column if not exists voyage_date_id uuid references public.voyage_dates(id) on delete set null;
alter table public.quote_requests add column if not exists custom_start_date date;
alter table public.quote_requests add column if not exists custom_end_date date;

-- V14 : prix promo, ordre du slider et programme jour par jour
alter table public.voyages add column if not exists promo_price text;
alter table public.voyages add column if not exists promo_price_value numeric;
alter table public.voyages add column if not exists promo_sort_order integer not null default 0;
alter table public.voyages add column if not exists itinerary jsonb not null default '[]'::jsonb;

-- Paramètres agence / réseaux sociaux
insert into public.site_settings(key,data,updated_at)
values ('agency','{}'::jsonb,now())
on conflict (key) do nothing;

-- L'ancien système de vedette unique n'est plus utilisé.
update public.site_settings
set featured_type=null, featured_id=null, updated_at=now()
where key='homepage';
