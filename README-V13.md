# New Age Travel — V13

Mise à jour : nom New Age Travel, slider de voyages en promotion, dates de voyage sous forme d’intervalles départ/retour, choix d’une date proposée ou de dates personnalisées côté client, réseaux sociaux configurables, et support de 3 comptes administrateurs Supabase.

## Installation
1. Conservez votre `supabase-config.js` déjà configuré.
2. Exécutez une seule fois `supabase/v13-migration.sql` dans Supabase > SQL Editor.
3. Pour les comptes admin, créez jusqu’à 3 utilisateurs dans Supabase Auth puis adaptez/exécutez `supabase/promote-3-admins.sql`.
4. Déployez les fichiers de cette version sur GitHub Pages.

## Administration
- Voyages : case `Promotion accueil` directement dans la liste. Plusieurs voyages peuvent être cochés.
- Modification d’un voyage : calendrier départ + retour, avec plusieurs périodes possibles.
- Paramètres : liens Facebook, Instagram, TikTok et YouTube.
- Demandes clients : la période choisie ou personnalisée est visible.
