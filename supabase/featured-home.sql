-- New Age Travel France — V12 : contenu à la une
-- À exécuter une seule fois dans Supabase > SQL Editor sur une base V11 existante.

create table if not exists public.site_settings (
  key text primary key,
  featured_type text check (featured_type in ('voyage','publication') or featured_type is null),
  featured_id text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings(key, featured_type, featured_id)
values ('homepage', 'voyage', 'cairo-offer')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings
for select using (true);

drop policy if exists "admin manage site settings" on public.site_settings;
create policy "admin manage site settings" on public.site_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;
