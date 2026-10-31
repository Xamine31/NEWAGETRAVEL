# New Age Travel — V17

## Installation depuis votre base actuelle
1. Si ce n'est pas déjà fait, exécuter `supabase/v14-combined-migration.sql`.
2. Exécuter `supabase/v17-admin-roles.sql`.
3. Les 3 comptes Auth doivent exister. Le premier profil admin existant devient `super_admin`.
4. Pour que l'administrateur principal puisse créer/supprimer les autres comptes et changer leur mot de passe, déployer la fonction Supabase Edge `supabase/functions/manage-admins` :
   `supabase functions deploy manage-admins`
   La clé service_role reste uniquement côté serveur Supabase et ne doit jamais être ajoutée à `supabase-config.js`.

## Rôles
- `super_admin` : contenu + demandes + paramètres + création/suppression des comptes + changement de leur mot de passe.
- `admin` : contenu + demandes + paramètres + changement de son propre mot de passe. Aucun accès à la gestion des autres comptes.

## Interface client
- Un seul bouton `Découvrir` sur les cartes destination, voyage et publication.
- Navigation mobile complète : Accueil, Destinations, Voyages, Actualités, L'agence, Contact et Devis.
- Thème enrichi avec bleu dominant, turquoise, lavande, doré et corail.
- Textes techniques/internes retirés des zones destinées aux clients.
