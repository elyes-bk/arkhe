'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

//crée un tableau en fonction du nombre de "count" qu'on insert dans la table sacs
export async function signalerSacs(salonId: string, count: number) {
  const sacs = Array.from({ length: count }, () => ({
    salon_id: salonId,
    statut_collecte: 'waiting',
    declared_at: new Date().toISOString(),
  }))

  await supabase.from('sacs').insert(sacs)

  //récupere le nombre de sacs en attentente
  const { data: salon } = await supabase
    .from('salons')
    .select('bag_waiting')
    .eq('id', salonId)
    .single()

  //met à jour le compteur de sac en attentente
  await supabase
    .from('salons')
    .update({ bag_waiting: (salon?.bag_waiting ?? 0) + count })
    .eq('id', salonId)

  //actualisation automatique
  revalidatePath('/dashboard')
}
