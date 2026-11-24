# New Age Travel V18.30 — retours à la ligne et menu mobile fixe

- Respect des retours à la ligne saisis dans les descriptions des voyages, destinations, cartes et publications, ainsi que les étapes des itinéraires. Aucun contenu enregistré n’est transformé.
- Menu mobile fixé en haut de l’écran lors du défilement et menu déroulant fixé sous la barre, quel que soit l’endroit de la page.
- Correction des anciennes règles contradictoires concernant la position du menu.
- Contrôle des liens CSS et JavaScript avec cache versionné V18.30.

**Supabase :** aucune migration SQL. Préserver le fichier `supabase-config.js` configuré lors du déploiement.

**Déploiement GitHub Pages :** conserver les sous-dossiers `actualite/`, `voyage/`, `destination/`, `administration/`, etc., avec leurs `index.html` respectifs.
