'use client'

import { useState, useTransition } from 'react'
import { collecterSacs } from '@/actions/admin'

type Salon = {
  id: string
  nom_commerce: string
  bag_waiting: number
}

export default function CollectionManager({ salons }: { salons: Salon[] }) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const salonsBagWaiting = salons.filter((s) => s.bag_waiting > 0)

  function handleChange(salonId: string, value: number, max: number) {
    setCounts((prev) => ({ ...prev, [salonId]: Math.min(Math.max(0, value), max) }))
  }

  function handleCollecter(salon: Salon) {
    const count = counts[salon.id] ?? 0
    if (count === 0) return

    setErrors((prev) => ({ ...prev, [salon.id]: '' }))

    startTransition(async () => {
      try {
        await collecterSacs(salon.id, count)
        setCounts((prev) => ({ ...prev, [salon.id]: 0 }))
      } catch (e: unknown) {
        setErrors((prev) => ({
          ...prev,
          [salon.id]: e instanceof Error ? e.message : 'Erreur inconnue',
        }))
      }
    })
  }

  if (!salonsBagWaiting.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-slate-100">
        Aucun sac en attente de collecte.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-slate-800">Valider une collecte</h2>
        <p className="text-sm text-slate-400 mt-1">Indiquez le nombre de sacs récupérés par salon.</p>
      </div>

      <div className="divide-y">
        {salonsBagWaiting.map((salon) => {
          const count = counts[salon.id] ?? 0
          return (
            <div key={salon.id} className="flex items-center justify-between px-6 py-4 gap-4">
              <div>
                <p className="font-medium text-slate-800">{salon.nom_commerce}</p>
                <p className="text-sm text-amber-500 font-semibold mt-0.5">
                  {salon.bag_waiting} sac{salon.bag_waiting > 1 ? 's' : ''} en attente
                </p>
                {errors[salon.id] && (
                  <p className="text-xs text-red-500 mt-1">{errors[salon.id]}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleChange(salon.id, count - 1, salon.bag_waiting)}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-50 font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
                    {count}
                  </span>
                  <button
                    onClick={() => handleChange(salon.id, count + 1, salon.bag_waiting)}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-50 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleCollecter(salon)}
                  disabled={count === 0 || isPending}
                  className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-40 transition"
                >
                  {isPending ? '...' : 'Valider'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
