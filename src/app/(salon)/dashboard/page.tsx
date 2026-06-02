import { createSupabaseServerClient } from '@/lib/supabase-server'
import SacCounter from '@/components/SacCounter'
import { logout } from '@/actions/auth'
import Image from 'next/image'

function parseEmplacement(raw: string): string | null {
  // WKT: POINT(lng lat) or SRID=4326;POINT(lng lat)
  const wkt = raw.match(/POINT\(([^ ]+) ([^ ]+)\)/)
  if (wkt) {
    const lat = parseFloat(wkt[2]).toFixed(4)
    const lng = parseFloat(wkt[1]).toFixed(4)
    return `${lat}, ${lng}`
  }
  // EWKB hex (PostGIS binary)
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
    .limit(5)

  const lieu = (salon as typeof salon & { adresse?: string })?.adresse || (salon?.emplacement ? parseEmplacement(salon.emplacement as string) : null)

  const totalCollectes = salon?.total_bag_collected ?? 0
  const enAttente = salon?.bag_waiting ?? 0
  const co2Epargne = Math.round(totalCollectes * 0.26 * 10) / 10
  const eauPreservee = Math.round(totalCollectes * 9.5)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#04082E] h-[68px] w-full flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="ARKHE" width={48} height={32} className="object-contain" />
          <span className="hidden sm:block text-white font-semibold text-sm tracking-widest uppercase opacity-60">
            Espace Salon
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Se déconnecter
          </button>
        </form>
      </header>

      {/* Profile Banner */}
      <div className="bg-[#04082E] px-6 md:px-10 pt-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-[#0738DC]/25 border border-[#0738DC]/30 rounded-full px-3 py-1">
              <svg className="w-3 h-3 text-[#E2E9FF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-[#E2E9FF] text-xs font-semibold tracking-wide">Compte certifié</span>
            </div>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
            {salon?.nom_commerce || 'Mon Salon'}
          </h1>
          {lieu && (
            <p className="text-white/40 text-sm mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {lieu}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-4 pb-0">

        {/* Action + Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Left: Action panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#E2E9FF] rounded-2xl p-6">
              <p className="text-[#04082E] text-sm font-semibold mb-5">
                Nombre de sac remplis
              </p>
              <SacCounter salonId={salon?.id ?? ''} />
            </div>

            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">En attente collecte</p>
                <p className="text-3xl font-black text-[#0738DC] leading-tight mt-0.5">
                  {String(enAttente).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Activité récente */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#04082E] text-sm">Activité récente</h3>
            </div>
            {recentSacs && recentSacs.length > 0 ? (
              <>
                <ul className="divide-y divide-slate-50">
                  {recentSacs.map((sac, i) => {
                    const isCollected = sac.statut_collecte === 'collected'
                    const date = new Date(sac.declared_at)
                    const today = new Date()
                    const isToday = date.toDateString() === today.toDateString()
                    const label = isToday
                      ? `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                      : date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

                    return (
                      <li key={i} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                            {isCollected ? (
                              <svg className="w-4 h-4 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-[#04082E] text-sm font-semibold">
                              {isCollected ? 'Collecte réussie' : 'Sac signalé'}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                          </div>
                        </div>
                        <span className="text-[#0738DC] text-xs font-bold bg-[#E2E9FF] px-3 py-1 rounded-full whitespace-nowrap">
                          + 1 sac
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <div className="px-6 py-3 border-t border-slate-50 text-center">
                  <span className="text-[#04082E] text-sm font-medium cursor-pointer hover:text-[#0738DC] transition-colors">
                    Voir tout
                  </span>
                </div>
              </>
            ) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                Aucune activité pour le moment
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Votre impact — section pleine largeur */}
      <section className="bg-[#04082E] px-6 md:px-10 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white font-bold text-xl mb-1">Votre impact</h2>
          <p className="text-white/40 text-sm mb-8">
            Suivez les indicateurs liés à vos collectes et leur contribution environnementale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sacs collectés */}
            <div className="bg-[#0F1A4A] rounded-2xl p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E2E9FF]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#E2E9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-3xl font-black">{totalCollectes}</p>
                <p className="text-white/50 text-xs mt-0.5">Nombre de sacs collectés</p>
              </div>
            </div>
            {/* CO2 */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E2E9FF] flex items-center justify-center flex-shrink-0 text-[#0738DC] font-black text-xs">
                CO₂
              </div>
              <div>
                <p className="text-[#04082E] text-3xl font-black">{co2Epargne}kg</p>
                <p className="text-slate-400 text-xs mt-0.5">CO2 épargné</p>
              </div>
            </div>
            {/* Eau */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" />
                </svg>
              </div>
              <div>
                <p className="text-[#04082E] text-3xl font-black">{eauPreservee}L</p>
                <p className="text-slate-400 text-xs mt-0.5">Eau préservée</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}