import { createSupabaseServerClient } from '@/lib/supabase-server'
import SacCounter from '@/components/SacCounter'
import { logout } from '@/actions/auth'
import Image from 'next/image'

export default async function DashboardSalon() {
  const supabase = createSupabaseServerClient()

  // Récupère l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()

  // Récupère le salon et ses infos liées à l'user
  const { data: salon } = await supabase
    .from('salons')
    .select('id, nom_commerce, emplacement, bag_waiting, total_bag_collected')
    .eq('user_id', user?.id)
    .single()

  // Parse les coordonnées géographiques pour un affichage plus propre
  let coordonnees = "Adresse non géolocalisée"
  if (salon?.emplacement) {
    const match = (salon.emplacement as string).match(/POINT\(([^ ]+) ([^ ]+)\)/)
    if (match) {
      coordonnees = `Latitude: ${parseFloat(match[2]).toFixed(5)} • Longitude: ${parseFloat(match[1]).toFixed(5)}`
    } else {
      coordonnees = salon.emplacement as string
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 font-sans">
      {/* Premium Header matching the landing page theme */}
      <header className="sticky top-0 z-50 bg-[#04082e] h-[72px] w-full flex items-center justify-between px-6 md:px-12 shadow-md">
        <div className="flex items-center gap-4">
          <Image 
            src="/logo.svg" 
            alt="ARKHE Logo" 
            width={52} 
            height={35} 
            className="w-[52px] h-[35px] object-contain"
          />
          <span className="hidden sm:inline-block text-white font-heading font-semibold text-lg tracking-wider">
            ESPACE SALON
          </span>
        </div>

        {/* CTA Rouge Logout */}
        <form action={logout}>
          <button 
            type="submit"
            className="bg-[#EF4444] hover:bg-[#DC2626] active:bg-[#B91C1C] text-white px-5 py-2 rounded-[4px] font-heading font-semibold text-sm transition-all duration-150 flex items-center gap-2 shadow-sm"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Se déconnecter
          </button>
        </form>
      </header>

      {/* Main Dashboard Area */}
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
              Bonjour, {salon?.nom_commerce || "Cher Partenaire"} 👋
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm font-medium">
              <svg 
                className="w-4 h-4 text-[#0738dc] flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
                />
              </svg>
              <span>{coordonnees}</span>
            </div>
          </div>
          <div className="bg-blue-50 text-[#0738dc] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 self-start md:self-auto uppercase tracking-wider">
            Compte Partenaire Actif
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Total sacs collectés */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-200 hover:shadow-md">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Total sacs collectés
              </p>
              <h2 className="text-4xl md:text-5xl font-black mt-2 text-emerald-600">
                {salon?.total_bag_collected ?? 0}
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Merci pour votre contribution à l'environnement !
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
              <svg 
                className="w-10 h-10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Card: En attente de collecte */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-200 hover:shadow-md">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                En attente de collecte
              </p>
              <h2 className="text-4xl md:text-5xl font-black mt-2 text-amber-500">
                {salon?.bag_waiting ?? 0}
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Prêt à être récupéré par notre logistique.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
              <svg 
                className="w-10 h-10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Action Panel: Signal bags */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Signaler de nouveaux sacs prêts
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Indiquez le nombre de sacs de cheveux remplis et prêts à être collectés par nos agents.
            </p>
          </div>
          <SacCounter salonId={salon?.id ?? ''} />
        </div>

      </main>
    </div>
  )
}
