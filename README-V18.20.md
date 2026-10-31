# New Age Travel — V18.20

Cette version part de la V18.19 et ajoute :

- affichage des grands visuels sans recadrage forcé (`contain`) pour éviter les photos coupées ;
- conservation du ratio des images dans les cartes, promos, galeries et pages voyage ;
- conseils de résolution dans l’administration (1600 px ou plus pour les grands visuels) ;
- 4 animations de texte pour les promotions : apparition, glissement, zoom léger, montée ;
- choix de police du texte promotionnel dans Administration > Paramètres ;
- choix de la couleur du titre et de la couleur d’accent des promos ;
- prise en charge de `prefers-reduced-motion` ;
- corrections responsive renforcées pour les pages voyage, galeries, formulaires, boutons et textes longs ;
- protections globales contre les débordements horizontaux sur mobile et desktop ;
- cache-busters CSS/JS mis à jour en V18.20.

Aucune migration SQL supplémentaire n’est nécessaire : les nouveaux réglages sont enregistrés dans `site_settings` sous `homepage_content`.

IMPORTANT : le fichier `supabase-config.js` inclus dans l’archive contient les valeurs d’exemple. Lors du déploiement, conserver le `supabase-config.js` réel déjà configuré sur le site.
