'use client'

import { useState } from 'react'

type Sac = {
  statut_collecte: string
  declared_at: string
}

export default function RecentActivity({ sacs }: { sacs: Sac[] }) {
  const [expanded, setExpanded] = useState(false)

  const displayed = expanded ? sacs : sacs.slice(0, 5)

  if (sacs.length === 0) {
    return (
      <div className="bg-white rounded-md border border-[#BDC5DF] px-6 py-10 text-center text-slate-400 text-sm">
        Aucune activité pour le moment
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {displayed.map((sac, i) => {
          const isCollected = sac.statut_collecte === 'collected'
          const date = new Date(sac.declared_at)
          const today = new Date()
          const isToday = date.toDateString() === today.toDateString()
          const label = isToday
            ? `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
            : date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

          return (
            <div key={i} className="bg-white rounded-md border border-[#BDC5DF] px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#E2E9FF] flex items-center justify-center flex-shrink-0">
                  {isCollected ? (
                    <svg className="w-4 h-4 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#0738DC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[#04082E] text-sm font-semibold leading-tight">
                    {isCollected ? 'Collecte réussie' : 'Sac signalé'}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                </div>
              </div>
              <span className="text-[#0738DC] text-xs font-bold border border-[#0738DC] px-3 py-1 rounded-md whitespace-nowrap">
                + 1 sac
              </span>
            </div>
          )
        })}
      </div>

      {sacs.length > 5 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-3 w-full py-3 text-[#04082E] text-sm font-semibold hover:underline transition-all flex items-center justify-center gap-1.5"
        >
          {expanded ? (
            <>
              Réduire
              {/*<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>*/}
            </>
          ) : (
            <>
              Voir tout {/*({sacs.length} entrées)*/}
              {/*
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              */}
            </>
          )}
        </button>
      )}
    </div>
  )
}
