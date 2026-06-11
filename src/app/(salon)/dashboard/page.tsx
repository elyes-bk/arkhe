import { createSupabaseServerClient } from '@/lib/supabase-server'
import SacCounter from '@/components/SacCounter'
import Header from '@/components/Header'
import RecentActivity from '@/components/RecentActivity'
import { Footer } from '@/components/Footer'

function parseEmplacement(raw: string): string | null {
  const wkt = raw.match(/POINT\(([^ ]+) ([^ ]+)\)/)
  if (wkt) {
    const lat = parseFloat(wkt[2]).toFixed(4)
    const lng = parseFloat(wkt[1]).toFixed(4)
    return `${lat}, ${lng}`
  }
  if (/^[0-9A-Fa-f]+$/i.test(raw) && raw.length >= 42) {
    try {
      const buf = Buffer.from(raw, 'hex')
      const hasSRID = (buf.readUInt32LE(1) & 0x20000000) !== 0
      const offset = hasSRID ? 9 : 5
      const lng = buf.readDoubleLE(offset)
      const lat = buf.readDoubleLE(offset + 8)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch { /* ignore */ }
  }
  return null
}

export default async function DashboardSalon() {
  const supabase = createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: salon } = await supabase
    .from('salons')
    .select('id, nom_commerce, emplacement, adresse, bag_waiting, total_bag_collected')
    .eq('user_id', user?.id)
    .single()

  const { data: recentSacs } = await supabase
    .from('sacs')
    .select('statut_collecte, declared_at')
    .eq('salon_id', salon?.id ?? '')
    .order('declared_at', { ascending: false })
    .limit(50)

  const lieu = (salon as typeof salon & { adresse?: string })?.adresse || (salon?.emplacement ? parseEmplacement(salon.emplacement as string) : null)

  const totalCollectes = salon?.total_bag_collected ?? 0
  const enAttente = salon?.bag_waiting ?? 0
  const co2Epargne = Math.round(totalCollectes * 0.26 * 10) / 10
  const eauPreservee = Math.round(totalCollectes * 9.5)

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <div className="pt-[40px] flex flex-col mb-[40px]">

        {/* Bannière salon — gradient */}
        <div className="bg-gradient-to-tr from-[#04082E] to-[#0D1A94] px-6 py-8 lg:px-24 lg:py-12">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 text-[#E2E9FF]/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[#E2E9FF]/70 text-xs font-medium tracking-wide">Compte certifié</span>
          </div>
          <h1 className="text-white text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            {salon?.nom_commerce || 'Mon Salon'}
          </h1>
          {lieu && (
            <p className="text-white/40 text-sm mt-1">{lieu}</p>
          )}
        </div>

        {/* Zone principale : 2 colonnes sur desktop */}
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 lg:px-24 lg:pt-8 lg:pb-10">

          {/* Colonne gauche : counter + en attente */}
          <div className="flex flex-col gap-4 mx-6 mt-5 lg:mx-0 lg:mt-0">

            {/* Carte : Nombre de sacs remplis */}
            <div className="flex-1 flex bg-white rounded-xl p-6 border border-[#BDC5DF]">
              <SacCounter salonId={salon?.id ?? ''} />
            </div>

            {/* Carte : En attente de collecte */}
            <div className="bg-white rounded-xl px-5 py-4 border border-[#BDC5DF] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                  En attente collecte
                </p>
                <p className="text-3xl font-black text-[#0738DC] leading-none">
                  {String(enAttente).padStart(2, '0')}
                </p>
              </div>
            </div>

          </div>

          {/* Colonne droite : activité récente (desktop uniquement) */}
          <div className="hidden lg:flex lg:flex-col">
            <RecentActivity sacs={recentSacs ?? []} />
          </div>

        </div>

        {/* Section : Votre impact — gradient */}
        <section className="bg-gradient-to-tr from-[#04082E] to-[#0D1A94] mt-6 lg:mt-0 px-6 py-8 lg:px-24 lg:py-12">
          <h2 className="text-white font-bold text-xl mb-1">Votre impact</h2>
          <p className="text-white/40 text-sm mb-6">
            Suivez les indicateurs liés à vos collectes et leur contribution environnementale.
          </p>

          {/* Mobile : sacs pleine largeur + CO2/Eau en 2 colonnes */}
          {/* Desktop : 3 colonnes égales */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Sacs collectés : pleine largeur mobile, 1/3 desktop */}
            <div className="col-span-2 lg:col-span-1 border border-white/20 rounded-xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-[#E2E9FF]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#E2E9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-4xl font-black leading-none">{totalCollectes}</p>
                <p className="text-white/50 text-xs mt-1">Nombre de sacs collectés</p>
              </div>
            </div>

            {/* CO2 */}
            <div className="bg-white rounded-xl p-4 lg:p-6 flex flex-col gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-[#E2E9FF] flex items-center justify-center text-[#0738DC] font-black text-xs">
                CO₂
              </div>
              <div>
                <p className="text-[#04082E] text-2xl lg:text-3xl font-black leading-none">{co2Epargne}kg</p>
                <p className="text-slate-400 text-xs mt-1">CO₂ épargné</p>
              </div>
            </div>

            {/* Eau */}
            <div className="bg-white rounded-xl p-4 lg:p-6 flex flex-col gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" />
                </svg>
              </div>
              <div>
                <p className="text-[#04082E] text-2xl lg:text-3xl font-black leading-none">{eauPreservee}L</p>
                <p className="text-slate-400 text-xs mt-1">Eau préservée</p>
              </div>
            </div>

          </div>
        </section>

        {/* Activité récente : mobile uniquement (sur desktop, elle est dans la colonne droite) */}
        <div className="lg:hidden mx-6 mt-6 mb-8">
          <h3 className="font-bold text-[#04082E] text-sm mb-3">Activité récente</h3>
          <RecentActivity sacs={recentSacs ?? []} />
        </div>

        
      </div>
      <Footer />
    </div>
  )
}
