import type { SalonWithCoords, MapFilterId } from "@/lib/geo";

export const FILTERS: { id: MapFilterId; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "approved", label: "Validés" },
  { id: "waiting", label: "En attente" },
  { id: "rejected", label: "Rejetés" },
  { id: "collect", label: "Sacs à collecter" },
];

export default function DesktopSidebar({
  filter,
  setFilter,
  collectPoints,
  totalBagsAvailable,
  flyToSalon,
}: {
  filter: MapFilterId;
  setFilter: (f: MapFilterId) => void;
  collectPoints: SalonWithCoords[];
  totalBagsAvailable: number;
  flyToSalon: (salon: { lng: number; lat: number }) => void;
}) {
  return (
    <aside className="hidden md:flex flex-col w-[360px] border-r border-slate-200 bg-white flex-shrink-0 select-none h-screen justify-between">
      {/* Header Block */}
      <div className="px-6 pt-8 pb-4 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold text-[#04082E]">
            Carte Logistique
          </h1>
        </div>

        {/* Filters List */}
        <div className="py-6 border-b border-[#04082E]/10 -mx-6 px-6">
          <span className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Filtres
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-[4px] px-2.5 py-1.5 font-heading text-xs font-normal transition-all ${
                  filter === f.id ? "bg-[#0738DC] text-white" : "bg-slate-100 text-[#04082E] hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Salons Scrollable Area — px-4 container, ul -mx-4 pour séparateurs pleine largeur */}
      <div className="flex-1 overflow-y-auto px-4 py-2 border-t border-slate-100 flex flex-col gap-3">
        <div className="pt-2">
          <p className="font-heading text-sm font-bold text-[#04082E]">
            Salons prioritaires
          </p>
          <p className="font-sans text-[11px] text-slate-400">
            Triés par urgence - Cliquer pour localiser
          </p>
        </div>

        <ul className="divide-y divide-slate-100 pb-6 -mx-4">
          {collectPoints.length === 0 ? (
            <li className="py-8 text-center">
              <p className="font-sans text-xs text-slate-400">Aucun sac en attente</p>
            </li>
          ) : (
            collectPoints.map((salon) => {
              const sacs = salon.bag_waiting ?? 0;
              const urgency =
                sacs >= 3
                  ? { label: "Urgent", color: "text-[#E14D5F] border-[#E14D5F]" }
                  : sacs === 2
                  ? { label: "Moyen", color: "text-[#F2994A] border-[#F2994A]" }
                  : { label: "OK", color: "text-[#27AE60] border-[#27AE60]" };

              const city = salon.adresse
                ? salon.adresse.split(",").slice(-2).join(",").trim()
                : "";

              return (
                <li key={salon.id}>
                  <button
                    type="button"
                    onClick={() => flyToSalon(salon)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="font-heading text-[13px] font-bold text-[#04082E] truncate">
                        {salon.nom_commerce}
                      </p>
                      {city && (
                        <p className="font-sans text-[11px] text-slate-500 truncate">{city}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        {/* Icône sac Figma 14×14 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-slate-400">
                          <path d="M11.0104 1.75C11.3392 1.75 11.6545 1.8806 11.8869 2.11307C12.1194 2.34553 12.25 2.66083 12.25 2.98958V4.01042C12.25 4.45375 12.0167 4.84254 11.6667 5.06187V10.4271C11.6667 10.9106 11.4746 11.3742 11.1327 11.7161C10.7909 12.0579 10.3272 12.25 9.84375 12.25H4.15625C3.67278 12.25 3.20912 12.0579 2.86725 11.7161C2.52539 11.3742 2.33333 10.9106 2.33333 10.4271V5.06187C1.98333 4.84254 1.75 4.45404 1.75 4.01042V2.98958C1.75 2.66083 1.8806 2.34553 2.11307 2.11307C2.34553 1.8806 2.66083 1.75 2.98958 1.75H11.0104ZM3.0625 10.4271C3.0625 10.7172 3.17773 10.9954 3.38285 11.2005C3.58797 11.4056 3.86617 11.5208 4.15625 11.5208H9.84375C10.1338 11.5208 10.412 11.4056 10.6171 11.2005C10.8223 10.9954 10.9375 10.7172 10.9375 10.4271V5.25H3.0625V10.4271ZM8.09375 6.41667C8.19044 6.41667 8.28318 6.45508 8.35155 6.52345C8.41992 6.59182 8.45833 6.68456 8.45833 6.78125C8.45833 6.87794 8.41992 6.97068 8.35155 7.03905C8.28318 7.10742 8.19044 7.14583 8.09375 7.14583H5.90625C5.80956 7.14583 5.71682 7.10742 5.64845 7.03905C5.58008 6.97068 5.54167 6.87794 5.54167 6.78125C5.54167 6.68456 5.58008 6.59182 5.64845 6.52345C5.71682 6.45508 5.80956 6.41667 5.90625 6.41667H8.09375ZM2.98958 2.47917C2.85421 2.47917 2.72439 2.53294 2.62866 2.62866C2.53294 2.72439 2.47917 2.85421 2.47917 2.98958V4.01042C2.47917 4.29217 2.70783 4.52083 2.98958 4.52083H11.0104C11.1458 4.52083 11.2756 4.46706 11.3713 4.37134C11.4671 4.27561 11.5208 4.14579 11.5208 4.01042V2.98958C11.5208 2.85421 11.4671 2.72439 11.3713 2.62866C11.2756 2.53294 11.1458 2.47917 11.0104 2.47917H2.98958Z" fill="currentColor"/>
                        </svg>
                        <span className="font-sans text-[11px] text-slate-500">
                          {sacs} sac{sacs > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`ml-3 shrink-0 text-[10px] font-normal font-sans px-2 py-0.5 rounded-[4px] border ${urgency.color}`}
                    >
                      {urgency.label}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Footer info: Total bags in queue */}
      <div className="px-6 py-5 border-t border-slate-200 bg-white flex items-center justify-between">
        <span className="font-sans text-[14px] font-medium text-[#04082E]">Total en attente :</span>
        <span className="font-heading text-[18px] font-bold text-[#04082E] tabular-nums">
          {totalBagsAvailable} sacs
        </span>
      </div>
    </aside>
  );
}
