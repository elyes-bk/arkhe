import { useState, useMemo } from "react";
import { type SalonMapPoint, type MapFilterId, type StartPoint, salonsWithCoords, distanceKm, estimateRouteMinutes } from "@/lib/geo";

export function useMapData(initialSalons: SalonMapPoint[]) {
  const [salons, setSalons] = useState<SalonMapPoint[]>(initialSalons);
  const [filter, setFilter] = useState<MapFilterId>("collect");
  const [startPoint, setStartPoint] = useState<StartPoint | null>(null);

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

  return {
    salons,
    setSalons,
    filter,
    setFilter,
    startPoint,
    setStartPoint,
    visibleSalons,
    collectPoints,
    routeStops,
    routeStats,
    zoneLabel,
    totalBagsAvailable,
  };
}
