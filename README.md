# Sites Pro Saint-Michel

Landing page + chat widget (livré en 24h). Ce dépôt contient le site statique et un serveur optionnel pour activer des réponses IA via OpenAI.

Fichiers principaux:
- index.html — page d'accueil
- styles.css — styles
- chat.js — widget chat côté client (mode FAQ local si pas de serveur)
- server.js — serveur optionnel Node/Express (proxy vers l'API OpenAI)
- package.json — dépendances pour le serveur
- .env.example — exemple de variables d'environnement

Déploiement rapide (site statique, sans IA)
1. Le site statique suffit pour être en ligne. Tu peux utiliser GitHub Pages, Netlify ou Vercel.
2. Pour GitHub Pages :
   - Va dans les Settings du dépôt -> Pages
   - Choisis la branche `main` et le dossier `/ (root)`, puis Enregistrer.
   - L'URL sera : https://<ton-user>.github.io/sites-pro-saint-michel (peut prendre quelques minutes).

Activer le chat IA (optionnel)
1. Déploie le serveur (server.js) sur Render / Railway / Fly / Heroku / Vercel Serverless.
2. Dans la config de ton service, ajoute `OPENAI_API_KEY` (valeur : ta clé OpenAI).
3. Si le serveur est sur un domaine différent, édite `chat.js` et remplace `API_ENDPOINT` par l'URL complète (ex: https://mon-serveur.example.com/api/chat).

Support
- Si tu veux : je peux activer le GitHub Pages pour toi, configurer un workflow CI/CD, ou déployer le serveur IA (besoin d'accès de ta part pour certains services). Demande et je m'en occupe.
