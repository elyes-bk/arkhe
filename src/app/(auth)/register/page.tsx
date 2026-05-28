'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { register } from '@/actions/auth'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
    >
      {pending ? 'Création du compte...' : 'Créer mon compte'}
    </button>
  )
}

export default function RegisterPage() {
  const [state, action] = useFormState(register, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Créer un compte salon</h1>
        <p className="text-sm text-gray-500 mb-6">
          Votre compte sera validé par notre équipe avant activation.
        </p>

        {state?.error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{state.error}</p>
        )}

        <form action={action} className="flex flex-col gap-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nom_commerce">Nom du salon</label>
            <input
              id="nom_commerce"
              name="nom_commerce"
              type="text"
              required
              placeholder="Salon de coiffure Dupont"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="siret">SIRET (14 chiffres)</label>
            <input
              id="siret"
              name="siret"
              type="text"
              required
              maxLength={14}
              pattern="\d{14}"
              placeholder="12345678901234"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="adresse">Adresse du salon</label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              required
              placeholder="12 rue de la Paix, 75001 Paris"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="justificatif">
              Justificatif (Kbis ou équivalent)
            </label>
            <input
              id="justificatif"
              name="justificatif"
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full border rounded-lg px-3 py-2 text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100"
            />
          </div>

          <hr className="my-1" />

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Déjà un compte ?{' '}
          <Link href="/login" className="font-medium underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
