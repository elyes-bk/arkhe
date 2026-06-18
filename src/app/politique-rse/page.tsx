import React from 'react'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export default function PolitiqueRSE() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-heading font-bold text-4xl text-[#04082E] mb-8">Politique RSE (Responsabilité Sociétale des Entreprises)</h1>
        
        <div className="prose prose-slate max-w-none text-[#4A4A4A]">
          <p className="mb-6">
            Chez <strong>ARKHE</strong>, notre modèle d&apos;affaires est intrinsèquement lié à la transition écologique. Nous avons la conviction que l&apos;économie circulaire est la seule voie viable pour un avenir durable, en transformant ce qui était considéré comme un déchet en une véritable ressource.
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">1. L&apos;Économie Circulaire au Cœur de Notre Modèle</h2>
          <p className="mb-4">
            Notre plateforme permet la récupération, le tri et la revalorisation des cheveux coupés dans les salons de coiffure partenaires. Ces matières organiques, jusqu&apos;alors incinérées ou enfouies, trouvent de nouvelles applications vertueuses :
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Dépollution des eaux :</strong> Utilisation des cheveux dans la fabrication de filtres pour absorber les hydrocarbures en mer ou dans les rivières.</li>
            <li><strong>Agriculture et jardinage :</strong> Transformation en isolant naturel et répulsif pour certains nuisibles.</li>
            <li><strong>Matériaux innovants :</strong> Recherche et développement pour l&apos;intégration dans de nouveaux polymères éco-conçus.</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">2. Une Logistique Optimisée et Moins Polluante</h2>
          <p className="mb-6">
            L&apos;impact carbone de la logistique de collecte est un de nos principaux défis. Pour le limiter, nous utilisons des algorithmes de routage avancés (via <em>MapLibre</em> et des API de Routing) permettant de :
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Regrouper les collectes par zones géographiques de manière dynamique.</li>
            <li>Minimiser les kilomètres parcourus à vide par nos partenaires logistiques.</li>
            <li>Favoriser le recours à des modes de transport décarbonés (vélos-cargos dans les hyper-centres, véhicules électriques).</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">3. Transparence et Traçabilité</h2>
          <p className="mb-6">
            Nous nous engageons à offrir une transparence totale à nos salons partenaires. Depuis le dépôt dans les bacs de collecte jusqu&apos;au traitement par les laboratoires, l&apos;intégralité de la chaîne est documentée. Les salons peuvent ainsi communiquer sur leurs propres efforts environnementaux de manière justifiée et non trompeuse (lutte contre le greenwashing).
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">4. Impact Social et Ancrage Local</h2>
          <p className="mb-6">
            ARKHE s&apos;efforce de créer des emplois non délocalisables et de dynamiser le tissu local. Nous travaillons prioritairement avec des acteurs de l&apos;Économie Sociale et Solidaire (ESS) pour les étapes de tri et de conditionnement, favorisant ainsi l&apos;insertion ou la réinsertion professionnelle.
          </p>

          <div className="bg-[#F0F2FB] p-6 rounded-lg mt-12">
            <h3 className="font-heading font-bold text-xl text-[#04082E] mb-3">Rejoignez le mouvement !</h3>
            <p className="mb-4">
              Vous êtes un salon de coiffure ou un acteur de la valorisation de la matière ? Ensemble, nous avons le pouvoir de changer la norme.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#0738DC] text-white px-6 py-3 rounded-full font-medium hover:bg-[#062db0] transition-colors"
            >
              Devenir Partenaire
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
