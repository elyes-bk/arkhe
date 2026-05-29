/**
 * Géocodage via Nominatim (OpenStreetMap)
 * Priorise le code postal présent dans l'adresse pour éviter les décalages d'arrondissement.
 */
export async function geocodeAdresse(
  adresse: string
): Promise<{ lat: number; lng: number } | null> {
  const query = adresse.trim()
  if (!query) return null

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    countrycodes: "fr",
    addressdetails: "1",
  })

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent": "ARKHE/1.0 (https://arkhe.fr; contact@arkhe.fr)",
        "Accept-Language": "fr",
      },
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) return null

  const results: Array<{
    lat: string;
    lon: string;
    display_name?: string;
    address?: { postcode?: string; city?: string };
  }> = await res.json()

  if (!results.length) return null

  const postcodeMatch = query.match(/\b(\d{5})\b/)
  const targetPostcode = postcodeMatch?.[1]

  if (targetPostcode) {
    const byPostcode = results.find(
      (r) =>
        r.address?.postcode === targetPostcode ||
        r.display_name?.includes(targetPostcode)
    )
    if (byPostcode) {
      return {
        lat: parseFloat(byPostcode.lat),
        lng: parseFloat(byPostcode.lon),
      }
    }
  }

  const first = results[0]
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) }
}

export function emplacementFromCoords(lng: number, lat: number): string {
  return `SRID=4326;POINT(${lng} ${lat})`
}
