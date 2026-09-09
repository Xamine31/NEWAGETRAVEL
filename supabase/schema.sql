-- New Age Travel France — Supabase V9
-- À exécuter une seule fois dans Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.destinations (
  id text primary key,
  name text not null,
  region text,
  category text,
  image text,
  description text,
  price text,
  price_value numeric,
  duration text,
  departure text,
  highlights jsonb not null default '[]'::jsonb,
  offer_id text,
  month text,
  travel_type text,
  badge text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voyages (
  id text primary key,
  destination_id text references public.destinations(id) on delete set null,
  title text not null,
  subtitle text,
  date text,
  image text,
  price text,
  price_value numeric,
  duration text,
  departure text,
  text text,
  included jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  badge text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.publications (
  id text primary key,
  title text not null,
  date text,
  text text,
  image text,
  voyage_id text references public.voyages(id) on delete set null,
  destination_id text references public.destinations(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  destination text,
  period text,
  travelers integer,
  budget text,
  message text,
  status text not null default 'nouvelle' check (status in ('nouvelle','en_cours','traitee','archivee')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(user_id,email,role)
  values (new.id,new.email,'user')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.voyages enable row level security;
alter table public.publications enable row level security;
alter table public.quote_requests enable row level security;

-- Profils : l'utilisateur voit son profil, un admin voit tous les profils.
drop policy if exists "profile own or admin read" on public.profiles;
create policy "profile own or admin read" on public.profiles
for select using (auth.uid() = user_id or public.is_admin());

-- Destinations : public = uniquement les contenus actifs ; admin = tout + CRUD.
drop policy if exists "public read active destinations" on public.destinations;
create policy "public read active destinations" on public.destinations
for select using (active = true or public.is_admin());

drop policy if exists "admin manage destinations" on public.destinations;
create policy "admin manage destinations" on public.destinations
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Voyages.
drop policy if exists "public read active voyages" on public.voyages;
create policy "public read active voyages" on public.voyages
for select using (active = true or public.is_admin());

drop policy if exists "admin manage voyages" on public.voyages;
create policy "admin manage voyages" on public.voyages
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Publications.
drop policy if exists "public read active publications" on public.publications;
create policy "public read active publications" on public.publications
for select using (active = true or public.is_admin());

drop policy if exists "admin manage publications" on public.publications;
create policy "admin manage publications" on public.publications
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Demandes de devis : un visiteur peut en créer une, mais jamais les lire.
drop policy if exists "public create quote request" on public.quote_requests;
create policy "public create quote request" on public.quote_requests
for insert to anon, authenticated with check (true);

drop policy if exists "admin read quote requests" on public.quote_requests;
create policy "admin read quote requests" on public.quote_requests
for select to authenticated using (public.is_admin());

drop policy if exists "admin update quote requests" on public.quote_requests;
create policy "admin update quote requests" on public.quote_requests
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete quote requests" on public.quote_requests;
create policy "admin delete quote requests" on public.quote_requests
for delete to authenticated using (public.is_admin());

-- Met à jour automatiquement updated_at.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists destinations_touch_updated_at on public.destinations;
create trigger destinations_touch_updated_at before update on public.destinations
for each row execute procedure public.touch_updated_at();

drop trigger if exists voyages_touch_updated_at on public.voyages;
create trigger voyages_touch_updated_at before update on public.voyages
for each row execute procedure public.touch_updated_at();

drop trigger if exists publications_touch_updated_at on public.publications;
create trigger publications_touch_updated_at before update on public.publications
for each row execute procedure public.touch_updated_at();

-- Privilèges API minimaux ; RLS reste la barrière d'autorisation.
grant select on public.destinations, public.voyages, public.publications to anon, authenticated;
grant insert on public.quote_requests to anon, authenticated;
grant select, update, delete on public.quote_requests to authenticated;
grant all on public.destinations, public.voyages, public.publications to authenticated;
grant select on public.profiles to authenticated;

-- Stockage des images (également disponible séparément dans supabase/storage.sql).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images','site-images',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public read site images" on storage.objects;
create policy "public read site images" on storage.objects for select to public using (bucket_id='site-images');
drop policy if exists "admin insert site images" on storage.objects;
create policy "admin insert site images" on storage.objects for insert to authenticated with check (bucket_id='site-images' and public.is_admin());
drop policy if exists "admin update site images" on storage.objects;
create policy "admin update site images" on storage.objects for update to authenticated using (bucket_id='site-images' and public.is_admin()) with check (bucket_id='site-images' and public.is_admin());
drop policy if exists "admin delete site images" on storage.objects;
create policy "admin delete site images" on storage.objects for delete to authenticated using (bucket_id='site-images' and public.is_admin());
