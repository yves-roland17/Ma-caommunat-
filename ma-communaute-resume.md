# 🎓 Ma Communauté — Résumé complet du projet

## 📌 Présentation

**Ma Communauté** est une plateforme web destinée aux étudiants. Son objectif est de centraliser les échanges, les ressources et les opportunités dans un espace unique, moderne et collaboratif.

L'application permet aux étudiants de communiquer, partager des documents, accéder à des annonces de travail et interagir au sein de groupes créés par les administrateurs.

---

## 🎯 Objectif principal

Permettre aux étudiants de :

- 📰 Publier et consulter des publications dans un fil d'actualité
- 💬 Discuter à travers les commentaires et les groupes (pas de messagerie privée dans le MVP)
- 📂 Partager des documents (cours, TD, PDF, etc.)
- 👥 Rejoindre des groupes créés uniquement par les administrateurs
- 💼 Consulter et publier des annonces de stage, d'emploi et d'autres opportunités
- 🔔 Recevoir des notifications en temps réel concernant leurs interactions

---

## 👥 Les rôles

### 👨‍🎓 Étudiant
Peut :
- Créer un compte
- Modifier son profil
- Publier dans le fil d'actualité
- Commenter et réagir aux publications
- Rejoindre et quitter des groupes
- Discuter en temps réel dans les groupes (chat)
- Partager des documents (via un post ou une conversation de groupe)
- Consulter des annonces de stage/emploi (issues d'une API externe, page dédiée séparée du fil d'actualité)
- Devenir modérateur d'un groupe (si nommé par l'administrateur créateur)

### 👨‍💼 Administrateur
Peut :
- Gérer les utilisateurs
- Créer, modifier et supprimer des groupes
- Attribuer le rôle de modérateur au sein d'un groupe qu'il a créé
- Modérer les publications et commentaires (masquer/supprimer)
- Masquer une annonce importée jugée non pertinente

### 🛡️ Modérateur de groupe (rôle intermédiaire)
- Rôle attribué **uniquement par l'administrateur** ayant créé le groupe
- Portée limitée au groupe concerné (à définir précisément lors du développement : quelles actions exactement — retirer un message, exclure un membre, etc.)

---

## 📱 Pages du MVP

| # | Page |
|---|------|
| 1 | 🔐 Connexion |
| 2 | 📝 Inscription |
| 3 | 📰 Fil d'actualité |
| 4 | 👤 Profil |
| 5 | 👥 Groupes |
| 6 | 📄 Détail d'un groupe (incluant le chat temps réel) |
| 7 | 📂 Documents |
| 8 | 💼 Annonces |
| 9 | 🔔 Notifications |
| 10 | ⚙️ Paramètres |
| 11 | 🛡️ Administration |

---

## 🗳️ Décisions fonctionnelles (issues des échanges)

| Sujet | Décision | Implication technique |
|---|---|---|
| **Modération du fil d'actualité** | A posteriori — publication immédiate, l'admin masque/supprime directement depuis l'administration (pas de signalement utilisateur en v1) | Champ `status` (`ACTIVE` / `HIDDEN` / `DELETED`) sur `Post`/`Comment`. Entité `Report` **reportée en v2** |
| **Documents** | Pas d'entité isolée : rattachés soit à un post du fil d'actualité, soit à un message dans une conversation de groupe | `Document` lié par relation optionnelle à `Post` **ou** `GroupMessage` |
| **Notifications** | Temps réel dès le MVP (pas de simple polling) | Module WebSocket NestJS (Socket.io), authentification JWT sur la connexion socket |
| **Annonces — origine** | Page dédiée, indépendante du fil d'actualité, alimentée uniquement par une **API externe (Jooble)** — aucune publication par les utilisateurs ni les admins | Job planifié (`@nestjs/schedule`) qui synchronise régulièrement les offres, filtrées sur des mots-clés étudiants (stage, alternance, junior) et la localisation Côte d'Ivoire |
| **Annonces — curation** | L'administrateur peut masquer une offre importée jugée non pertinente | `status` technique (`ACTIVE`/`EXPIRED`/`HIDDEN`) plutôt qu'un vrai workflow de modération communautaire |
| **Ce que publient les étudiants** | Reste uniquement dans le fil d'actualité (posts classiques) — jamais sur la page Annonces | Pas de champ `authorId` sur `Announcement` |
| **Conversations de groupe** | Chat temps réel façon Discord (pas un forum paginé) | `GroupMessage` géré via WebSocket, "rooms" Socket.io par groupe |
| **Sortie d'un groupe** | Un étudiant peut quitter un groupe à tout moment | `GroupMembership` avec possibilité de suppression |
| **Rôle modérateur de groupe** | Existe, attribué uniquement par l'administrateur créateur du groupe (pas par un autre modérateur) | `GroupMembership.role` : `MEMBER` \| `MODERATOR` |

---

## 🛠️ Stack technique

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Framer Motion
- TanStack Query (état serveur)
- Zustand (état client, y compris état temps réel du chat)
- React Hook Form
- Zod
- React Dropzone
- date-fns
- Client Socket.io pour le temps réel

### Backend
- NestJS
- TypeScript
- Prisma ORM
- Passport.js
- JWT
- bcrypt
- Multer
- Swagger
- class-validator / class-transformer
- @nestjs/config
- Helmet
- @nestjs/throttler (important vu les annonces ouvertes à tous)
- Socket.io (`@nestjs/platform-socket.io`) pour le chat de groupe et les notifications temps réel
- `@nestjs/schedule` pour la synchronisation planifiée des annonces
- API Jooble (source externe des annonces de stage/emploi)
- *(évolutif)* `socket.io-redis-adapter` si multi-instances plus tard

### Base de données
- PostgreSQL
- Prisma Migrate
- Prisma Seed

### Stockage
- MinIO (compatible S3), hébergé sur Railway (conteneur Docker avec volume persistant)
- Bucket public pour avatars/images de posts, bucket privé + URLs signées pour les documents de groupe

### Développement
- Git / GitHub
- Visual Studio Code
- Bruno
- ESLint / Prettier / Husky
- Jest **et** Vitest — *point à trancher* : usage classique = Jest pour le backend NestJS (par défaut du CLI), Vitest pour le frontend Next.js

### Déploiement
- Frontend : Vercel
- Backend : Railway (MVP), puis VPS si nécessaire
- Base de données : PostgreSQL managé

---

## 🎨 Design

- Mobile First
- Responsive
- Glassmorphism
- Mode clair / sombre
- Interface moderne inspirée de Facebook, Discord et LinkedIn

---

## 🏗️ Architecture (mise à jour)

```
Frontend (Next.js)
   │
   ├── REST API ──────────► Backend (NestJS)
   │                              │
   └── WebSocket (Socket.io) ────┤
                                  ▼
                             Prisma ORM
                                  │
                                  ▼
                             PostgreSQL
                                  │
                                  ▼
                        MinIO (Images & Documents)
```

Deux canaux de communication frontend ↔ backend :
- **REST** : CRUD classique (auth, profils, posts, groupes, annonces, documents)
- **WebSocket** : chat de groupe en temps réel + notifications en temps réel

---

## 📂 Structure du projet

```text
ma-communaute/
│
├── frontend/          # Next.js
├── backend/           # NestJS
├── docs/              # Documentation
├── .github/           # CI/CD (plus tard)
└── README.md
```

---

## 🗂️ Entités principales identifiées (base pour le schéma Prisma)

- `User`
- `Post` (fil d'actualité)
- `Comment`
- `Reaction`
- `Report` (signalement — posts, commentaires, documents, annonces)
- `Group`
- `GroupMembership` (userId, groupId, role: `MEMBER` | `MODERATOR`)
- `GroupMessage` (chat temps réel du groupe)
- `Document` (rattaché à un `Post` ou un `GroupMessage`)
- `Announcement` (annonce d'emploi/stage importée depuis l'API Jooble — `provider`, `externalId`, `externalUrl`, `status`, sans auteur utilisateur)
- `Notification`

> `Report` (signalement) est repoussé en **v2** — la modération v1 se fait uniquement via le champ `status` et l'interface d'administration.

---

## ⚠️ Points encore ouverts à trancher

1. **Socket.io vs WebSocket natif** côté NestJS (Socket.io recommandé pour le MVP : reconnexion auto, rooms par groupe).
2. **Jest vs Vitest** : confirmer la répartition (Jest backend / Vitest frontend) ou choisir un seul outil.
3. **Structure des buckets MinIO** (public vs privé + URLs signées) et taille max par fichier à définir précisément.
4. **Portée exacte du rôle modérateur de groupe** : quelles actions précises peut-il effectuer (supprimer un message, exclure un membre, etc.) ?
5. **Scalabilité WebSocket** : prévoir un adapter Redis si déploiement multi-instances sur Railway à terme.

---

## 🚀 Vision

Construire une plateforme étudiante moderne, performante et évolutive qui deviendra un espace central où les étudiants pourront communiquer, collaborer, partager des ressources, accéder à des opportunités professionnelles et créer une véritable communauté numérique.

Le projet est conçu comme un **MVP solide**, avec une architecture (REST + WebSocket) déjà prête à évoluer vers des fonctionnalités plus avancées (application mobile, IA, etc.) lorsque la plateforme grandira.
