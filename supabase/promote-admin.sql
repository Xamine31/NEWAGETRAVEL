-- Remplace l'adresse ci-dessous par l'e-mail du compte créé dans Supabase Auth.
-- Exécute ensuite ce script dans le SQL Editor.
update public.profiles
set role = 'admin'
where user_id = (
  select id from auth.users where email = 'contact@oriadigital.fr'
);

-- Vérification : la ligne doit afficher role = admin.
select p.user_id, p.email, p.role
from public.profiles p
where p.email = 'contact@oriadigital.fr';
