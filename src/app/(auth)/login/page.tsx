'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login } from '@/actions/auth'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
    >
      {pending ? 'Connexion...' : 'Se connecter'}
    </button>
  )
}

export default function LoginPage() {
  const [state, action] = useFormState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>

        {state?.error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{state.error}</p>
        )}

        <form action={action} className="flex flex-col gap-4">
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
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-medium underline">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
