import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import Header from '@/components/Header'

const XIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default async function RejectedPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the salon data to display the reason
  const { data: salon } = await supabase
    .from('salons')
    .select('statut_validation, motif_refus, commentaire_refus')
    .eq('user_id', user.id)
    .single()

  if (salon?.statut_validation === 'approved') {
    redirect('/dashboard')
  } else if (salon?.statut_validation === 'waiting') {
    redirect('/waiting')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-arkhe-neutral">
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center bg-white px-6 py-20">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="flex flex-col items-center gap-10 mb-10 text-center w-full">
            {/* Red X Icon */}
            <div className="bg-red-50 p-4 rounded-full">
              <div className="bg-white rounded-full flex items-center justify-center w-[54px] h-[54px] shadow-sm">
                <XIcon />
              </div>
            </div>

            {/* Texts */}
            <div className="flex flex-col gap-4 w-full">
              <h1 className="font-heading font-bold text-2xl text-[#303336]">
                Candidature refusée
              </h1>
              <p className="font-sans text-sm text-[#5C5F62] leading-relaxed">
                Nous regrettons de vous informer que votre demande d&apos;inscription a été rejetée par notre équipe de modération.
              </p>
            </div>

            {/* Rejection Details Box */}
            {(salon?.motif_refus || salon?.commentaire_refus) && (
              <div className="w-full text-left bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col gap-3">
                {salon.motif_refus && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Motif du refus
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {salon.motif_refus}
                    </span>
                  </div>
                )}
                {salon.commentaire_refus && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Commentaire complémentaire
                    </span>
                    <span className="text-sm font-normal text-slate-700 italic block border-l-2 border-slate-300 pl-3 py-0.5">
                      &ldquo;{salon.commentaire_refus}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA / Logout */}
          <form action={logout} className="w-full flex justify-center">
            <button 
              type="submit"
              className="bg-[#0738dc] hover:bg-blue-700 text-white font-heading font-medium text-sm px-12 py-3 rounded-[4px] transition duration-150"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
