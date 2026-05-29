import Link from 'next/link'
import Header from '@/components/Header'

/* ─────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────*/
const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#0738dc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function DemandeEnregistrePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-arkhe-neutral">
      
      {/* ────────────────── HEADER ────────────────── */}
      <Header />

      {/* ────────────────── MAIN CONTENT AREA ────────────────── */}
      <main className="flex-grow flex flex-col justify-center items-center bg-white px-6 py-20">
        
        <div className="flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-[100px] mb-[60px]">
            {/* Checkmark Icon */}
            <div className="bg-[#e2e9ff] p-[9px] rounded-full">
              <div className="bg-white rounded-full flex items-center justify-center w-[54px] h-[54px]">
                <CheckIcon />
              </div>
            </div>

            {/* Texts */}
            <div className="flex flex-col items-center text-center gap-[16px]">
              <h1 className="font-heading font-bold text-[19px] leading-[23.56px] md:text-[24px] md:leading-[29.77px] text-[#303336]">
                Votre demande à bien été enregistré
              </h1>
              <p className="font-sans font-normal text-[15px] leading-[18.28px] md:text-[16px] md:leading-[19.5px] text-[#303336]">
                Notre équipe vous contactera prochainement.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="/"
            className="bg-[#0738dc] hover:bg-blue-700 text-white font-heading font-medium text-[16px] leading-[19.84px] px-[50px] py-[10px] transition-colors"
          >
            Retour à l'accueil
          </Link>

        </div>

      </main>

    </div>
  )
}
