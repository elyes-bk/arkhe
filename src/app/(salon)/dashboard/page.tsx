import { createSupabaseServerClient } from '@/lib/supabase-server'
import SacCounter from '@/components/SacCounter'

export default async function DashboardSalon() {
  const supabase = createSupabaseServerClient()

  //récupère l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()

  //récupère le salon et ses info lié a l'user
  const { data: salon } = await supabase
    .from('salons')
    .select('id, nom_commerce, emplacement, bag_waiting, total_bag_collected')
    .eq('user_id', user?.id)
    .single()

  //Affiche les infos de la BDD récupéré juste avant
  return (
    <>
      <div>
        <p>{salon?.nom_commerce}</p>
        <p>{salon?.emplacement}</p>
      </div>
      <div>
        <p>Total sac collecte</p>
        <p>{salon?.total_bag_collected ?? 0}</p>
        <p>En attente de collecte</p>
        <p>{salon?.bag_waiting ?? 0}</p>
      </div>
      <SacCounter salonId={salon?.id ?? ''} />
    </>
  )
}
