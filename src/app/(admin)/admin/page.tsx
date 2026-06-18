import { createSupabaseServerClient } from "@/lib/supabase-server";
import { SidebarAdmin } from "@/components/layout/SidebarAdmin";
import SacsRecoltesPanel from "@/components/SacsRecoltesPanel";
import SalonActivityDonut from "@/components/SalonActivityDonut";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalSalons },
    { count: pendingSalons },
    { count: validatedSalons },
    { count: totalSacs },
    { data: allSacs },
    { data: activeSacs },
    { data: passiveSacs },
  ] = await Promise.all([
    supabase.from("salons").select("*", { count: "exact", head: true }),
    supabase.from("salons").select("*", { count: "exact", head: true }).eq("statut_validation", "waiting"),
    supabase.from("salons").select("*", { count: "exact", head: true }).eq("statut_validation", "approved"),
    supabase.from("sacs").select("*", { count: "exact", head: true }),
    supabase
      .from("sacs")
      .select("declared_at, statut_collecte")
      .gte("declared_at", `${currentYear}-01-01`)
      .lte("declared_at", `${currentYear}-12-31`),
    // Salons actifs : au moins 1 sac < 30 jours
    supabase.from("sacs").select("salon_id").gte("declared_at", oneMonthAgo),
    // Salons potentiellement passifs : sacs entre 30 et 60 jours
    supabase.from("sacs").select("salon_id").gte("declared_at", twoMonthsAgo).lt("declared_at", oneMonthAgo),
  ]);

  // Agrégation sacs par mois (graphique)
  const collected = Array(12).fill(0);
  const pending = Array(12).fill(0);
  for (const sac of allSacs ?? []) {
    const month = new Date(sac.declared_at).getMonth();
    if (sac.statut_collecte === "collected") collected[month]++;
    else pending[month]++;
  }
  const maxInMonth = Math.max(...collected, 0);
  const niceStep = (() => {
    if (maxInMonth === 0) return 2;
    const rough = maxInMonth / 5;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    return (([1, 2, 5, 10].find(n => n * mag >= rough)) ?? 10) * mag;
  })();
  const maxVal = niceStep * 5;
  const yLabels = Array.from({ length: 6 }, (_, i) => i * niceStep).reverse();

  // Activité des salons (donut)
  const actifIds = new Set((activeSacs ?? []).map(s => s.salon_id));
  const passifIds = new Set(
    (passiveSacs ?? []).map(s => s.salon_id).filter(id => !actifIds.has(id))
  );
  const total = validatedSalons ?? 0;
  const nbActif = actifIds.size;
  const nbPassif = passifIds.size;
  const nbInactif = Math.max(total - nbActif - nbPassif, 0);

  const stats = [
    { label: "Salons inscrits", value: totalSalons ?? 0, highlight: true },
    { label: "Tonne de carbone produite", value: pendingSalons ?? 0, highlight: false },
    { label: "Tonne de cheveux récolté", value: validatedSalons ?? 0, highlight: false },
    { label: "Emissions de CO2 évitées", value: totalSacs ?? 0, highlight: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-[#F0F2F9] md:flex-row">

      <SidebarAdmin activeTab="dashboard" collapsed={true} />

      <main className="flex-1 flex flex-col overflow-y-auto px-6 py-6 md:px-10 md:py-8">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="font-kumbh text-2xl font-semibold text-[#04082E]">Dashboard</h1>
          <p className="mt-1 font-montserrat text-sm text-gray-500">
            Vérification et validation des dossiers professionnels
          </p>
        </div>

        {/* 4 Cartes stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`relative flex h-[147px] flex-col justify-between overflow-hidden rounded-[5px] px-6 py-5 ${
                stat.highlight
                  ? "bg-gradient-to-br from-[#0D1A94] to-[#04082E]"
                  : "bg-[#04082E]"
              }`}
            >
              {stat.highlight && (
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#0738DC]/30 blur-2xl" />
              )}
              <p className="relative font-montserrat text-base text-white/60">{stat.label}</p>
              <p className="relative font-kumbh text-5xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Panneaux bas */}
        <div className="grid grid-cols-1 gap-6 lg:flex-1 lg:min-h-0 lg:grid-rows-[1fr] lg:[grid-template-columns:62.4%_1fr]">
          <SacsRecoltesPanel collected={collected} maxVal={maxVal} yLabels={yLabels} />
          <SalonActivityDonut actif={nbActif} passif={nbPassif} inactif={nbInactif} />
        </div>
      </main>
    </div>
  );
}
