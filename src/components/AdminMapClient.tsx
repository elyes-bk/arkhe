"use client";

import { useState } from "react";
import type { SalonMapPoint } from "@/lib/geo";

import { useMapData } from "./map/useMapData";
import { useMapLibre } from "./map/useMapLibre";

import DesktopSidebar from "./map/DesktopSidebar";
import MobileBottomSheet from "./map/MobileBottomSheet";
import CollectPopup from "./map/CollectPopup";

export default function AdminMapClient({
  salons: initialSalons,
  loadError,
}: {
  salons: SalonMapPoint[];
  loadError?: string;
}) {
  const [selectedSalon, setSelectedSalon] = useState<SalonMapPoint | null>(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  // 1. Data hooks
  const {
    salons,
    setSalons,
    filter,
    setFilter,
    visibleSalons,
    collectPoints,
    routeStops,
    routeStats,
    zoneLabel,
    totalBagsAvailable,
  } = useMapData(initialSalons);

  // 2. Map instance & markers
  const { mapContainer, mapError, flyToSalon } = useMapLibre(
    visibleSalons,
    setSelectedSalon
  );

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

  function handleFlyToSalon(salon: { lng: number; lat: number }) {
    flyToSalon(salon);
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

      <DesktopSidebar
        filter={filter}
        setFilter={setFilter}
        collectPoints={collectPoints}
        totalBagsAvailable={totalBagsAvailable}
        flyToSalon={handleFlyToSalon}
      />

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
                <div className="flex items-center gap-1">
                  {routeStops.map((stop) => {
                    const sacs = stop.bag_waiting ?? 0;
                    let color = "#27AE60";
                    if (sacs >= 3) color = "#E14D5F";
                    else if (sacs === 2) color = "#F2994A";
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

        <MobileBottomSheet
          isSheetExpanded={isSheetExpanded}
          setIsSheetExpanded={setIsSheetExpanded}
          totalBagsAvailable={totalBagsAvailable}
          routeStops={routeStops}
          collectPoints={collectPoints}
          flyToSalon={handleFlyToSalon}
        />
      </div>
    </div>
  );
}