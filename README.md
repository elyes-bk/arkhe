```markdown
# ARKHE : Écosystème de Valorisation Capillaire

ARKHE transforme les déchets capillaires des salons de coiffure en carbone activé de haute performance pour les industries de pointe (stockage d'énergie, prototypage), remplaçant ainsi les ressources fossiles par une alternative biosourcée et circulaire.

## 🚀 Présentation du Projet

Le projet repose sur une économie circulaire B2B2B articulée autour d'une plateforme logistique de précision :
* **Sourcing (B1) :** Collecte de cheveux naturels (riches en azote et soufre) auprès des salons partenaires.
* **Transformation :** Pyrolyse et activation pour atteindre une surface spécifique > 2000 m²/g.
* **Valorisation (B2) :** Vente de carbone circulaire certifié aux laboratoires et industriels de la tech.

## 🛠️ Architecture Technique

La stack a été choisie pour maximiser le Time-to-Market et la précision logistique (Score : 81/85 dans notre matrice décisionnelle).
* **Frontend :** Next.js 14 (App Router) pour l'unification de la Landing Page (SSR) et du Dashboard (SPA).
* **Backend :** Supabase (PostgreSQL + PostGIS) pour la gestion des données géospatiales et la sécurité RLS.
* **Cartographie :** MapLibre GL JS pour un rendu vectoriel haute performance (gestion de milliers de marqueurs).
* **UI/UX :** Tailwind CSS + Shadcn/ui pour une interface standardisée et accessible.

## 🎯 Périmètre Fonctionnel

### MVP (Phase 1)
* **Portail Client :** Onboarding SIRET, stockage de documents (S3) et bouton de déclaration "+1 Sac".
* **Dashboard Admin :** Modération des comptes et carte interactive de visualisation des gisements en temps réel.

### V2 (Évolutions)
* **Routing Engine :** Optimisation automatique des tournées via PostGIS et VROOM (Voyageur de commerce).

## 💾 Installation

```bash
# 1. Cloner le projet
git clone [https://github.com/MelindaMob/arkhe.git](https://github.com/MelindaMob/arkhe.git)
cd arkhe

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement local
cp .env.example .env.local

# 4. Lancer le serveur de développement
npm run dev