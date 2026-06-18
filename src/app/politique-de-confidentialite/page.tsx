import React from 'react'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-heading font-bold text-4xl text-[#04082E] mb-8">Politique de Confidentialité</h1>
        
        <div className="prose prose-slate max-w-none text-[#4A4A4A]">
          <p className="mb-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          
          <p className="mb-6">
            Chez <strong>ARKHE</strong>, la protection de vos données personnelles est une priorité. 
            La présente Politique de Confidentialité a pour but de vous informer de la manière dont nous collectons, 
            utilisons et protégeons vos données à caractère personnel dans le cadre de votre utilisation de la plateforme.
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">1. Données collectées</h2>
          <p className="mb-4">Lors de l&apos;utilisation de nos services (création de compte salon, formulaire de contact), nous collectons les données suivantes :</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Données d&apos;identification :</strong> Prénom, Nom, Adresse e-mail, Mot de passe (haché de manière sécurisée).</li>
            <li><strong>Données professionnelles :</strong> Nom du salon, Numéro SIRET, Adresse postale complète.</li>
            <li><strong>Justificatifs :</strong> Extrait Kbis ou Bail commercial sous forme de fichier image ou PDF.</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">2. Utilisation des données</h2>
          <p className="mb-4">Vos données sont collectées pour les finalités suivantes :</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Vérification et Modération :</strong> Assurer la légitimité des salons inscrits sur notre plateforme grâce à l&apos;analyse des numéros de SIRET et des justificatifs de locaux.</li>
            <li><strong>Création de compte et accès au service :</strong> Vous permettre de vous connecter et de gérer votre profil professionnel sur ARKHE.</li>
            <li><strong>Communication :</strong> Répondre à vos demandes via notre formulaire de contact et vous informer des mises à jour du service.</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">3. Conservation des données</h2>
          <p className="mb-6">
            Vos données personnelles sont conservées le temps nécessaire à l&apos;accomplissement des finalités évoquées ci-dessus, et pour toute la durée où votre compte salon reste actif. <br />
            En cas de refus d&apos;inscription ou de demande de suppression de compte, vos documents (Kbis, baux) sont supprimés de nos serveurs de stockage sécurisés (Supabase).
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">4. Partage et Sécurité</h2>
          <p className="mb-6">
            Vos données ne sont <strong>jamais revendues</strong> à des tiers. Elles ne sont partagées avec aucun acteur commercial. <br />
            L&apos;hébergement de notre base de données est assuré par Supabase (serveurs basés en Europe), qui applique les meilleurs standards de sécurité de l&apos;industrie (chiffrement, Row Level Security).
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">5. Vos droits (Droit à l&apos;oubli)</h2>
          <p className="mb-4">Conformément à la réglementation applicable (RGPD), vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Droit d&apos;accès et de rectification de vos données.</li>
            <li><strong>Droit à l&apos;effacement (droit à l&apos;oubli) :</strong> Vous pouvez demander la suppression immédiate de l&apos;intégralité de votre compte et de vos justificatifs.</li>
            <li>Droit d&apos;opposition et à la limitation du traitement.</li>
          </ul>
          <p className="mb-6">
            Pour exercer vos droits, vous pouvez nous contacter à tout moment à l&apos;adresse suivante : <br />
            <a href="mailto:arkhe.b3@gmail.com" className="text-[#0738DC] font-semibold hover:underline">arkhe.b3@gmail.com</a>
          </p>

          <h2 className="font-heading font-bold text-2xl text-[#04082E] mt-10 mb-4">6. Cookies</h2>
          <p className="mb-6">
            <strong>Nous n&apos;utilisons aucun cookie de ciblage publicitaire ou d&apos;analyse comportementale tierce (pas de traceurs).</strong><br />
            Le seul cookie déposé sur votre appareil est un cookie technique de session (&quot;Strictement nécessaire&quot;), généré par Supabase Auth, permettant de vous maintenir connecté(e) de manière sécurisée lors de votre navigation. Ce cookie est exempté du recueil de consentement selon les directives de la CNIL.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
