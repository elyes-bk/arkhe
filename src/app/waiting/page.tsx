import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import Header from '@/components/Header'

const ClockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#0738dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default async function WaitingPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double-check status to avoid redirect loop if approved
  const { data: salon } = await supabase
    .from('salons')
    .select('statut_validation')
    .eq('user_id', user.id)
    .single()

  if (salon?.statut_validation === 'approved') {
    redirect('/dashboard')
  } else if (salon?.statut_validation === 'rejected') {
    redirect('/rejected')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-arkhe-neutral">
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center bg-white px-6 py-20">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="flex flex-col items-center gap-12 mb-10 text-center">
            {/* Clock Icon */}
            <div className="bg-[#e2e9ff] p-4 rounded-full">
              <div className="bg-white rounded-full flex items-center justify-center w-[54px] h-[54px]">
                <ClockIcon />
              </div>
            </div>

            {/* Texts */}
            <div className="flex flex-col gap-4">
              <h1 className="font-heading font-bold text-2xl text-[#303336]">
                Candidature en cours d&apos;examen
              </h1>
              <p className="font-sans text-sm text-[#5C5F62] leading-relaxed">
                Votre demande d&apos;inscription a bien été reçue. Notre équipe l&apos;étudie avec soin. Vous recevrez un e-mail dès qu&apos;elle aura été validée.
              </p>
            </div>
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
