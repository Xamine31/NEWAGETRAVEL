# New Age Travel — V18.1

Correctif ciblé après le diagnostic `permission denied for table profiles`.

## À faire dans Supabase
1. SQL Editor > New query.
2. Exécuter `supabase/v18-1-profiles-service-role.sql` une seule fois.
3. Les quatre colonnes de vérification doivent retourner `true`.
4. Garder `Verify JWT with legacy secret` désactivé pour `manage-admins`.
5. La fonction `manage-admins` V18 reste utilisée : aucune clé service_role ne doit être copiée dans le site.

Ce correctif n'accorde aucun accès public à `profiles`. Il redonne uniquement au rôle serveur `service_role` les privilèges SQL nécessaires à l'Edge Function.

## Site
La page Voyages possède maintenant une barre de recherche, sur le même principe que Destinations. Elle recherche dans le titre, la destination liée, les textes, périodes, durée et temps forts. Elle est responsive sur mobile.

## Déploiement
Remplacer les fichiers du site par ceux de cette version, mais conserver votre `supabase-config.js` déjà configuré.
