# New Age Travel — V15

Cette version inclut toutes les fonctions V13 + V14, puis les retours V15.

## V15
- Configuration du voyage directement dans la fiche voyage.
- Choix d'une période départ/retour proposée sans passer par Contact.
- Option de dates personnalisées avec deux calendriers départ/retour.
- Nombre de voyageurs, budget, coordonnées et message dans la même fiche.
- Envoi de la demande dans `quote_requests` comme en V14.
- Boutons « Configurer » des cartes voyages renvoyés vers la configuration de la fiche.
- Fonds et sections enrichis avec des tons corail, sable/doré, turquoise, lavande et bleu, tout en conservant le bleu New Age Travel.

## Base Supabase
Aucune nouvelle migration n'est nécessaire par rapport au pack V14 combiné : le schéma V14 contient déjà les champs de dates et demandes utilisés par V15.

Si V14 n'a jamais été installé, exécuter une seule fois :
`supabase/v14-combined-migration.sql`

Puis configurer les 3 comptes administrateurs avec `supabase/promote-3-admins.sql`.
