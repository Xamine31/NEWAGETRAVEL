# New Age Travel — V18.31

- Actualités : chaque page de publication comporte un seul bouton **Nous contacter** vers `/contact/`. Les boutons vers le voyage et la destination associés ont été supprimés de l’article.
- Administration → Paramètres : rétablissement, dans la dernière fonction effectivement utilisée, de la section **Accueil — choix et ordre d’affichage**. Elle permet de choisir jusqu’à six destinations et six voyages, et leur ordre.
- Les choix sont stockés dans la ligne `homepage_content` de `site_settings` (colonnes JSON `data.home_destinations` et `data.home_voyages`), sans migration SQL.
- Les animations, polices, couleurs, badges et tarifs existants sont conservés.
- Numéros de cache CSS/JS mis à jour vers V18.31.

## Mise en ligne

Conserver les dossiers (`actualite/`, `actualites/`, `administration/`, etc.) et le `supabase-config.js` opérationnel déjà présent sur GitHub. Ne pas écraser la configuration réelle avec les valeurs d’exemple du ZIP.

Dans Administration → Paramètres, la section « Accueil — choix et ordre d’affichage » apparaît désormais en premier. Enregistrer avec le bouton « Enregistrer tous les paramètres » en bas de page.
