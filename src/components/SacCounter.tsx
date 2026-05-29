'use client'

import { useState, useTransition } from 'react'
import { signalerSacs } from '@/actions/sacs'

export default function SacCounter({ salonId }: { salonId: string }) {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  // function qui envoie les info au back-end
  function handleSignaler() {
    if (count === 0) return
    startTransition(async () => {
      await signalerSacs(salonId, count)
      setCount(0)
    })
  }

  return (
    <div className="flex flex-col items-center sm:items-start gap-6 w-full max-w-md mx-auto sm:mx-0">
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold text-slate-600">
          Nombre de sacs de cheveux remplis
        </label>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 w-full justify-between">
          <button 
            type="button"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 text-xl font-bold flex items-center justify-center transition-all shadow-sm text-slate-700 select-none"
            disabled={count === 0 || isPending}
          >
            —
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800 tabular-nums">
              {count}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {count > 1 ? 'sacs' : 'sac'}
            </span>
          </div>
          
          <button 
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 text-xl font-bold flex items-center justify-center transition-all shadow-sm text-slate-700 select-none"
            disabled={isPending}
          >
            +
          </button>
        </div>
      </div>

      <button 
        onClick={handleSignaler} 
        disabled={count === 0 || isPending}
        className={`w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm
          ${count === 0 || isPending 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
            : 'bg-[#0738dc] hover:bg-blue-700 text-white active:scale-[0.98]'
          }
        `}
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signalement en cours...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Déclarer les sacs pour collecte
          </>
        )}
      </button>
    </div>
  )
}
