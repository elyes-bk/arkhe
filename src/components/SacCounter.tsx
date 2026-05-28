'use client'

import { useState, useTransition } from 'react'
import { signalerSacs } from '@/actions/sacs'

export default function SacCounter({ salonId }: { salonId: string }) {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  //function qui envoie les info au back-end
  function handleSignaler() {
    if (count === 0) return
    startTransition(async () => {
      await signalerSacs(salonId, count)
      setCount(0)
    })
  }

  return (
    <div>
      <p>Nombre de sacs remplis</p>
      <div>
        <button onClick={() => setCount((c) => Math.max(0, c - 1))}>-</button>
        <p>{count}</p>
        <button onClick={() => setCount((c) => c + 1)}>+</button>
      </div>
      <button onClick={handleSignaler} disabled={count === 0 || isPending}>
        {isPending ? 'Envoi...' : 'Appuyer pour signaler'}
      </button>
    </div>
  )
}
