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
| `POSTGRES_URL` | Base de données (prise de rendez-vous) | Onglet **Storage** du projet Vercel → **Create Database** → **Postgres** (injecté automatiquement) |
| `GOOGLE_MAPS_API_KEY` | Calcul des temps de trajet entre rendez-vous | [console.cloud.google.com](https://console.cloud.google.com) → activer *Distance Matrix API* + *Geocoding API* → créer une clé |

**Note Resend** : sans domaine vérifié, Resend impose l'expéditeur `onboarding@resend.dev` (valeur par défaut déjà configurée). Pour envoyer depuis `contact@rio-co.fr`, vérifier le domaine dans Resend (DNS) puis mettre à jour `CONTACT_FROM_EMAIL`.

Tant que `CLOUDINARY_*` n'est pas configuré, la galerie affiche un état « à venir » élégant et le back-office affiche un message d'avertissement clair. Tant que `RESEND_API_KEY` n'est pas configuré, le formulaire de contact affiche un message invitant à contacter par téléphone en attendant. Tant que `POSTGRES_URL` / `GOOGLE_MAPS_API_KEY` / l'adresse de départ ne sont pas tous les trois configurés, la page Contact affiche automatiquement un simple formulaire de message à la place de la prise de rendez-vous en ligne.

## 4. Utiliser le back-office (ajout des photos de réalisations)

1. Aller sur `/admin/login` et se connecter avec `ADMIN_PASSWORD`.
2. Dans `/admin`, remplir le formulaire : photo, **nom du projet/chantier**, **type de photo** (avant travaux / après travaux / photo simple), titre, catégorie, description optionnelle.
3. Utiliser **le même nom de projet** pour toutes les photos d'un même chantier : elles sont automatiquement regroupées sur le site, et une paire avant/après affiche un comparatif côte à côte dès qu'elle est disponible.
4. La photo apparaît immédiatement dans la galerie publique (`/realisations` et sur la page d'accueil).
5. Chaque photo peut être supprimée depuis le même écran.

Aucune compétence technique n'est requise après la configuration initiale des variables d'environnement.

## 5. Prise de rendez-vous en ligne (avec temps de trajet)

Une fois `POSTGRES_URL`, `GOOGLE_MAPS_API_KEY` et l'adresse de départ (`bookingConfig.baseAddress` dans `src/lib/site-config.ts`) configurés, la page Contact propose un vrai calendrier de réservation :

- Le client indique l'adresse de son chantier et une date ; les créneaux affichés sont ceux réellement faisables compte tenu des trajets vers/depuis les autres rendez-vous déjà confirmés ce jour-là (calcul via Google Distance Matrix, adresse de départ = atelier/domicile professionnel).
- Chaque réservation est **confirmée automatiquement** (un créneau proposé est par construction faisable) et envoie un email à Maxime et au client (si Resend est configuré).
- `/admin/rendez-vous` liste les prochains rendez-vous et permet de les annuler.

Réglages ajustables dans `src/lib/site-config.ts` (`bookingConfig`) : adresse de départ, jours/horaires travaillés, durée d'un rendez-vous (60 min par défaut), granularité des créneaux (30 min), délai minimum avant réservation (24h) et horizon de réservation (45 jours).

Tant que ces trois éléments ne sont pas configurés, la page Contact affiche automatiquement le formulaire de message simple — le site reste pleinement fonctionnel sans la prise de rendez-vous en ligne.

## 6. Contenu à finaliser avant l'envoi au client

Les éléments suivants sont volontairement placés en placeholders clairement identifiables (`[...]`) dans `src/lib/site-config.ts` et sur les pages légales, à compléter avec les informations réelles de l'entreprise avant mise en ligne définitive :

- Adresse, zone d'intervention précise
- Adresse de départ pour la prise de rendez-vous (`bookingConfig.baseAddress`)
- Mentions légales : forme juridique, SIRET, RCS, code APE
- Assurance décennale : assureur, n° de police, zone de couverture
- Médiateur de la consommation (obligatoire pour les professionnels du bâtiment)

Le logo utilisé (`public/logo/`) est dérivé du fichier fourni par le client (fond détouré, décliné en teinte navy pour les fonds clairs et ivoire pour les fonds sombres). Le fichier source original est conservé dans `brand/Logo-source.jpeg`.

## 7. Structure du projet

```
src/
  app/
    (site)/            pages publiques (accueil, spécialités, réalisations, contact, mentions légales, confidentialité)
    admin/              back-office protégé par mot de passe (réalisations + rendez-vous)
    api/                routes API (contact, réservation, authentification admin, gestion des réalisations/RDV)
  components/           composants UI (Header, Footer, sections de page, admin/)
  lib/                  configuration du site, intégrations Cloudinary / Resend / Google Maps / Postgres
```

## 8. Commandes utiles

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm run start   # démarrer le build de production en local
npm run lint    # vérification du code
```
