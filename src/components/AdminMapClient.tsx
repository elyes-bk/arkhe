"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type SalonMapPoint,
  type MapFilterId,
  salonsWithCoords,
  getBagMarkerColor,
  distanceKm,
  estimateRouteMinutes,
} from "@/lib/geo";
import { collecterSacs } from "@/actions/admin";

const FILTERS: { id: MapFilterId; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "approved", label: "Validés" },
  { id: "waiting", label: "En attente" },
  { id: "rejected", label: "Rejetés" },
  { id: "collect", label: "Sacs à collecter" },
];

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const PARIS_CENTER: [number, number] = [2.3522, 48.8566];

function createMarkerElement(salon: SalonMapPoint): HTMLDivElement {
  const sacs = salon.bag_waiting ?? 0;
  const color = getBagMarkerColor(sacs);
  const name = toProperCase(salon.nom_commerce);
  const label =
    sacs > 0
      ? `${name} - ${sacs} sac${sacs > 1 ? "s" : ""}`
      : name;

  const root = document.createElement("div");
  root.className = "arkhe-map-marker";
  if (sacs > 0) root.style.cursor = "pointer";
  root.innerHTML = `
    <div class="arkhe-marker-label">${escapeHtml(label)}</div>
    <div class="arkhe-marker-pin" style="background-color:${color}">
      <span class="arkhe-marker-pin-inner">${sacs > 0 ? sacs : ""}</span>
    </div>
  `;
  return root;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Met la chaîne en casse normale : "SALON PRESTIGE" → "Salon Prestige" */
function toProperCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^|[\s-])([a-z\u00e0-\u00ff])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

function fitMapToSalons(
  map: maplibregl.Map,
  points: { lng: number; lat: number }[]
) {
  const valid = points.filter((p) => isFinite(p.lng) && isFinite(p.lat));
  if (valid.length === 0) {
    map.flyTo({ center: PARIS_CENTER, zoom: 12, duration: 800 });
    return;
  }
  if (valid.length === 1) {
    map.flyTo({ center: [valid[0].lng, valid[0].lat], zoom: 14, duration: 800 });
    return;
  }
  const bounds = new maplibregl.LngLatBounds();
  valid.forEach((p) => bounds.extend([p.lng, p.lat]));
  map.fitBounds(bounds, { padding: { top: 100, bottom: 200, left: 60, right: 60 }, maxZoom: 14 });
}

function CollectPopup({
  salon,
  onClose,
  onValidated,
}: {
  salon: SalonMapPoint;
  onClose: () => void;
  onValidated: (count: number) => void;
}) {
  const max = salon.bag_waiting ?? 0;
  const [count, setCount] = useState(max);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleValider() {
    if (count === 0) return;
    startTransition(async () => {
      await collecterSacs(salon.id, count);
      setDone(true);
      setTimeout(() => {
        onValidated(count);
        onClose();
      }, 1200);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="bg-[#04082E] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base">{salon.nom_commerce}</p>
            {salon.adresse && (
              <p className="text-white/50 text-xs mt-0.5">{salon.adresse}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-[#04082E] font-semibold">Collecte validée !</p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-5">
                <span className="font-semibold text-amber-500">{max} sac{max > 1 ? "s" : ""}</span> en attente.
                Indiquez le nombre récupéré.
              </p>
              <div className="flex items-center justify-center gap-6 bg-[#E2E9FF] rounded-xl py-5 mb-5">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  disabled={count <= 1 || isPending}
                  className="w-10 h-10 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-bold text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
                >
                  −
                </button>
                <span className="text-[#04082E] text-4xl font-black tabular-nums min-w-[3ch] text-center">
                  {String(count).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setCount((c) => Math.min(max, c + 1))}
                  disabled={count >= max || isPending}
                  className="w-10 h-10 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-bold text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleValider}
                disabled={isPending}
                className="w-full bg-[#0738DC] hover:bg-[#0530C0] text-white font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Validation...
                  </span>
                ) : (
                  "Valider la collecte"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminMapClient({
  salons: initialSalons,
  loadError,
}: {
  salons: SalonMapPoint[];
  loadError?: string;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [filter, setFilter] = useState<MapFilterId>("collect");
  const [mounted, setMounted] = useState(false);
  const [salons, setSalons] = useState<SalonMapPoint[]>(initialSalons);
  const [selectedSalon, setSelectedSalon] = useState<SalonMapPoint | null>(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  const visibleSalons = useMemo(
    () => salonsWithCoords(salons, filter),
    [salons, filter]
  );

  const collectPoints = useMemo(
    () => salonsWithCoords(salons, "collect").sort((a, b) => (b.bag_waiting ?? 0) - (a.bag_waiting ?? 0)),
    [salons]
  );

  const routeStops = useMemo(() => collectPoints.slice(0, 4), [collectPoints]);

  const routeStats = useMemo(() => {
    if (routeStops.length < 2) return { km: 0, min: 0 };
    let totalKm = 0;
    for (let i = 0; i < routeStops.length - 1; i++) {
      totalKm += distanceKm(routeStops[i], routeStops[i + 1]);
    }
    return { km: Math.round(totalKm * 10) / 10, min: estimateRouteMinutes(totalKm) };
  }, [routeStops]);

  const zoneLabel = useMemo(() => {
    const addr = salons.find((s) => s.adresse)?.adresse ?? "";
    if (/paris/i.test(addr)) return "Paris";
    const city = addr.split(",").pop()?.trim();
    return city || "France";
  }, [salons]);

  const totalBagsAvailable = useMemo(() => {
    return collectPoints.reduce((sum, stop) => sum + (stop.bag_waiting ?? 0), 0);
  }, [collectPoints]);

  useEffect(() => { setMounted(true); }, []);

  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted || !mapContainer.current) return;

    let map: maplibregl.Map | null = null;
    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: PARIS_CENTER,
        zoom: 12,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");
      mapRef.current = map;

      map.on("load", () => {
        if (map) syncMarkers(map, visibleSalons);
      });

      map.on("error", (e) => {
        console.error("Maplibre error event:", e);
        setMapError(`Erreur Maplibre: ${e.error?.message || "Erreur de style ou de chargement"}`);
      });
    } catch (err: unknown) {
      console.error("Failed to initialize map:", err);
      setMapError(`Exception initialisation carte: ${err instanceof Error ? err.message : String(err)}`);
    }

    return () => {
      clearMarkers();
      if (map) {
        map.remove();
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    syncMarkers(map, visibleSalons);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSalons]);

  function syncMarkers(map: maplibregl.Map, points: ReturnType<typeof salonsWithCoords>) {
    clearMarkers();
    points.forEach((salon) => {
      if (!isFinite(salon.lng) || !isFinite(salon.lat)) return;
      const el = createMarkerElement(salon);
      if ((salon.bag_waiting ?? 0) > 0) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedSalon(salon);
        });
      }
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([salon.lng, salon.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
    fitMapToSalons(map, points);
  }

  function clearMarkers() {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }

  function handleValidated(count: number) {
    if (!selectedSalon) return;
    setSalons((prev) =>
      prev.map((s) =>
        s.id === selectedSalon.id
          ? { ...s, bag_waiting: Math.max(0, (s.bag_waiting ?? 0) - count) }
          : s
      )
    );
  }

  function flyToSalon(salon: { lng: number; lat: number }) {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [salon.lng, salon.lat], zoom: 15, duration: 800 });
    setIsSheetExpanded(false);
  }

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen md:flex-row bg-white">
      {selectedSalon && (
        <CollectPopup
          salon={selectedSalon}
          onClose={() => setSelectedSalon(null)}
          onValidated={handleValidated}
        />
      )}

      {/* Left Panel: Desktop Only (Figma exact match) */}
      <aside className="hidden md:flex flex-col w-[360px] border-r border-slate-200 bg-white flex-shrink-0 select-none h-screen justify-between">
        
        {/* Header Block */}
        <div className="px-6 pt-8 pb-4 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-bold text-[#04082E]">
              Carte Logistique
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E6E6E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E14D5F] animate-pulse" />
              <span>En direct - WebSocket</span>
            </div>
          </div>

          {/* Filters List */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Filtres
            </span>
            <div className="flex flex-wrap gap-1.5">
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

      {/* Main Map Right Content */}
      <div className="flex-1 relative h-full flex flex-col">
        {(mapError || loadError) && (
          <div className="absolute top-16 left-4 right-4 z-30 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-xs flex flex-col gap-1">
            {mapError && <div><strong>Erreur de carte :</strong> {mapError}</div>}
            {loadError && <div><strong>Erreur de chargement des salons :</strong> {loadError}</div>}
          </div>
        )}
        <div className="absolute left-4 top-4 z-10 rounded-[4px] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#04082E] shadow-sm border border-slate-200">
          Zone : {zoneLabel}
        </div>

        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

        {/* Desktop Route Suggested panel - Floating at bottom of map */}
        <div className="absolute bottom-6 left-6 right-6 z-10 hidden md:flex flex-col gap-3 items-center">
          <div className="flex flex-row items-center justify-between gap-6 rounded bg-white pt-[12px] pb-[13px] pl-[36px] pr-[19px] shadow-lg border border-slate-150 w-full max-w-[752px]">
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-[15px] font-bold text-[#04082E]">Itinéraire suggéré</span>
                <span className="font-sans text-[13px] text-[#04082E]">
                  {routeStops.length >= 2
                    ? `${routeStats.km} km • ${routeStats.min} min`
                    : "Ajoutez des sacs à collecter"}
                </span>
              </div>
              
              <div className="w-[1px] h-10 bg-[#04082E]/20"></div>

              <div className="flex flex-col gap-1">
                <span className="font-heading text-[13px] font-bold text-[#04082E]">
                  {routeStops.length} point{routeStops.length !== 1 ? "s" : ""} d'arrêt
                </span>
                <div className="flex flex-wrap gap-[2px]">
                  {routeStops.map((stop) => {
                    const sacs = stop.bag_waiting ?? 0;
                    const color = getBagMarkerColor(sacs);
                    return (
                      <div
                        key={stop.id}
                        className="flex w-5 h-5 items-center justify-center rounded-[2px] text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                        title={stop.nom_commerce}
                      >
                        {sacs}
                      </div>
                    );
                  })}
                  {routeStops.length === 0 && (
                    <span className="font-sans text-[11px] text-[#6E6E6E]">Aucun sac</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={routeStops.length < 2}
              onClick={() => {
                const coords = routeStops.map((s) => `${s.lat},${s.lng}`).join("/");
                window.open(`https://www.google.com/maps/dir/${coords}`, "_blank");
              }}
              className="shrink-0 rounded bg-[#0738DC] px-6 py-[10px] font-sans text-[13px] font-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Générer itinéraire optimal
            </button>
          </div>
        </div>

        {/* Mobile Bottom Sheet — slide-up */}
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
            className="w-full pt-3 pb-1.5 flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isSheetExpanded ? "rotate-180" : "rotate-0"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Header row — always visible */}
          <button
            type="button"
            onClick={() => setIsSheetExpanded((v) => !v)}
            className="w-full px-6 pb-4 flex items-center justify-between focus:outline-none"
          >
            <div className="flex flex-col gap-0.5 text-left">
              <span className="font-heading text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Disponible
              </span>
              <span className="font-heading text-3xl font-black text-[#04082E] leading-none">
                {totalBagsAvailable}
              </span>
            </div>

            <button
              type="button"
              disabled={routeStops.length < 2}
              onClick={(e) => {
                e.stopPropagation();
                const coords = routeStops.map((s) => `${s.lat},${s.lng}`).join("/");
                window.open(`https://www.google.com/maps/dir/${coords}`, "_blank");
              }}
              className="bg-[#0738DC] hover:bg-blue-700 text-white font-heading text-sm font-bold px-6 py-3.5 rounded-[4px] transition-all disabled:opacity-50"
            >
              Générer itinéraire
            </button>
          </button>

          {/* Expandable salon list */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isSheetExpanded ? "flex-1 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="overflow-y-auto" style={{ maxHeight: "calc(75dvh - 120px)" }}>
              {/* Section header */}
              <div className="px-6 pt-1 pb-3 border-t border-slate-100">
                <p className="font-heading text-base font-bold text-[#04082E]">
                  Salons prioritaires
                </p>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  Triés par urgence · Cliquer pour localiser
                </p>
              </div>

              {/* Salon items */}
              <ul className="divide-y divide-slate-100 pb-6">
                {collectPoints.length === 0 ? (
                  <li className="px-6 py-8 text-center">
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
                          className="w-full px-6 py-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-heading text-sm font-bold text-[#04082E] truncate">
                              {salon.nom_commerce}
                            </p>
                            {city && (
                              <p className="font-sans text-xs text-slate-500 mt-0.5 truncate">{city}</p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              {/* Icône sac Figma 14×14 */}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-slate-400">
                                <path d="M11.0104 1.75C11.3392 1.75 11.6545 1.8806 11.8869 2.11307C12.1194 2.34553 12.25 2.66083 12.25 2.98958V4.01042C12.25 4.45375 12.0167 4.84254 11.6667 5.06187V10.4271C11.6667 10.9106 11.4746 11.3742 11.1327 11.7161C10.7909 12.0579 10.3272 12.25 9.84375 12.25H4.15625C3.67278 12.25 3.20912 12.0579 2.86725 11.7161C2.52539 11.3742 2.33333 10.9106 2.33333 10.4271V5.06187C1.98333 4.84254 1.75 4.45404 1.75 4.01042V2.98958C1.75 2.66083 1.8806 2.34553 2.11307 2.11307C2.34553 1.8806 2.66083 1.75 2.98958 1.75H11.0104ZM3.0625 10.4271C3.0625 10.7172 3.17773 10.9954 3.38285 11.2005C3.58797 11.4056 3.86617 11.5208 4.15625 11.5208H9.84375C10.1338 11.5208 10.412 11.4056 10.6171 11.2005C10.8223 10.9954 10.9375 10.7172 10.9375 10.4271V5.25H3.0625V10.4271ZM8.09375 6.41667C8.19044 6.41667 8.28318 6.45508 8.35155 6.52345C8.41992 6.59182 8.45833 6.68456 8.45833 6.78125C8.45833 6.87794 8.41992 6.97068 8.35155 7.03905C8.28318 7.10742 8.19044 7.14583 8.09375 7.14583H5.90625C5.80956 7.14583 5.71682 7.10742 5.64845 7.03905C5.58008 6.97068 5.54167 6.87794 5.54167 6.78125C5.54167 6.68456 5.58008 6.59182 5.64845 6.52345C5.71682 6.45508 5.80956 6.41667 5.90625 6.41667H8.09375ZM2.98958 2.47917C2.85421 2.47917 2.72439 2.53294 2.62866 2.62866C2.53294 2.72439 2.47917 2.85421 2.47917 2.98958V4.01042C2.47917 4.29217 2.70783 4.52083 2.98958 4.52083H11.0104C11.1458 4.52083 11.2756 4.46706 11.3713 4.37134C11.4671 4.27561 11.5208 4.14579 11.5208 4.01042V2.98958C11.5208 2.85421 11.4671 2.72439 11.3713 2.62866C11.2756 2.53294 11.1458 2.47917 11.0104 2.47917H2.98958Z" fill="currentColor"/>
                              </svg>
                              <span className="font-sans text-xs text-slate-500">
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
          </div>
        </div>
      </div>
    </div>
  );
}