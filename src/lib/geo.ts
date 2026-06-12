/** Parse emplacement Supabase (GeoJSON, WKT, JSON string) → coordonnées */
export function parseEmplacement(
  emplacement: unknown
): { lng: number; lat: number } | null {
  if (emplacement == null) return null;

  // Coordonnées déjà extraites (vue salons_map_view)
  if (typeof emplacement === "object" && emplacement !== null) {
    const row = emplacement as {
      longitude?: number;
      latitude?: number;
      lng?: number;
      lat?: number;
      type?: string;
      coordinates?: number[] | [number, number];
    };

    if (
      typeof row.longitude === "number" && isFinite(row.longitude) &&
      typeof row.latitude === "number" && isFinite(row.latitude)
    ) {
      return { lng: row.longitude, lat: row.latitude };
    }
    if (
      typeof row.lng === "number" && isFinite(row.lng) &&
      typeof row.lat === "number" && isFinite(row.lat)
    ) {
      return { lng: row.lng, lat: row.lat };
    }

    if (row.type === "Point" && Array.isArray(row.coordinates)) {
      const [lng, lat] = row.coordinates.map(Number);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) return { lng, lat };
    }
  }

  if (typeof emplacement === "string") {
    const trimmed = emplacement.trim();

    // GeoJSON sérialisé en string
    if (trimmed.startsWith("{")) {
      try {
        return parseEmplacement(JSON.parse(trimmed));
      } catch {
        /* ignore */
      }
    }

    // WKT : POINT(lng lat) ou SRID=4326;POINT(lng lat)
    const pointMatch = trimmed.match(
      /POINT\s*\(\s*([-\d.eE+]+)\s+([-\d.eE+]+)\s*\)/i
    );
    if (pointMatch) {
      const lng = parseFloat(pointMatch[1]);
      const lat = parseFloat(pointMatch[2]);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) return { lng, lat };
    }
  }

  return null;
}

/** Libellé court pour liste admin (ville ou adresse) */
export function formatSalonLocation(
  adresse?: string | null,
  emplacement?: unknown
): string {
  if (adresse?.trim()) {
    const parts = adresse.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return parts[parts.length - 1];
    return adresse.trim();
  }

  const coords = parseEmplacement(emplacement);
  if (coords) {
    return `${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`;
  }

  return "Localisation inconnue";
}

export type SalonMapPoint = {
  id: string;
  nom_commerce: string;
  statut_validation: string;
  adresse?: string | null;
  emplacement?: unknown;
  longitude?: number | null;
  latitude?: number | null;
  bag_waiting?: number | null;
};

function getCoords(s: SalonMapPoint): { lng: number; lat: number } | null {
  if (
    typeof s.longitude === "number" && isFinite(s.longitude) &&
    typeof s.latitude === "number" && isFinite(s.latitude)
  ) {
    return { lng: s.longitude, lat: s.latitude };
  }
  return parseEmplacement(s.emplacement);
}

export type MapFilterId = "all" | "approved" | "waiting" | "rejected" | "collect";

/** Couleur marqueur selon nombre de sacs (maquette Figma) */
export function getBagMarkerColor(bagCount: number): string {
  if (bagCount >= 3) return "#E53935";
  if (bagCount === 2) return "#F97316";
  if (bagCount === 1) return "#22C55E";
  return "#9CA3AF";
}

export function filterSalonsForMap(
  salons: SalonMapPoint[],
  filter: MapFilterId
): SalonMapPoint[] {
  return salons.filter((s) => {
    if (filter === "collect") return (s.bag_waiting ?? 0) > 0;
    if (filter === "all") return true;
    return s.statut_validation === filter;
  });
}

export type SalonWithCoords = SalonMapPoint & { lng: number; lat: number };

export function salonsWithCoords(
  salons: SalonMapPoint[],
  filter: MapFilterId
): SalonWithCoords[] {
  return filterSalonsForMap(salons, filter)
    .map((s) => {
      const c = getCoords(s);
      if (!c) return null;
      return { ...s, lng: c.lng, lat: c.lat };
    })
    .filter((s): s is SalonWithCoords => s !== null);
}

/** Distance haversine en km entre deux points */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Estimation durée tournée (km → min, ~14 km/h urbain) */
export function estimateRouteMinutes(distanceKm: number): number {
  return Math.max(5, Math.round((distanceKm / 14) * 60));
}

export function salonsToGeoJSON(
  salons: SalonMapPoint[],
  filter?: "all" | "approved" | "waiting" | "rejected" | "collect"
) {
  const features = salons
    .filter((s) => {
      if (filter === "all" || !filter) return true;
      if (filter === "collect") return (s.bag_waiting ?? 0) > 0;
      return s.statut_validation === filter;
    })
    .map((s) => {
      const coords = getCoords(s);
      if (!coords) return null;

      return {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [coords.lng, coords.lat] as [number, number],
        },
        properties: {
          id: s.id,
          nom: s.nom_commerce,
          statut: s.statut_validation,
          adresse: s.adresse ?? "",
          sacs: s.bag_waiting ?? 0,
        },
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return {
    type: "FeatureCollection" as const,
    features,
  };
}
