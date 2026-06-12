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
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 26 23" fill="none">
                      <path d="M12.2625 18.875V14.04L9.5 11.2775L15.0262 5.75L17.7888 8.645H20.5525M17 17.625C17 18.6196 17.3951 19.5734 18.0983 20.2767C18.8016 20.9799 19.7554 21.375 20.75 21.375C21.7446 21.375 22.6984 20.9799 23.4017 20.2767C24.1049 19.5734 24.5 18.6196 24.5 17.625C24.5 16.6304 24.1049 15.6766 23.4017 14.9733C22.6984 14.2701 21.7446 13.875 20.75 13.875C19.7554 13.875 18.8016 14.2701 18.0983 14.9733C17.3951 15.6766 17 16.6304 17 17.625ZM0.75 17.625C0.75 18.1175 0.846997 18.6051 1.03545 19.0601C1.22391 19.515 1.50013 19.9284 1.84835 20.2767C2.19657 20.6249 2.60997 20.9011 3.06494 21.0895C3.51991 21.278 4.00754 21.375 4.5 21.375C4.99246 21.375 5.48009 21.278 5.93506 21.0895C6.39003 20.9011 6.80343 20.6249 7.15165 20.2767C7.49987 19.9284 7.77609 19.515 7.96455 19.0601C8.153 18.6051 8.25 18.1175 8.25 17.625C8.25 16.6304 7.85491 15.6766 7.15165 14.9733C6.44839 14.2701 5.49456 13.875 4.5 13.875C3.50544 13.875 2.55161 14.2701 1.84835 14.9733C1.14509 15.6766 0.75 16.6304 0.75 17.625ZM21.375 2.625C21.375 3.12228 21.1775 3.59919 20.8258 3.95083C20.4742 4.30246 19.9973 4.5 19.5 4.5C19.0027 4.5 18.5258 4.30246 18.1742 3.95083C17.8225 3.59919 17.625 3.12228 17.625 2.625C17.625 2.12772 17.8225 1.65081 18.1742 1.29917C18.5258 0.947544 19.0027 0.75 19.5 0.75C19.9973 0.75 20.4742 0.947544 20.8258 1.29917C21.1775 1.65081 21.375 2.12772 21.375 2.625Z" stroke="#0738DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
