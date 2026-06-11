'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { geocodeAdresse, emplacementFromCoords } from '@/lib/geocode'
import { revalidatePath } from 'next/cache'

/** Recalcule le POINT GPS à partir du texte `adresse` */
export async function regeocodeSalon(salonId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createSupabaseServerClient()

  const { data: salon, error: fetchError } = await supabase
    .from('salons')
    .select('id, adresse')
    .eq('id', salonId)
    .single()

  if (fetchError || !salon?.adresse?.trim()) {
    return { ok: false, error: 'Adresse introuvable pour ce salon.' }
  }

  const coords = await geocodeAdresse(salon.adresse)
  if (!coords) {
    return { ok: false, error: 'Impossible de géocoder cette adresse.' }
  }

  const { error: updateError } = await supabase
    .from('salons')
    .update({ emplacement: emplacementFromCoords(coords.lng, coords.lat) })
    .eq('id', salonId)

  if (updateError) {
    return { ok: false, error: updateError.message }
  }

  revalidatePath('/admin/moderation')
  revalidatePath('/admin/map')
  return { ok: true }
}

export async function approveSalon(salonId: string) {
  const supabase = createSupabaseServerClient()

  await regeocodeSalon(salonId)

  const { error } = await supabase
    .from('salons')
    .update({ statut_validation: 'approved' })
    .eq('id', salonId)

  if (error) {
    throw new Error(`Erreur lors de la validation : ${error.message}`)
  }

  revalidatePath('/admin/moderation')
  revalidatePath('/admin/map')
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

  revalidatePath('/admin/moderation')
  revalidatePath('/admin/map')
}

export async function reconsiderSalon(salonId: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('salons')
    .update({ statut_validation: 'waiting' })
    .eq('id', salonId)

  if (error) {
    throw new Error(`Erreur lors de la remise en attente : ${error.message}`)
  }

  revalidatePath('/admin/moderation')
  revalidatePath('/admin/map')
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

  // Marque les sacs existants comme collectés (si des entrées existent dans la table)
  if (sacsToCollect?.length) {
    const sacIds = sacsToCollect.map((s: { id: string }) => s.id)
    const { error: updateSacsError } = await supabase
      .from('sacs')
      .update({ statut_collecte: 'collected' })
      .in('id', sacIds)
    if (updateSacsError) throw new Error(updateSacsError.message)
  }

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
  revalidatePath('/admin/map')
}
