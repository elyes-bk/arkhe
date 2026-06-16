import maplibregl from "maplibre-gl";
import { type SalonMapPoint, getBagMarkerColor } from "@/lib/geo";

export const PARIS_CENTER: [number, number] = [2.3522, 48.8566];

export function createMarkerElement(salon: SalonMapPoint): HTMLDivElement {
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

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Met la chaîne en casse normale : "SALON PRESTIGE" → "Salon Prestige" */
export function toProperCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^|[\s-])([a-z\u00e0-\u00ff])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export function fitMapToSalons(
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
