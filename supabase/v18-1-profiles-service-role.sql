-- New Age Travel V18.1
-- Correctif des permissions serveur de la fonction manage-admins.
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- N'ouvre PAS la table profiles au public : ces droits sont réservés au rôle serveur service_role.

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.profiles to service_role;

-- Vérification informative des privilèges accordés.
select
  has_table_privilege('service_role', 'public.profiles', 'SELECT') as service_role_can_select_profiles,
  has_table_privilege('service_role', 'public.profiles', 'INSERT') as service_role_can_insert_profiles,
  has_table_privilege('service_role', 'public.profiles', 'UPDATE') as service_role_can_update_profiles,
  has_table_privilege('service_role', 'public.profiles', 'DELETE') as service_role_can_delete_profiles;
