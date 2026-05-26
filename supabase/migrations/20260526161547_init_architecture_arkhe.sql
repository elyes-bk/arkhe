-- 1. Activation de l'extension géographique PostGIS (indispensable pour MapLibre)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Création de la table des Utilisateurs (Complément de Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'salon' CHECK (role IN ('salon', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Création de la table des Salons de coiffure
CREATE TABLE public.salons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    nom_commerce VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    url_justificatif_local VARCHAR(500),
    emplacement GEOGRAPHY(Point, 4326) NOT NULL, -- Stockage Point GPS (Longitude, Latitude)
    statut_validation VARCHAR(50) DEFAULT 'en_attente' CHECK (statut_validation IN ('en_attente', 'valide', 'refuse'))
);

-- 4. Création de la table des Sacs de cheveux
CREATE TABLE public.sacs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE NOT NULL,
    statut_collecte VARCHAR(50) DEFAULT 'Pret' CHECK (statut_collecte IN ('Pret', 'En_cours', 'Collecte')),
    declared_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Optimisation Performance : Création de l'index spatial GIST pour la carte de Yann
CREATE INDEX salons_emplacement_idx ON public.salons USING gist(emplacement);