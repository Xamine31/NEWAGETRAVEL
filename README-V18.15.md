# New Age Travel — V18.15

## Modification
- Administration > Destinations : le champ **Catégorie** est désormais un champ texte libre.
- Les catégories déjà utilisées sont proposées automatiquement comme suggestions.
- Aucune migration SQL n'est nécessaire : `destinations.category` reste un champ texte.
- Toutes les fonctions de la V18.14 sont conservées, notamment Resend, confirmation client, favicon Google et gestion administrateur.

## Installation
Remplacer les fichiers du site par ceux de cette version en conservant votre `supabase-config.js` réel si nécessaire.
