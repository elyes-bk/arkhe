"use client";

import { useEffect, useState } from "react";

interface Props {
  actif: number;
  passif: number;
  inactif: number;
}

const SEGMENTS = [
  { key: "actif" as const, label: "Actif", color: "#0738DC" },
  { key: "passif" as const, label: "Passif", color: "#04082E" },
  { key: "inactif" as const, label: "Inactif", color: "#E2E9FF" },
];

const r = 110;
const cx = 110;
const cy = 110;
const circ = 2 * Math.PI * r;
const strokeWidth = 26;
const GAP = 4;
const DURATION = 900;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function SalonActivityDonut({ actif, passif, inactif }: Props) {
  const [progress, setProgress] = useState(0);
  const total = actif + passif + inactif;
  const values = { actif, passif, inactif };

  useEffect(() => {
    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(easeOutCubic(p));
      if (p < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [actif, passif, inactif]);

  let accumulated = 0;

  return (
    <div className="rounded-[5px] bg-[#FDFDFD] px-6 py-5 shadow-sm flex flex-col h-[360px] lg:h-full min-h-0">
      <h2 className="mb-4 font-kumbh text-base font-semibold text-[#04082E]">
        Activité des salons
      </h2>

      {/* Donut centré dans l'espace restant */}
      <div className="flex flex-1 items-center justify-center min-h-0 py-4">
        <svg
          viewBox="-13 -13 246 246"
          className="h-full w-auto max-h-[220px]"
        >
          {total === 0 ? (
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#E2E9FF"
              strokeWidth={strokeWidth}
            />
          ) : (
            SEGMENTS.map((seg) => {
              const pct = values[seg.key] / total;
              const dash = Math.max(pct * circ * progress - GAP, 0);
              const offset = -(accumulated * progress);
              accumulated += pct * circ;

              return (
                <circle
                  key={seg.key}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circ}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Légende fixée en bas */}
      <div className="flex w-full justify-around border-t border-gray-100 pt-4">
        {SEGMENTS.map((seg) => {
          const count = values[seg.key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={seg.key} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full border border-gray-200"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-montserrat text-xs text-gray-500">{seg.label}</span>
              </div>
              <span className="font-kumbh text-xl font-bold text-[#04082E]">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
