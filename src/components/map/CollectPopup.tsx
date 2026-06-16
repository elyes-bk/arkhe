"use client";

import { useState, useTransition } from "react";
import type { SalonMapPoint } from "@/lib/geo";
import { collecterSacs } from "@/actions/admin";

export default function CollectPopup({
  salon,
  onClose,
  onValidated,
}: {
  salon: SalonMapPoint;
  onClose: () => void;
  onValidated: (count: number) => void;
}) {
  const max = salon.bag_waiting ?? 0;
  const [count, setCount] = useState(max);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleValider() {
    if (count === 0) return;
    startTransition(async () => {
      await collecterSacs(salon.id, count);
      setDone(true);
      setTimeout(() => {
        onValidated(count);
        onClose();
      }, 1200);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="bg-[#04082E] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-normal text-base">{salon.nom_commerce}</p>
            {salon.adresse && (
              <p className="text-white/50 text-xs mt-0.5">{salon.adresse}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-[#04082E] font-normal">Collecte validée !</p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-5">
                <span className="font-normal text-amber-500">{max} sac{max > 1 ? "s" : ""}</span> en attente.
                Indiquez le nombre récupéré.
              </p>
              <div className="flex items-center justify-center gap-6 bg-[#E2E9FF] rounded-xl py-5 mb-5">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  disabled={count <= 1 || isPending}
                  className="w-10 h-10 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-normal text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
                >
                  −
                </button>
                <span className="text-[#04082E] text-4xl font-normal tabular-nums min-w-[3ch] text-center">
                  {String(count).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setCount((c) => Math.min(max, c + 1))}
                  disabled={count >= max || isPending}
                  className="w-10 h-10 rounded-xl bg-white border border-[#0738DC]/20 text-[#04082E] font-normal text-xl flex items-center justify-center hover:bg-[#0738DC]/5 active:scale-95 transition-all disabled:opacity-30 select-none"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleValider}
                disabled={isPending}
                className="w-full bg-[#0738DC] hover:bg-[#0530C0] text-white font-sans font-normal py-3 rounded-[4px] transition-all text-[15px] disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Validation...
                  </span>
                ) : (
                  "Valider la collecte"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
