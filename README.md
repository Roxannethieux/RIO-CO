# RIO & CO. — Site vitrine

Site vitrine de **RIO & CO.**, entreprise de rénovation tout corps d'état dirigée par **Maxime Rio**, spécialisée en plomberie.

Stack : **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion**, back-office intégré pour ajouter les photos de réalisations.

---

## 1. Mise en route en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables (voir section 3)
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

## 2. Déployer en production (Vercel — recommandé)

1. Aller sur [vercel.com/new](https://vercel.com/new) et importer le dépôt GitHub `Roxannethieux/rio-co`.
2. Vercel détecte automatiquement Next.js — aucune configuration de build nécessaire.
3. Avant le premier déploiement, ajouter les **variables d'environnement** (Project Settings → Environment Variables) listées dans `.env.example` — voir détail section 3.
4. Déployer. Le site est disponible sur une URL `*.vercel.app` immédiatement ; un nom de domaine personnalisé peut être ajouté ensuite dans Project Settings → Domains.
5. Chaque `git push` sur la branche principale redéploie automatiquement le site.

## 3. Variables d'environnement à configurer

| Variable | Rôle | Où l'obtenir |
|---|---|---|
| `ADMIN_PASSWORD` | Mot de passe d'accès à `/admin` | À définir vous-même (mot de passe fort) |
| `ADMIN_SESSION_SECRET` | Clé de signature de la session admin | Chaîne aléatoire longue, ex. générée avec `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` | Stockage des photos de réalisations | Créer un compte gratuit sur [cloudinary.com](https://cloudinary.com) → Dashboard |
| `CLOUDINARY_API_KEY` | idem | idem |
| `CLOUDINARY_API_SECRET` | idem | idem |
| `RESEND_API_KEY` | Envoi des emails du formulaire de contact | Créer un compte gratuit sur [resend.com](https://resend.com) → API Keys |
| `CONTACT_TO_EMAIL` | Adresse recevant les demandes de devis | Email de Maxime Rio |
| `CONTACT_FROM_EMAIL` | Adresse expéditrice des emails | Voir note ci-dessous |

**Note Resend** : sans domaine vérifié, Resend impose l'expéditeur `onboarding@resend.dev` (valeur par défaut déjà configurée). Pour envoyer depuis `contact@rio-co.fr`, vérifier le domaine dans Resend (DNS) puis mettre à jour `CONTACT_FROM_EMAIL`.

Tant que `CLOUDINARY_*` n'est pas configuré, la galerie affiche un état « à venir » élégant et le back-office affiche un message d'avertissement clair. Tant que `RESEND_API_KEY` n'est pas configuré, le formulaire de contact affiche un message invitant à contacter par téléphone en attendant.

## 4. Utiliser le back-office (ajout des photos de réalisations)

1. Aller sur `/admin/login` et se connecter avec `ADMIN_PASSWORD`.
2. Dans `/admin`, remplir le formulaire (photo, titre, catégorie, description optionnelle) et cliquer sur « Publier la photo ».
3. La photo apparaît immédiatement dans la galerie publique (`/realisations` et sur la page d'accueil).
4. Chaque photo peut être supprimée depuis le même écran.

Aucune compétence technique n'est requise après la configuration initiale des variables d'environnement.

## 5. Contenu à finaliser avant l'envoi au client

Les éléments suivants sont volontairement placés en placeholders clairement identifiables (`[...]`) dans `src/lib/site-config.ts` et sur les pages légales, à compléter avec les informations réelles de l'entreprise avant mise en ligne définitive :

- Coordonnées : téléphone, adresse, zone d'intervention précise
- Mentions légales : forme juridique, SIRET, RCS, code APE
- Assurance décennale : assureur, n° de police, zone de couverture
- Médiateur de la consommation (obligatoire pour les professionnels du bâtiment)
- Photo de profil de Maxime Rio (actuellement un bloc de remplacement dans la section « À propos »)
- Avis clients (actuellement des exemples de démonstration)

Le logo actuel (`src/components/Logo.tsx`) est une réinterprétation vectorielle originale du monogramme transmis, redessinée en SVG. Si un rendu pixel-exact du logo fourni est nécessaire, remplacer ce composant par le fichier logo définitif (SVG de préférence).

## 6. Structure du projet

```
src/
  app/
    (site)/            pages publiques (accueil, réalisations, mentions légales, confidentialité)
    admin/              back-office protégé par mot de passe
    api/                routes API (contact, authentification admin, gestion des réalisations)
  components/           composants UI (Header, Footer, sections de la page d'accueil, admin/)
  lib/                  configuration du site, intégrations Cloudinary / Resend, authentification
```

## 7. Commandes utiles

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm run start   # démarrer le build de production en local
npm run lint    # vérification du code
```
