-- New Age Travel France — stockage des images
-- À exécuter une seule fois dans Supabase > SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  8388608,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique : les images du site doivent être visibles par les visiteurs.
drop policy if exists "public read site images" on storage.objects;
create policy "public read site images"
on storage.objects for select
to public
using (bucket_id = 'site-images');

-- Seuls les administrateurs peuvent importer, remplacer ou supprimer des fichiers.
drop policy if exists "admin insert site images" on storage.objects;
create policy "admin insert site images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admin update site images" on storage.objects;
create policy "admin update site images"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images' and public.is_admin())
with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admin delete site images" on storage.objects;
create policy "admin delete site images"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images' and public.is_admin());
