'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function approveSalon(salonId: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('salons')
    .update({ statut_validation: 'approved' })
    .eq('id', salonId)

  if (error) {
    throw new Error(`Erreur lors de la validation : ${error.message}`)
  }

  revalidatePath('/admin')
}

export async function rejectSalon(salonId: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('salons')
    .update({ statut_validation: 'rejected' })
    .eq('id', salonId)

  if (error) {
    throw new Error(`Erreur lors du rejet : ${error.message}`)
  }

  revalidatePath('/admin')
}

export async function collecterSacs(salonId: string, count: number) {
  const supabase = createSupabaseServerClient()

  // Récupère les N premiers sacs en attente de ce salon
  const { data: sacsToCollect, error: selectError } = await supabase
    .from('sacs')
    .select('id')
    .eq('salon_id', salonId)
    .eq('statut_collecte', 'waiting')
    .limit(count)

  if (selectError) throw new Error(selectError.message)
  if (!sacsToCollect?.length) throw new Error('Aucun sac en attente.')

  const sacIds = sacsToCollect.map((s: { id: string }) => s.id)

  // Marque ces sacs comme collectés
  const { error: updateSacsError } = await supabase
    .from('sacs')
    .update({ statut_collecte: 'collected' })
    .in('id', sacIds)

  if (updateSacsError) throw new Error(updateSacsError.message)

  // Met à jour les compteurs du salon
  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('bag_waiting, total_bag_collected')
    .eq('id', salonId)
    .single()

  if (salonError) throw new Error(salonError.message)

  await supabase
    .from('salons')
    .update({
      bag_waiting: Math.max(0, (salon?.bag_waiting ?? 0) - count),
      total_bag_collected: (salon?.total_bag_collected ?? 0) + count,
    })
    .eq('id', salonId)

  revalidatePath('/admin')
}
