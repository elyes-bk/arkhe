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

export default function SalonActivityDonut({ actif, passif, inactif }: Props) {
  const total = actif + passif + inactif;
  const values = { actif, passif, inactif };

  const r = 60;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * r;
  const strokeWidth = 20;
  const gap = total > 0 ? 3 : 0;

  let accumulated = 0;

  return (
    <div className="rounded-[5px] bg-[#FDFDFD] px-6 py-5 shadow-sm flex flex-col">
      <h2 className="mb-5 font-kumbh text-base font-semibold text-[#04082E]">
        Activité des salons
      </h2>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {/* Donut */}
        <svg width="160" height="160" viewBox="0 0 160 160">
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
              const dash = Math.max(pct * circ - gap, 0);
              const offset = accumulated;
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
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              );
            })
          )}
        </svg>

        {/* Légende */}
        <div className="flex w-full justify-around">
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
    </div>
  );
}
