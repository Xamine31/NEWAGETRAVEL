-- New Age Travel France — V12.3 : À la une = voyage OU destination
-- À exécuter une seule fois si featured-home.sql de la V12 a déjà été exécuté.

update public.site_settings
set featured_type = null, featured_id = null, updated_at = now()
where key = 'homepage' and featured_type = 'publication';

alter table public.site_settings
drop constraint if exists site_settings_featured_type_check;

alter table public.site_settings
add constraint site_settings_featured_type_check
check (featured_type in ('voyage','destination') or featured_type is null);
