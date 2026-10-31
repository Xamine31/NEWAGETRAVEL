-- New Age Travel V17 — rôles administrateurs
-- À exécuter APRÈS v14-combined-migration.sql.
-- Le premier compte déjà administrateur devient administrateur principal.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user','admin','super_admin'));

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where user_id=auth.uid() and role in ('admin','super_admin'));
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where user_id=auth.uid() and role='super_admin');
$$;

-- Si les 3 comptes existent déjà, le plus ancien admin devient le compte principal.
update public.profiles
set role='super_admin'
where user_id=(select user_id from public.profiles where role='admin' order by created_at asc nulls last limit 1)
and not exists(select 1 from public.profiles where role='super_admin');

grant execute on function public.is_super_admin() to authenticated;
