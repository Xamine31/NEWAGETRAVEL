# New Age Travel France — Ultime V9 Supabase Ready

Cette version garde le site public de la V8 et ajoute la vraie couche Supabase :

- authentification administrateur par Supabase Auth ;
- vérification du rôle `admin` ;
- RLS sur toutes les tables ;
- CRUD Destinations / Voyages / Publications ;
- changement du mot de passe administrateur via Supabase Auth ;
- demandes de devis enregistrées dans `quote_requests` ;
- consultation et statut des demandes dans l'administration ;
- mode de secours local tant que Supabase n'est pas configuré.

## Mise en route Supabase

1. Crée un projet Supabase.
2. Ouvre `SQL Editor` et exécute `supabase/schema.sql`.
3. Exécute ensuite `supabase/seed.sql` pour importer les données actuelles du site.
4. Dans `Authentication > Users`, crée le compte administrateur avec son e-mail et son mot de passe.
5. Dans `supabase/promote-admin.sql`, remplace `admin@agence.fr` par l'e-mail du compte puis exécute le script dans SQL Editor.
6. Dans Supabase, récupère l'URL du projet et la clé publique `anon`/`publishable`.
7. Ouvre `supabase-config.js` et remplace les deux valeurs d'exemple.
8. Publie le dossier sur GitHub Pages.

## Administration

Accès : `/administration/`

Ne mets jamais une clé `service_role`, un mot de passe de base de données ou une autre clé secrète dans `supabase-config.js` ou GitHub.

## Prévisualisation locale

Avec VS Code + Live Server, ouvre `index.html` ou lance :

```bash
python -m http.server 5500
```

Puis : `http://localhost:5500/`

Administration : `http://localhost:5500/administration/`

## Images depuis l'administration
La V11 utilise le bucket Supabase Storage `site-images`. Pour un projet Supabase déjà configuré avec la V10, exécuter une seule fois `supabase/storage.sql` dans SQL Editor. Ensuite les formulaires Destinations, Voyages et Publications permettent l'import direct d'images. La galerie des voyages accepte plusieurs fichiers.


## Mise à la une (V12)
Pour une base Supabase déjà configurée en V11, exécuter `supabase/featured-home.sql` une seule fois. L’administration permet ensuite de choisir un seul voyage ou une seule publication à afficher dans le visuel principal de l’accueil.
