# New Age Travel V18 — correctif gestion des administrateurs

Cette version corrige l’appel de la fonction `manage-admins` et affiche désormais la vraie erreur dans l’administration au lieu du message générique indiquant que la fonction n’est pas déployée.

## Mise à jour
1. Remplacer les fichiers du site par ceux de la V18 en conservant votre `supabase-config.js` déjà configuré.
2. Dans Supabase > Edge Functions > `manage-admins` > Code, remplacer entièrement `index.ts` par `supabase/functions/manage-admins/index.ts`, puis cliquer sur **Deploy updates**.
3. Garder **Verify JWT with legacy secret** désactivé : la fonction vérifie elle-même le jeton auprès de Supabase Auth puis exige le rôle `super_admin`.
4. Se déconnecter/reconnecter à l’administration puis ouvrir **Utilisateurs**.

Aucune nouvelle migration SQL n’est nécessaire si `v17-admin-roles.sql` a déjà été exécutée et que le compte principal est déjà en `super_admin`.
