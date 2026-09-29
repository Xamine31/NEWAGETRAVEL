# New Age Travel — V14 combinée

Cette version regroupe les modifications V13 et V14. Il n'est pas nécessaire d'installer V13 avant.

## Installation
1. Remplacez les fichiers du site GitHub Pages par ceux de ce dossier.
2. Conservez vos vraies valeurs dans `supabase-config.js`.
3. Dans Supabase > SQL Editor, exécutez **une seule fois** `supabase/v14-combined-migration.sql`.
4. Pour trois administrateurs, créez les 3 utilisateurs dans Supabase Auth puis adaptez/exécutez `supabase/promote-3-admins.sql`.
5. Dans Administration > Paramètres, renseignez les vrais liens Facebook / Instagram / TikTok / YouTube.

## Inclus
- marque publique « New Age Travel » ; mentions géographiques retirées hors adresse de contact ;
- 3 comptes administrateurs distincts ;
- périodes voyage départ → retour + date personnalisée client ;
- slider de plusieurs voyages en promotion ;
- prix normal + prix promotionnel + réduction calculée ;
- ordre des promotions ;
- réseaux sociaux configurables ;
- programme jour par jour configurable ;
- section « Prochains départs » alimentée par les calendriers ;
- section « Pourquoi voyager avec New Age Travel ? » ;
- palette plus vive (bleu de marque + doré, corail, turquoise) et animations légères.
