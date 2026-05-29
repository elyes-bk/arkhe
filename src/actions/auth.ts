'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { geocodeAdresse, emplacementFromCoords } from '@/lib/geocode'
import { redirect } from 'next/navigation'

type FormState = { error: string } | null

export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Email ou mot de passe incorrect.' }

  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (!userData) {
    await supabase.auth.signOut()
    return { error: 'Profil introuvable, contactez le support.' }
  }

  console.log("userData : ", userData);
  

  if (userData.role === 'salon') {
    const { data: salon } = await supabase
      .from('salons')
      .select('statut_validation')
      .eq('user_id', user?.id)
      .single()

    if (!salon || salon.statut_validation === 'waiting') {
      await supabase.auth.signOut()
      return { error: 'Votre compte est en attente de validation par notre équipe.' }
    }
  }

  if (userData.role === 'admin') redirect('/admin/moderation')
  redirect('/dashboard')
}

export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nomCommerce = (formData.get('nom_commerce') as string) || "Salon en attente de validation"
  const siret = (formData.get('siret') as string) || "00000000000000"
  const adresse = (formData.get('adresse') as string) || "Paris, France"
  const fichier = formData.get('justificatif') as File | null

  if (!email || !password) {
    return { error: 'Tous les champs sont obligatoires.' }
  }

  if (siret && (siret.length !== 14 || !/^\d+$/.test(siret))) {
    return { error: 'Le SIRET doit contenir exactement 14 chiffres.' }
  }

  const coords = await geocodeAdresse(adresse)
  if (!coords) {
    return { error: 'Adresse introuvable, veuillez la préciser (ex: "12 rue de la Paix, Paris").' }
  }

  const supabase = createSupabaseServerClient()

  // Création du compte auth
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return { error: authError.message }

  const userId = authData.user?.id
  if (!userId) return { error: 'Erreur lors de la création du compte.' }

  // Upload du justificatif dans Supabase Storage (bucket : justificatifs) si fourni
  let publicUrl = "https://example.com/placeholder-kbis.pdf"
  if (fichier && fichier.size > 0) {
    const fileExt = fichier.name.split('.').pop()
    const filePath = `${userId}/kbis.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('justificatifs')
      .upload(filePath, fichier)

    if (!uploadError) {
      const { data: { publicUrl: url } } = supabase.storage
        .from('justificatifs')
        .getPublicUrl(filePath)
      publicUrl = url
    }
  }

  // Insertion dans public.salons
  const { error: salonError } = await supabase
    .from('salons')
    .insert({
      user_id: userId,
      nom_commerce: nomCommerce,
      siret,
      url_justificatif_local: publicUrl,
      adresse,
      emplacement: emplacementFromCoords(coords.lng, coords.lat),
      statut_validation: 'waiting',
    })

  if (salonError) return { error: 'Erreur lors de la création du salon.' }

  redirect('/register/success')
}

export async function logout() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
