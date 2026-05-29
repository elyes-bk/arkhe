'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function signalerSacs(salonId: string, count: number) {
  const supabase = createSupabaseServerClient()

  const sacs = Array.from({ length: count }, () => ({
    salon_id: salonId,
    statut_collecte: 'waiting',
    declared_at: new Date().toISOString(),
  }))

  await supabase.from('sacs').insert(sacs)

  const { data: salon } = await supabase
    .from('salons')
    .select('bag_waiting')
    .eq('id', salonId)
    .single()

  await supabase
    .from('salons')
    .update({ bag_waiting: (salon?.bag_waiting ?? 0) + count })
    .eq('id', salonId)

  revalidatePath('/dashboard')
}
