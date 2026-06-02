import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminModerationClient from "@/components/AdminModerationClient";

export default async function AdminModerationPage() {
  const supabase = createSupabaseServerClient();

  const { data: salons } = await supabase
    .from("salons")
    .select(
      "id, nom_commerce, siret, statut_validation, url_justificatif_local, emplacement, adresse, users(created_at)"
    )
    .order("statut_validation", { ascending: true });

  const formattedSalons = (salons || []).map(
    (salon: {
      id: string;
      nom_commerce: string;
      siret: string;
      statut_validation: string;
      url_justificatif_local: string | null;
      emplacement: unknown;
      adresse: string | null;
      users: { created_at: string } | { created_at: string }[] | null;
    }) => ({
      id: salon.id,
      nom_commerce: salon.nom_commerce,
      siret: salon.siret,
      statut_validation: salon.statut_validation,
      url_justificatif_local: salon.url_justificatif_local,
      emplacement: salon.emplacement,
      adresse: salon.adresse,
      users: Array.isArray(salon.users)
        ? salon.users[0]
          ? { created_at: salon.users[0].created_at }
          : null
        : salon.users
          ? { created_at: salon.users.created_at }
          : null,
    })
  );

  return <AdminModerationClient initialSalons={formattedSalons} />;
}
