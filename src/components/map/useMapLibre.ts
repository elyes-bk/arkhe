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
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);
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

  const drawRoute = useCallback((routeGeojson: any) => {
    const map = mapRef.current;
    if (!map) return;

    // Annuler toute animation en cours
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const coordinates = routeGeojson.coordinates || [];
    if (coordinates.length === 0) return;

    if (!map.getSource("route")) {
      map.addSource("route", {
        type: "geojson",
        lineMetrics: true,
        data: {
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: routeGeojson }]
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 5,
          "line-opacity": 0.9,
          // Couleur par défaut, sera écrasée par l'animation
          "line-gradient": [
            "interpolate", ["linear"], ["line-progress"],
            0, "#0738DC", 1, "#0738DC"
          ],
        },
      });
    } else {
      const source = map.getSource("route") as maplibregl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", properties: {}, geometry: routeGeojson }]
      });
    }

    // --- Animation du flux lumineux ---
    let progress = -0.1; // Commence légèrement en dehors
    const speed = 0.008; // Vitesse de la lumière

    const animateLight = () => {
      progress += speed;
      if (progress > 1.2) {
        progress = -0.1; // Recommence la boucle
      }

      const p1 = progress - 0.08;
      const p2 = progress;
      const p3 = progress + 0.08;

      const keys = [0];
      if (p1 > 0 && p1 < 1) keys.push(p1);
      if (p2 > 0 && p2 < 1) keys.push(p2);
      if (p3 > 0 && p3 < 1) keys.push(p3);
      keys.push(1);

      // On enlève les doublons et on trie strictement (requis par MapLibre)
      const uniqueKeys = Array.from(new Set(keys)).sort((a, b) => a - b);

      const stops: any[] = [
        "interpolate",
        ["linear"],
        ["line-progress"]
      ];

      uniqueKeys.forEach(k => {
        // Si c'est le centre de la lumière, c'est blanc. Sinon c'est bleu.
        stops.push(k, k === p2 ? "#FFFFFF" : "#0738DC");
      });

      // Appliquer le dégradé dynamique
      map.setPaintProperty("route", "line-gradient", stops);

      animationFrameId = requestAnimationFrame(animateLight);
      animationRef.current = animationFrameId;
    };

    let animationFrameId = requestAnimationFrame(animateLight);
    animationRef.current = animationFrameId;

  }, []);

  const clearRoute = useCallback(() => {
    const map = mapRef.current;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (map && map.getSource("route")) {
      (map.getSource("route") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
    }
  }, []);

  const syncStartMarker = useCallback((pt: { lng: number; lat: number; label: string } | null) => {
    const map = mapRef.current;
    if (!map) return;

    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }

    if (pt) {
      const el = document.createElement("div");
      el.className = "arkhe-start-marker";
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="bg-[#0738DC] text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-normal whitespace-nowrap z-10 border border-white/20">
            Départ : ${pt.label}
          </div>
          <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0738DC] -mt-[1px]"></div>
          <div class="w-5 h-5 bg-[#0738DC] border-[2.5px] border-white rounded-full shadow-md mt-1 relative z-0">
            <div class="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
          </div>
        </div>
      `;
      startMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([pt.lng, pt.lat])
        .addTo(map);
    }
  }, []);

  return {
    mapContainer,
    mapError,
    flyToSalon,
    drawRoute,
    clearRoute,
    syncStartMarker,
    mapInstance: mapRef.current,
  };
}
