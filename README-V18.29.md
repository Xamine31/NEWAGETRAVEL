# New Age Travel — V18.29

## Nouveautés

1. **Actualités — page propre à chaque publication**
   - Les boutons « Découvrir » ouvrent `/actualite/?id=<identifiant>`.
   - Grande image sans recadrage forcé, titre, date, texte intégral.
   - Boutons vers le voyage et/ou la destination associés si publiés.
   - Les articles absents ou désactivés affichent un message au lieu d'un autre contenu.

2. **Administration > Paramètres — aperçu des polices**
   - Dans les trois champs de l'accueil, la police du champ et de la zone d'aperçu change immédiatement quand une police est choisie.
   - La couleur principale est aussi reprise dans l'aperçu.
   - Les réglages ne sont enregistrés qu'avec le bouton général.

3. **Administration > Paramètres — éléments mis à la une**
   - Sélection et ordre des destinations et des voyages de l'accueil (jusqu'à 6 chacun).
   - Un même élément sélectionné deux fois n'est affiché qu'une fois.
   - Une position « Aucun » n'affiche rien.
   - Par défaut, les 3 premiers éléments sont utilisés jusqu'à ce qu'un choix soit enregistré.
   - Les promotions du slider restent gérées par les réglages existants « Promotion accueil ».

## Déploiement

- Mettre en ligne le contenu complet du ZIP sur GitHub Pages en **conservant les dossiers de pages**, notamment `actualite/index.html`.
- **Conserver le fichier `supabase-config.js` actuellement configuré** : celui du ZIP peut contenir des valeurs d'exemple.
- Aucune migration SQL supplémentaire : `site_settings` existe déjà.
- Vider le cache/actualiser après publication si nécessaire.

## Contrôles

- Syntaxe de `app.js` et `admin.js` vérifiée avec `node --check`.
- Liens de ressources des pages existantes vérifiés.
- Archive ZIP vérifiée.
- Rendu visuel en navigateur réel et fonctionnement avec le Supabase de production à confirmer après mise en ligne.
