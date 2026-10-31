# New Age Travel — V18.14 Ultime

## Nouveautés

- Notification e-mail automatique à l'agence lors d'une nouvelle demande client.
- Accusé de réception automatique au client, envoyé à l’adresse qu’il a saisie dans le formulaire.
- Un e-mail automatique de confirmation est envoyé au client pour confirmer que sa demande a bien été enregistrée.
- Aucune redirection vers une messagerie : le client reste sur New Age Travel.
- La demande est enregistrée dans `quote_requests` et reste visible dans Administration > Demandes clients.
- Nouvelle Edge Function `notify-quote-request` pour l'enregistrement + notification Resend.
- Mode de secours : si la fonction e-mail est indisponible, le site tente encore l'enregistrement direct dans `quote_requests` afin de ne pas perdre la demande.
- Administration > Paramètres : nouveau champ **E-mail de réception des demandes**.
- L'adresse de notification est stockée dans une table privée, non lisible par les visiteurs.
- Adresse initiale : `contact@newagetravel.fr`, modifiable ensuite depuis l'administration.
- Le `manage-admins` contient aussi le correctif validé de changement d'adresse Auth administrateur (mise à jour + vérification de l'adresse réellement retournée par Supabase).
- Toutes les fonctions et le design de la V18.13 sont conservés, y compris les corrections des flèches de sliders.

## Installation Supabase — une fois

### 1. SQL

Dans Supabase > SQL Editor, exécuter entièrement :

`supabase/v18-14-email-notifications.sql`

Ce script crée `agency_private_settings`, ses règles RLS et initialise l'adresse de réception à `contact@newagetravel.fr`.

### 2. Edge Function

Créer/déployer une fonction nommée exactement :

`notify-quote-request`

Copier le contenu de :

`supabase/functions/notify-quote-request/index.ts`

Comme le formulaire est public, désactiver **Verify JWT with legacy secret** pour cette fonction si Supabase affiche cette option.

### 3. Resend

Après avoir validé `newagetravel.fr` dans Resend, créer une API Key puis l'ajouter dans Supabase > Edge Functions > Secrets :

`RESEND_API_KEY = re_...`

Optionnel :

`RESEND_FROM_EMAIL = New Age Travel <notifications@newagetravel.fr>`

Ne jamais mettre la clé Resend dans `supabase-config.js`, `app.js` ou GitHub Pages.

### 4. Test

1. Administration > Paramètres : vérifier `contact@newagetravel.fr` dans **E-mail de réception des demandes** et enregistrer.
2. Ouvrir le site public et envoyer une demande test.
3. Vérifier qu'elle apparaît dans Administration > Demandes clients.
4. Vérifier la réception de la notification dans la boîte configurée.
5. Vérifier que le client test reçoit aussi « Votre demande a bien été reçue — New Age Travel ».

## Mini procédure Resend

1. Créer/ouvrir le compte Resend.
2. Domains > Add Domain > `newagetravel.fr`.
3. Ajouter chez OVH uniquement les enregistrements DNS fournis par Resend. Ne supprimer aucun MX/TXT existant de la messagerie.
4. Attendre que le domaine passe à **Verified** dans Resend.
5. API Keys > Create API Key.
6. Copier la clé une seule fois et la mettre dans le secret Supabase `RESEND_API_KEY`.
7. Déployer `notify-quote-request`, puis envoyer une demande test depuis le site.

## Important lors de la mise à jour GitHub

Si votre `supabase-config.js` contient déjà les vraies informations publiques de votre projet Supabase, conservez votre fichier configuré lors du remplacement du site.

## Fonctionnement e-mail V18.14 finale

Une seule demande client déclenche deux e-mails :

1. une notification complète à l’agence ; son bouton Répondre cible l’adresse du client ;
2. une confirmation au client ; son bouton Répondre cible l’adresse de réception configurée dans Administration > Paramètres.

Si Resend est temporairement indisponible, la demande reste enregistrée dans `quote_requests` afin de ne pas perdre le prospect.

## Favicon Google — mise à jour
- Ajout de `favicon.ico`, `favicon-48.png`, `favicon-96.png` et `favicon-192.png` à partir du logo New Age Travel existant.
- Déclaration du favicon sur toutes les pages HTML, y compris les routes propres imbriquées.
- URL stable à la racine du domaine pour faciliter la récupération par Google.
- Après publication, demander une nouvelle indexation de `https://www.newagetravel.fr/` dans Google Search Console. L'affichage du nouveau favicon dans les résultats Google dépend ensuite du prochain crawl de Google.
