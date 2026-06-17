import React from 'react'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-heading font-bold text-4xl text-[#04082E] mb-8">Mentions Légales</h1>
        
        <div className="prose prose-slate max-w-none text-[#4A4A4A]">
          <p className="mb-6">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l&apos;économie numérique, il est précisé aux utilisateurs du site ARKHE l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">Édition du site</h2>
          <p className="mb-4">
            Le présent site, accessible à l&apos;URL <strong>[URL du site]</strong> (le &quot;Site&quot;), est édité par :
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Nom de la structure :</strong> [Nom de l&apos;entreprise ou Prénom Nom]</li>
            <li><strong>Forme juridique :</strong> [Statut juridique, ex: SASU, Auto-entreprise]</li>
            <li><strong>Capital social :</strong> [Montant] €</li>
            <li><strong>Siège social :</strong> 8 Rue de la Fontaine au Roi, 75011 Paris</li>
            <li><strong>RCS / SIRET :</strong> [Numéro SIRET]</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">Directeur de la publication</h2>
          <p className="mb-6">
            Le Directeur de la publication du Site est <strong>[Prénom Nom du dirigeant]</strong>.
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">Hébergement</h2>
          <p className="mb-6">
            Le Site est hébergé par la société <strong>Vercel Inc.</strong>, situé 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis.<br />
            Les bases de données et fichiers utilisateurs sont hébergés sur les serveurs européens de la société <strong>Supabase</strong>.
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">Nous contacter</h2>
          <p className="mb-6">
            Par email : <a href="mailto:arkhe.b3@gmail.com" className="text-[#0738DC] hover:underline">arkhe.b3@gmail.com</a><br />
            Par courrier : 8 Rue de la Fontaine au Roi, 75011 Paris
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">Données personnelles</h2>
          <p className="mb-6">
            Le traitement de vos données à caractère personnel est régi par notre <Link href="/politique-de-confidentialite" className="text-[#0738DC] hover:underline">Charte de confidentialité</Link>, conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
