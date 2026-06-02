﻿"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const label =
    sacs > 0
      ? `${salon.nom_commerce} - ${sacs} sac${sacs > 1 ? "s" : ""}`
      : salon.nom_commerce;

  const root = document.createElement("div");
  root.className = "arkhe-map-marker";
  root.innerHTML = `
    <div class="arkhe-marker-label">${escapeHtml(label)}</div>
    <div class="arkhe-marker-dot" style="background-color:${color}">
      ${sacs > 0 ? sacs : ""}
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

function fitMapToSalons(
  map: maplibregl.Map,
  points: { lng: number; lat: number }[]
) {
  if (points.length === 0) {
    map.flyTo({ center: PARIS_CENTER, zoom: 12, duration: 800 });
    return;
  }
  if (points.length === 1) {
    map.flyTo({ center: [points[0].lng, points[0].lat], zoom: 14, duration: 800 });
    return;
  }
  const bounds = new maplibregl.LngLatBounds();
  points.forEach((p) => bounds.extend([p.lng, p.lat]));
  map.fitBounds(bounds, { padding: { top: 100, bottom: 200, left: 60, right: 60 }, maxZoom: 14 });
}

export default function AdminMapClient({
  salons,
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

  const visibleSalons = useMemo(
    () => salonsWithCoords(salons, filter),
    [salons, filter]
  );

  const collectPoints = useMemo(
    () =>
      salonsWithCoords(salons, "collect").sort(
        (a, b) => (b.bag_waiting ?? 0) - (a.bag_waiting ?? 0)
      ),
    [salons]
  );

  const routeStops = useMemo(() => collectPoints.slice(0, 4), [collectPoints]);

  const routeStats = useMemo(() => {
    if (routeStops.length < 2) {
      return { km: 0, min: 0 };
    }
    let totalKm = 0;
    for (let i = 0; i < routeStops.length - 1; i++) {
      totalKm += distanceKm(routeStops[i], routeStops[i + 1]);
    }
    return {
      km: Math.round(totalKm * 10) / 10,
      min: estimateRouteMinutes(totalKm),
    };
  }, [routeStops]);

  const zoneLabel = useMemo(() => {
    const addr = salons.find((s) => s.adresse)?.adresse ?? "";
    if (/paris/i.test(addr)) return "Paris";
    const city = addr.split(",").pop()?.trim();
    return city || "France";
  }, [salons]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: PARIS_CENTER,
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");

    mapRef.current = map;

    map.on("load", () => {
      syncMarkers(map, visibleSalons);
    });

    return () => {
      clearMarkers();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    syncMarkers(map, visibleSalons);
  }, [visibleSalons]);

  function syncMarkers(
    map: maplibregl.Map,
    points: ReturnType<typeof salonsWithCoords>
  ) {
    clearMarkers();
    points.forEach((salon) => {
      const el = createMarkerElement(salon);
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

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <header className="border-b border-slate-200 bg-white px-6 py-5 md:pl-[61px]">
        <h1 className="font-heading text-[32px] font-bold leading-tight text-[#04082E]">
          Carte logistique
        </h1>
        <p className="mt-1 font-sans text-[15px] text-[#6E6E6E]">
          {visibleSalons.length} salon{visibleSalons.length !== 1 ? "s" : ""}{" "}
          affiché{visibleSalons.length !== 1 ? "s" : ""} sur la carte
        </p>
        {loadError && (
          <p className="mt-2 font-sans text-sm text-red-600">
            Erreur chargement : {loadError}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded px-3 py-1.5 font-heading text-sm transition-colors ${
                filter === f.id
                  ? "bg-[#0738DC] text-white"
                  : "bg-slate-100 text-[#04082E] hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="admin-map-wrap relative flex-1 min-h-[calc(100vh-180px)]">
        {/* Badge zone */}
        <div className="absolute left-4 top-4 z-10 rounded-md bg-white px-3 py-1.5 font-sans text-sm font-medium text-[#04082E] shadow-md">
          Zone : {zoneLabel}
        </div>

        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

        {/* Panneau itinéraire (maquette Figma) */}
        <div className="absolute bottom-6 left-4 right-4 z-10 mx-auto flex max-w-4xl flex-col gap-3 sm:left-6 sm:right-6">
          <div className="flex flex-col items-stretch gap-4 rounded-xl bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-base font-semibold text-[#04082E]">
                Itinéraire suggéré
              </span>
              <span className="font-sans text-sm text-[#6E6E6E]">
                {routeStops.length >= 2
                  ? `${routeStats.km} km • ${routeStats.min} min`
                  : "Ajoutez des sacs à collecter pour calculer"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-heading text-sm font-semibold text-[#04082E]">
                {routeStops.length} point{routeStops.length !== 1 ? "s" : ""}{" "}
                d&apos;arrêt
              </span>
              <div className="flex flex-wrap gap-2">
                {routeStops.map((stop) => {
                  const sacs = stop.bag_waiting ?? 0;
                  const color = getBagMarkerColor(sacs);
                  return (
                    <div
                      key={stop.id}
                      className="flex size-9 items-center justify-center rounded text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                      title={stop.nom_commerce}
                    >
                      {sacs}
                    </div>
                  );
                })}
                {routeStops.length === 0 && (
                  <span className="font-sans text-xs text-[#6E6E6E]">
                    Aucun sac en attente
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={routeStops.length < 2}
              onClick={() => {
                const coords = routeStops
                  .map((s) => `${s.lat},${s.lng}`)
                  .join("/");
                window.open(
                  `https://www.google.com/maps/dir/${coords}`,
                  "_blank"
                );
              }}
              className="shrink-0 rounded bg-[#0738DC] px-5 py-3 font-heading text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Générer itinéraire optimal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
