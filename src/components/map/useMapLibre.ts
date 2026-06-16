import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { SalonMapPoint, SalonWithCoords } from "@/lib/geo";
import { createMarkerElement, fitMapToSalons, PARIS_CENTER } from "./mapUtils";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export function useMapLibre(
  visibleSalons: SalonWithCoords[],
  onSalonSelect: (salon: SalonWithCoords) => void
) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const syncMarkers = useCallback((map: maplibregl.Map, points: SalonWithCoords[]) => {
    clearMarkers();
    points.forEach((salon) => {
      if (!isFinite(salon.lng) || !isFinite(salon.lat)) return;
      const el = createMarkerElement(salon);
      if ((salon.bag_waiting ?? 0) > 0) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSalonSelect(salon);
        });
      }
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([salon.lng, salon.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
    fitMapToSalons(map, points);
  }, [clearMarkers, onSalonSelect]);

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

  const flyToSalon = useCallback((salon: { lng: number; lat: number }) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [salon.lng, salon.lat], zoom: 15, duration: 800 });
  }, []);

  return {
    mapContainer,
    mapError,
    flyToSalon,
  };
}
