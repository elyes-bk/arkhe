"use client";

import { useState, useEffect } from "react";
import type { SalonMapPoint, SalonWithCoords } from "@/lib/geo";

import { fetchOptimizedRoute, geocodeAddress } from "@/lib/geo";

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

  const [tourState, setTourState] = useState<"idle" | "generated" | "navigating">("idle");
  const [actualRouteStats, setActualRouteStats] = useState<{ distanceKm: number; durationMin: number; waypoints: { location: [number, number]; waypoint_index: number; trips_index: number }[] } | null>(null);
  const [orderedSalons, setOrderedSalons] = useState<SalonWithCoords[]>([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  const [addressInput, setAddressInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  // 1. Data hooks
  const {
    setSalons,
    filter,
    setFilter,
    visibleSalons,
    collectPoints,
    routeStops,
    routeStats,
    startPoint,
    setStartPoint,
    zoneLabel,
    totalBagsAvailable,
  } = useMapData(initialSalons);

  const [isOptimizing, setIsOptimizing] = useState(false);

  // 2. Map instance & markers
  const { mapContainer, mapError, flyToSalon, drawRoute, clearRoute, syncStartMarker } = useMapLibre(
    visibleSalons,
    setSelectedSalon
  );

  async function handleAddressSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && addressInput.trim()) {
      setIsGeocoding(true);
      const coords = await geocodeAddress(addressInput);
      setIsGeocoding(false);
      if (coords) {
        setStartPoint({ ...coords, label: addressInput });
      } else {
        alert("Adresse introuvable. Essayez d'être plus précis.");
      }
    }
  }

  // Sync start marker on map
  useEffect(() => {
    syncStartMarker(startPoint);
    if (!startPoint) {
      clearRoute();
    }
  }, [startPoint, syncStartMarker, clearRoute]);

  async function handleOptimizeRoute() {
    if (!startPoint || collectPoints.length === 0) return;
    setIsOptimizing(true);
    try {
      let jobId = 1;
      const jobs = [];
      const jobMap = new Map<number, SalonWithCoords>();
      // Ajouter les salons
      for (const salon of collectPoints.slice(0, 4)) {
        jobs.push({
          id: jobId,
          lng: salon.lng,
          lat: salon.lat,
          bags: salon.bag_waiting ?? 0
        });
        jobMap.set(jobId, salon);
        jobId++;
      }

      const optimized = await fetchOptimizedRoute(startPoint, jobs, "driving");
      if (optimized) {
        drawRoute(optimized.geometry);
        setActualRouteStats(optimized);
        
        // Reconstruire l'ordre des salons visités
        const sequence: SalonWithCoords[] = [];
        for (const wp of optimized.waypoints) {
          const salon = jobMap.get(wp.waypoint_index);
          if (salon) sequence.push(salon);
        }
        setOrderedSalons(sequence);
        setTourState("generated");
      } else {
        alert("Impossible de calculer l'itinéraire via OpenRouteService.");
      }
    } catch {
      alert("Erreur réseau lors du calcul de l'itinéraire.");
    } finally {
      setIsOptimizing(false);
    }
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

    // Navigation logic: go to next stop
    if (tourState === "navigating" && orderedSalons.length > 0) {
      const nextIndex = currentStopIndex + 1;
      if (nextIndex < orderedSalons.length) {
        setCurrentStopIndex(nextIndex);
        flyToSalon(orderedSalons[nextIndex]);
      } else {
        // Fin de la tournée
        alert("Tournée terminée ! Tous les salons ont été visités.");
        handleCancelRoute();
      }
    }
  }

  function handleStartTour() {
    if (orderedSalons.length === 0) return;
    setTourState("navigating");
    setCurrentStopIndex(0);
    flyToSalon(orderedSalons[0]);
  }

  function handleCancelRoute() {
    setTourState("idle");
    setActualRouteStats(null);
    setOrderedSalons([]);
    clearRoute();
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
        <div className="absolute left-4 top-4 right-4 md:right-auto z-10 flex items-center gap-2 rounded-[4px] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#04082E] shadow-sm border border-slate-200">
          <span className="shrink-0">Zone :</span>
          <input 
            type="text" 
            placeholder={zoneLabel}
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={handleAddressSearch}
            disabled={isGeocoding}
            className="flex-1 min-w-0 md:w-[280px] outline-none bg-transparent placeholder:text-[#04082E]/50 disabled:opacity-50 text-ellipsis"
          />
          <button 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setStartPoint({
                      lng: pos.coords.longitude,
                      lat: pos.coords.latitude,
                      label: "Ma position",
                    });
                    setAddressInput("Ma position");
                  },
                  () => alert("Impossible de récupérer la position GPS")
                );
              } else {
                alert("La géolocalisation n'est pas supportée par votre navigateur.");
              }
            }}
            className="flex shrink-0 items-center justify-center p-1.5 rounded-full bg-[#0738DC] text-white hover:bg-[#062db0] transition-colors"
            title="Ma position (GPS)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

        {/* Desktop Route Suggested panel - Floating at bottom of map */}
        <div className="absolute bottom-6 left-6 right-6 z-10 hidden md:flex flex-col gap-3 items-center">
          <div className="flex flex-row items-center justify-between gap-6 rounded bg-white pt-[12px] pb-[13px] pl-[36px] pr-[19px] shadow-lg border border-slate-150 w-full max-w-[752px]">
            {tourState === "navigating" ? (
              <>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading text-[15px] font-bold text-[#0738DC]">En Tournée</span>
                    <span className="font-sans text-[13px] text-slate-500">
                      Arrêt {currentStopIndex + 1} sur {orderedSalons.length}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCancelRoute}
                  className="shrink-0 rounded-[2px] bg-white border-[1.5px] border-[#E14D5F] px-6 py-[8px] font-sans text-[13px] font-normal text-[#E14D5F] hover:bg-[#E14D5F]/5 transition-colors shadow-sm"
                >
                  Terminer
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading text-[15px] font-bold text-[#04082E]">
                      {tourState === "generated" ? "Itinéraire optimisé" : "Itinéraire suggéré"}
                    </span>
                    <span className="font-sans text-[13px] text-[#04082E]">
                      {tourState === "generated" && actualRouteStats
                        ? `${actualRouteStats.distanceKm} km • ${actualRouteStats.durationMin} min`
                        : routeStops.length >= 2
                        ? `${routeStats.km} km • ${routeStats.min} min`
                        : "Ajoutez des sacs à collecter"}
                    </span>
                  </div>
                  <div className="w-[1px] h-10 bg-[#04082E]/20"></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-[13px] font-bold text-[#04082E]">
                      {tourState === "generated" ? orderedSalons.length : routeStops.length} point{((tourState === "generated" ? orderedSalons.length : routeStops.length) !== 1) ? "s" : ""} d&apos;arrêt
                    </span>
                    <div className="flex items-center gap-1">
                      {(tourState === "generated" ? orderedSalons : routeStops).map((stop) => {
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
                      {(tourState === "generated" ? orderedSalons : routeStops).length === 0 && (
                        <span className="font-sans text-[11px] text-[#6E6E6E]">Aucun sac</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {tourState === "generated" && (
                    <button
                      onClick={handleCancelRoute}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Annuler"
                    >
                      ✕
                    </button>
                  )}
                  {tourState === "idle" ? (
                    <button
                      type="button"
                      disabled={collectPoints.length === 0 || !startPoint || isOptimizing}
                      onClick={handleOptimizeRoute}
                      className="shrink-0 rounded bg-[#0738DC] px-6 py-[10px] font-sans text-[13px] font-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isOptimizing ? "Optimisation..." : "Générer itinéraire optimal"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartTour}
                      className="shrink-0 rounded bg-[#04082E] px-6 py-[10px] font-sans text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Partir en tournée
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <MobileBottomSheet
          isSheetExpanded={isSheetExpanded}
          setIsSheetExpanded={setIsSheetExpanded}
          totalBagsAvailable={totalBagsAvailable}
          collectPoints={collectPoints}
          startPoint={startPoint}
          isOptimizing={isOptimizing}
          onOptimizeRoute={handleOptimizeRoute}
          flyToSalon={handleFlyToSalon}
          tourState={tourState}
          orderedSalons={orderedSalons}
          currentStopIndex={currentStopIndex}
          onStartTour={handleStartTour}
          onCancelRoute={handleCancelRoute}
        />
      </div>
    </div>
  );
}