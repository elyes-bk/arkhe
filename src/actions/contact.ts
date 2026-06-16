'use server'

import { Resend } from 'resend'

const CONTACT_EMAIL = 'arkhe.b3@gmail.com'

const profileLabels: Record<string, string> = {
  coiffeur: 'Un coiffeur',
  laboratoire: 'Un laboratoire',
  entreprise: 'Une entreprise',
}

export type ContactProfileType = 'coiffeur' | 'laboratoire' | 'entreprise'

export interface ContactFormInput {
  firstName: string
  lastName: string
  email: string
  company: string
  profile: ContactProfileType
  comment: string
}

export async function submitContactForm(
  data: ContactFormInput
): Promise<{ success: true } | { success: false; error: string }> {
  const firstName = data.firstName.trim()
  const lastName = data.lastName.trim()
  const email = data.email.trim()
  const company = data.company.trim()
  const comment = data.comment.trim()

  if (!firstName || !lastName || !email || !company || !comment) {
    return { success: false, error: 'Tous les champs sont obligatoires.' }
  }

  if (!['coiffeur', 'laboratoire', 'entreprise'].includes(data.profile)) {
    return { success: false, error: 'Veuillez sélectionner un profil.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Adresse email invalide.' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('submitContactForm: RESEND_API_KEY manquante')
    return {
      success: false,
      error: "Impossible d'envoyer le message. Veuillez réessayer.",
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const profileLabel = profileLabels[data.profile]

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'ARKHE Contact <onboarding@resend.dev>',
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `Nouveau contact ARKHE — ${firstName} ${lastName} (${company})`,
    html: `
      <h2>Nouveau message depuis le formulaire de contact</h2>
      <p><strong>Prénom :</strong> ${firstName}</p>
      <p><strong>Nom :</strong> ${lastName}</p>
      <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Entreprise / laboratoire :</strong> ${company}</p>
      <p><strong>Profil :</strong> ${profileLabel}</p>
      <p><strong>Commentaire :</strong></p>
      <p>${comment.replace(/\n/g, '<br>')}</p>
    `,
  })

  if (error) {
    console.error('submitContactForm:', error.message)
    return {
      success: false,
      error: "Impossible d'envoyer le message. Veuillez réessayer.",
    }
  }

  return { success: true }
}
