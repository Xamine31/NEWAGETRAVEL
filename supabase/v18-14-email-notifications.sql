-- New Age Travel V18.14
-- Réglage privé de l'adresse qui reçoit les nouvelles demandes clients.
-- À exécuter UNE FOIS dans Supabase > SQL Editor.

create table if not exists public.agency_private_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.agency_private_settings enable row level security;

drop policy if exists "admins read private agency settings" on public.agency_private_settings;
create policy "admins read private agency settings"
on public.agency_private_settings
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins insert private agency settings" on public.agency_private_settings;
create policy "admins insert private agency settings"
on public.agency_private_settings
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins update private agency settings" on public.agency_private_settings;
create policy "admins update private agency settings"
on public.agency_private_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete private agency settings" on public.agency_private_settings;
create policy "admins delete private agency settings"
on public.agency_private_settings
for delete
to authenticated
using (public.is_admin());

grant select, insert, update, delete on public.agency_private_settings to authenticated;

insert into public.agency_private_settings(key, data, updated_at)
values ('notifications', jsonb_build_object('quote_email', 'contact@newagetravel.fr'), now())
on conflict (key) do update
set data = coalesce(public.agency_private_settings.data, '{}'::jsonb)
           || jsonb_build_object('quote_email', coalesce(public.agency_private_settings.data->>'quote_email', 'contact@newagetravel.fr')),
    updated_at = now();

grant all on public.agency_private_settings to service_role;
