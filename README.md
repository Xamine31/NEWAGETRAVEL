# notify-quote-request — V18.14

Edge Function publique appelée par le formulaire de devis.

Elle :
1. enregistre la demande dans `quote_requests` ;
2. lit l'adresse de réception dans `agency_private_settings` ;
3. envoie une notification via Resend ;
4. n'envoie aucun e-mail automatique au client.

Secrets nécessaires :
- `RESEND_API_KEY` (obligatoire pour l'e-mail)
- `RESEND_FROM_EMAIL` (optionnel, défaut : `New Age Travel <notifications@newagetravel.fr>`)
- `AGENCY_NOTIFICATION_EMAIL` (optionnel, secours ; l'adresse configurée dans l'admin est prioritaire)

Déployer la fonction `notify-quote-request`. Pour permettre l'appel depuis le formulaire public, désactiver la vérification JWT héritée si l'éditeur Supabase affiche cette option. La fonction ne donne aucun accès admin et utilise la service role uniquement côté serveur.
