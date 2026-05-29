import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminModerationClient from '@/components/AdminModerationClient'
import CollectionManager from '@/components/CollectionManager'

export default async function DashboardAdmin() {
  const supabase = createSupabaseServerClient()

  const { data: salons } = await supabase
    .from('salons')
    .select('id, nom_commerce, siret, statut_validation, url_justificatif_local, emplacement, bag_waiting, users(created_at)')
    .order('statut_validation', { ascending: true })

  const formattedSalons = (salons || []).map((salon: any) => ({
    id: salon.id,
    nom_commerce: salon.nom_commerce,
    siret: salon.siret,
    statut_validation: salon.statut_validation,
    url_justificatif_local: salon.url_justificatif_local,
    emplacement: salon.emplacement,
    bag_waiting: salon.bag_waiting ?? 0,
    users: salon.users ? { created_at: salon.users.created_at } : null
  }))

  return (
    <div className="flex flex-col gap-8 mx-auto">
      <AdminModerationClient initialSalons={formattedSalons} />
      <CollectionManager salons={formattedSalons} />
    </div>
  )
}
