# New Age Travel France — Ultime V8

Version GitHub Pages avec URLs propres et administration locale de prévisualisation.

## Pages publiques
- `/` : accueil
- `/destinations/` : destinations
- `/destination/?id=cairo` : fiche destination
- `/voyages/` : voyages
- `/voyage/?id=cairo-offer` : fiche voyage
- `/actualites/` : publications
- `/agence/` : agence
- `/contact/` : contact

Les liens publics n'utilisent plus `.html`.

## Administration
Accès direct : `/administration/`

À la première ouverture, créez le compte administrateur local. L'administration permet :
- ajouter / modifier / masquer / supprimer des destinations ;
- ajouter / modifier / masquer / supprimer des voyages ;
- relier un voyage à une destination ;
- ajouter / modifier / masquer / supprimer des publications ;
- relier une publication à un voyage ou à une destination ;
- changer le mot de passe administrateur.

Les modifications sont enregistrées dans `localStorage` pour cette préversion. Elles sont donc propres au navigateur/appareil utilisé. Avant mise en production de l'administration, connecter Supabase (Auth + PostgreSQL + Storage + RLS).

## Test dans VS Code
Lancer avec Live Server depuis la racine du projet puis ouvrir `/administration/` pour l'admin. Éviter d'ouvrir les fichiers HTML directement en `file://`, car `fetch(data.json)` nécessite un serveur local.
