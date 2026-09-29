-- 1) Créez d'abord les 3 utilisateurs dans Supabase > Authentication > Users.
-- 2) Remplacez les 3 adresses ci-dessous puis exécutez ce script.
-- Le site accepte plusieurs admins ; cette requête limite volontairement la promotion à ces 3 comptes.

update public.profiles
set role='admin'
where lower(email) in (
  lower('ADMIN1@EXEMPLE.COM'),
  lower('ADMIN2@EXEMPLE.COM'),
  lower('ADMIN3@EXEMPLE.COM')
);

select email, role from public.profiles where role='admin' order by email;
