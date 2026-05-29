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
