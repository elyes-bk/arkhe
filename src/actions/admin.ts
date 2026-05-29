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
