'use client'

import { useState, useTransition } from 'react'
import { signalerSacs } from '@/actions/sacs'

export default function SacCounter({ salonId }: { salonId: string }) {
  const [count, setCount] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  function handleSignaler() {
    startTransition(async () => {
      await signalerSacs(salonId, count)
      setCount(1)
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    })
  }

  return (
    <>
      {/* Toast de confirmation */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          sent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-[#187819] text-white rounded-2xl px-5 py-4 shadow-xl max-w-xs lg:max-w-xl w-[calc(100vw-3rem)]">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#E2E9FF] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <p className="font-bold text-sm">Sac pris en compte !</p>
          </div>
          <p className="text-white/60 text-xs leading-relaxed pl-6">
            Votre signalement a bien été enregistré. Une collecte sera organisée prochainement.
          </p>
        </div>
      </div>

    <div className="w-full flex flex-col gap-4 justify-between">
      <p className="text-[#04082E] text-sm font-semibold text-center">
        Nombre de sacs remplis
      </p>
      {/* Counter row */}
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => setCount((c) => Math.max(1, c - 1))}
          disabled={count <= 1 || isPending}
          className="w-11 h-11 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-bold text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
        >
          −
        </button>
        <span className="text-[#04082E] text-4xl font-black tabular-nums min-w-[3ch] text-center">
          {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          disabled={isPending}
          className="w-11 h-11 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-bold text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
        >
          +
        </button>
      </div>

      {/* Envoyer button */}
      <button
        onClick={handleSignaler}
        disabled={isPending}
        className="w-full bg-[#0738DC] hover:bg-[#0530C0] active:scale-[0.98] text-white font-bold py-3 rounded-md transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi...
          </span>
        ) : sent ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Signalé !
          </span>
        ) : (
          'Envoyer'
        )}
      </button>
    </div>
    </>
  )
}