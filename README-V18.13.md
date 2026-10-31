# New Age Travel — V18.13

- Administration : le super-admin peut modifier l’adresse e-mail de connexion des comptes depuis Utilisateurs.
- Edge Function `manage-admins` : nouvelle action sécurisée `email`, synchronisant Supabase Auth et `public.profiles`.
- Sliders/carrousels : chevrons précédent/suivant recentrés avec un dessin CSS uniforme, y compris la galerie voyage et les promotions.
- Toutes les fonctions de V18.12 sont conservées.

Après mise en ligne, redéployer aussi `supabase/functions/manage-admins/index.ts` dans Supabase.
