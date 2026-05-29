import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SalonLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (userData?.role !== 'salon') redirect('/admin')

  const { data: salon } = await supabase
    .from('salons')
    .select('statut_validation')
    .eq('user_id', user?.id)
    .single()

  if (salon?.statut_validation === 'waiting') redirect('/waiting')

  return <>{children}</>
}
