import type { SalonMapPoint, SalonWithCoords, StartPoint } from "@/lib/geo";
import type { Dispatch, SetStateAction } from "react";

export default function MobileBottomSheet({
  isSheetExpanded,
  setIsSheetExpanded,
  totalBagsAvailable,
  collectPoints,
  startPoint,
  isOptimizing,
  onOptimizeRoute,
  flyToSalon,
  tourState,
  orderedSalons,
  currentStopIndex,
  onStartTour,
  onCancelRoute,
}: {
  isSheetExpanded: boolean;
  setIsSheetExpanded: Dispatch<SetStateAction<boolean>>;
  totalBagsAvailable: number;
  collectPoints: SalonWithCoords[];
  startPoint: StartPoint | null;
  isOptimizing: boolean;
  onOptimizeRoute: () => void;
  flyToSalon: (salon: { lng: number; lat: number }) => void;
  tourState: "idle" | "generated" | "navigating";
  orderedSalons: SalonMapPoint[];
  currentStopIndex: number;
  onStartTour: () => void;
  onCancelRoute: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {isSheetExpanded && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/20"
          onClick={() => setIsSheetExpanded(false)}
        />
      )}

      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
        style={{
          maxHeight: isSheetExpanded ? "75dvh" : "100px",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <button
          type="button"
          aria-label={isSheetExpanded ? "Réduire" : "Voir les salons"}
          onClick={() => setIsSheetExpanded((v) => !v)}
          className="w-full pt-3 pb-3 flex flex-col items-center focus:outline-none"
        >
          <div className="w-[79px] h-[2px] bg-[#D9D9D9] rounded-full" />
        </button>

        {/* Header row — always visible */}
        <div className="w-full px-6 pb-4 flex items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <span className="font-sans text-[13px] font-normal text-[#04082E] uppercase">
              {tourState === "navigating" ? "En tournée" : "Disponible"}
            </span>
            <span className="font-heading text-3xl font-bold text-[#04082E] leading-tight">
              {tourState === "navigating" ? `${currentStopIndex + 1}/${orderedSalons.length}` : totalBagsAvailable}
            </span>
          </div>

          {tourState === "idle" && (
            <button
              type="button"
              disabled={collectPoints.length === 0 || !startPoint || isOptimizing}
              onClick={onOptimizeRoute}
              className="flex-1 rounded bg-[#0738DC] py-2.5 font-sans text-[15px] font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isOptimizing ? "Optimisation..." : "Générer itinéraire"}
            </button>
          )}

          {tourState === "generated" && (
            <div className="flex flex-1 gap-2">
              <button
                type="button"
                onClick={onStartTour}
                className="flex-1 rounded bg-[#04082E] py-2.5 font-sans text-[15px] font-bold text-white transition-opacity hover:opacity-90"
              >
                Partir en tournée
              </button>
              <button
                onClick={onCancelRoute}
                className="px-3 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="Annuler"
              >
                ✕
              </button>
            </div>
          )}

          {tourState === "navigating" && (
            <button
              onClick={onCancelRoute}
              className="flex-1 rounded-[2px] bg-white border-[1.5px] border-[#E14D5F] py-2.5 font-sans text-[15px] font-normal text-[#E14D5F] hover:bg-[#E14D5F]/5 transition-colors"
            >
              Terminer
            </button>
          )}
        </div>

        {/* Expandable salon list */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out flex flex-col ${
            isSheetExpanded ? "flex-1 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "calc(75dvh - 280px)" }}>
            {/* Section header */}
            <div className="px-6 pt-1 pb-3">
              <p className="font-heading text-base font-bold text-[#04082E]">
                Salons prioritaires
              </p>
              <p className="font-sans text-xs text-slate-400 mt-0.5">
                Triés par urgence · Cliquer pour localiser
              </p>
            </div>

            {/* Salon items */}
            <ul className="divide-y divide-[#04082E]/20 pb-6 px-4 border-t border-[#04082E]/20">
              {collectPoints.length === 0 ? (
                <li className="py-8 text-center">
                  <p className="font-sans text-sm text-slate-400">Aucun sac en attente</p>
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
                        className="w-full px-2 py-4 flex flex-col text-left active:opacity-70 transition-opacity"
                      >
                        {/* Top Row: Title, City & Badge */}
                        <div className="w-full flex items-start justify-between">
                          <div className="flex flex-col flex-1 min-w-0 pr-4">
                            <p className="font-heading text-sm font-bold text-[#04082E] truncate">
                              {salon.nom_commerce}
                            </p>
                            {city && (
                              <p className="font-sans text-xs text-slate-500 mt-0.5 truncate">{city}</p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-normal font-sans px-2 py-0.5 rounded-[4px] border ${urgency.color}`}
                          >
                            {urgency.label}
                          </span>
                        </div>

                        {/* Bottom Row: Bags */}
                        <div className="flex items-center gap-1.5 mt-4">
                          {/* Icône sac Figma 14×14 */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#04082E]">
                            <path d="M11.0104 1.75C11.3392 1.75 11.6545 1.8806 11.8869 2.11307C12.1194 2.34553 12.25 2.66083 12.25 2.98958V4.01042C12.25 4.45375 12.0167 4.84254 11.6667 5.06187V10.4271C11.6667 10.9106 11.4746 11.3742 11.1327 11.7161C10.7909 12.0579 10.3272 12.25 9.84375 12.25H4.15625C3.67278 12.25 3.20912 12.0579 2.86725 11.7161C2.52539 11.3742 2.33333 10.9106 2.33333 10.4271V5.06187C1.98333 4.84254 1.75 4.45404 1.75 4.01042V2.98958C1.75 2.66083 1.8806 2.34553 2.11307 2.11307C2.34553 1.8806 2.66083 1.75 2.98958 1.75H11.0104ZM3.0625 10.4271C3.0625 10.7172 3.17773 10.9954 3.38285 11.2005C3.58797 11.4056 3.86617 11.5208 4.15625 11.5208H9.84375C10.1338 11.5208 10.412 11.4056 10.6171 11.2005C10.8223 10.9954 10.9375 10.7172 10.9375 10.4271V5.25H3.0625V10.4271ZM8.09375 6.41667C8.19044 6.41667 8.28318 6.45508 8.35155 6.52345C8.41992 6.59182 8.45833 6.68456 8.45833 6.78125C8.45833 6.87794 8.41992 6.97068 8.35155 7.03905C8.28318 7.10742 8.19044 7.14583 8.09375 7.14583H5.90625C5.80956 7.14583 5.71682 7.10742 5.64845 7.03905C5.58008 6.97068 5.54167 6.87794 5.54167 6.78125C5.54167 6.68456 5.58008 6.59182 5.64845 6.52345C5.71682 6.45508 5.80956 6.41667 5.90625 6.41667H8.09375ZM2.98958 2.47917C2.85421 2.47917 2.72439 2.53294 2.62866 2.62866C2.53294 2.72439 2.47917 2.85421 2.47917 2.98958V4.01042C2.47917 4.29217 2.70783 4.52083 2.98958 4.52083H11.0104C11.1458 4.52083 11.2756 4.46706 11.3713 4.37134C11.4671 4.27561 11.5208 4.14579 11.5208 4.01042V2.98958C11.5208 2.85421 11.4671 2.72439 11.3713 2.62866C11.2756 2.53294 11.1458 2.47917 11.0104 2.47917H2.98958Z" fill="currentColor"/>
                          </svg>
                          <span className="font-sans text-[13px] text-[#04082E]">
                            {sacs} sac{sacs > 1 ? "s" : ""}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
