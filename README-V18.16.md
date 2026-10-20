# New Age Travel V18.16

- Ajout des filtres date de départ et date de retour sur la recherche d'accueil, Destinations et Voyages.
- Recherche flexible : résultats proches jusqu'à ±7 jours autour des dates choisies.
- Les dates utilisent les périodes configurées dans Administration > Voyages.
- Les principaux textes de la page d'accueil sont maintenant modifiables dans Administration > Paramètres.
- Aucun changement de schéma SQL nécessaire : les textes sont stockés dans `site_settings` avec la clé `homepage_content`.
- Conserver le fichier `supabase-config.js` réel lors du déploiement.
