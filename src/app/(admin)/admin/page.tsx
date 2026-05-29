import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminModerationClient from '@/components/AdminModerationClient'

export default async function DashboardAdmin() {
  const supabase = createSupabaseServerClient()

  // Récupère la liste complète des salons avec le join pour récupérer la date d'inscription
  const { data: salons } = await supabase
    .from('salons')
    .select('id, nom_commerce, siret, statut_validation, url_justificatif_local, emplacement, users(created_at)')
    .order('statut_validation', { ascending: true })

  // Reformate les données pour correspondre exactement aux types TS attendus par le composant client
  const formattedSalons = (salons || []).map((salon: any) => ({
    id: salon.id,
    nom_commerce: salon.nom_commerce,
    siret: salon.siret,
    statut_validation: salon.statut_validation,
    url_justificatif_local: salon.url_justificatif_local,
    emplacement: salon.emplacement,
    users: salon.users ? { created_at: salon.users.created_at } : null
  }))

  return <AdminModerationClient initialSalons={formattedSalons} />
}
