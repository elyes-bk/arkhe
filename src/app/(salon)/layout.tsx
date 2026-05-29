import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SalonLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (data?.role !== 'salon') redirect('/admin')

  return <>{children}</>
}
