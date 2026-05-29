import dynamic from "next/dynamic";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { SidebarAdmin } from "@/components/layout/SidebarAdmin";
import type { SalonMapPoint } from "@/lib/geo";

const AdminMapClient = dynamic(() => import("@/components/AdminMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-slate-50 font-sans text-[#6E6E6E]">
      Chargement de la carte…
    </div>
  ),
});

async function loadSalonsForMap(
  supabase: ReturnType<typeof createSupabaseServerClient>
): Promise<{ salons: SalonMapPoint[]; loadError?: string }> {
  // 1. Vue avec lat/lng (si migration SQL exécutée)
  const { data: viewRows, error: viewError } = await supabase
    .from("salons_map_view")
    .select(
      "id, nom_commerce, statut_validation, adresse, bag_waiting, longitude, latitude"
    );

  if (!viewError && viewRows) {
    return {
      salons: viewRows.map((s) => ({
        id: s.id,
        nom_commerce: s.nom_commerce,
        statut_validation: s.statut_validation,
        adresse: s.adresse,
        bag_waiting: s.bag_waiting,
        longitude: s.longitude,
        latitude: s.latitude,
      })),
    };
  }

  // 2. RPC GeoJSON (si fonction get_salons_map existe)
  const { data: geojson, error: rpcError } = await supabase.rpc(
    "get_salons_map"
  );

  if (!rpcError && geojson?.features?.length) {
    const salons: SalonMapPoint[] = geojson.features.map(
      (f: {
        properties: {
          id: string;
          nom_commerce: string;
          statut_validation: string;
          adresse?: string;
          bag_waiting?: number;
        };
        geometry: { coordinates: [number, number] };
      }) => ({
        id: f.properties.id,
        nom_commerce: f.properties.nom_commerce,
        statut_validation: f.properties.statut_validation,
        adresse: f.properties.adresse ?? null,
        bag_waiting: f.properties.bag_waiting ?? 0,
        longitude: f.geometry.coordinates[0],
        latitude: f.geometry.coordinates[1],
      })
    );
    return { salons };
  }

  // 3. Fallback : table salons (colonnes minimales garanties)
  const { data: rows, error: tableError } = await supabase
    .from("salons")
    .select("id, nom_commerce, statut_validation, emplacement")
    .order("nom_commerce");

  if (tableError) {
    return { salons: [], loadError: tableError.message };
  }

  // Enrichir avec adresse / bag_waiting si les colonnes existent
  const { data: enriched } = await supabase
    .from("salons")
    .select("id, adresse, bag_waiting");

  const extra = new Map(
    (enriched ?? []).map((r: { id: string; adresse?: string; bag_waiting?: number }) => [
      r.id,
      r,
    ])
  );

  return {
    salons: (rows ?? []).map((s) => {
      const more = extra.get(s.id);
      return {
        id: s.id,
        nom_commerce: s.nom_commerce,
        statut_validation: s.statut_validation,
        emplacement: s.emplacement,
        adresse: more?.adresse ?? null,
        bag_waiting: more?.bag_waiting ?? 0,
      };
    }),
  };
}

export default async function AdminMapPage() {
  const supabase = createSupabaseServerClient();
  const { salons, loadError } = await loadSalonsForMap(supabase);

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarAdmin activeTab="map" />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminMapClient salons={salons} loadError={loadError} />
      </div>
    </div>
  );
}
