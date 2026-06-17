"use client";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

const BAR_COLORS = {
  low: "#E2E9FF",
  mid: "#04082E",
  high: "#0738DC",
};

function getBarColors(collected: number[]): string[] {
  const ranked = collected
    .map((val, i) => ({ val, i }))
    .sort((a, b) => a.val - b.val)
    .map((item, rank) => ({ ...item, rank }));

  const colors = new Array<string>(12);
  ranked.forEach(({ i, rank }) => {
    if (rank < 4) colors[i] = BAR_COLORS.low;
    else if (rank < 8) colors[i] = BAR_COLORS.mid;
    else colors[i] = BAR_COLORS.high;
  });
  return colors;
}

interface Props {
  collected: number[];
  maxVal: number;
  yLabels: number[];
}

export default function SacsBarChart({ collected, maxVal, yLabels }: Props) {
  const barColors = getBarColors(collected);

  return (
    <div className="flex h-[300px] gap-2">
      {/* Y-axis */}
      <div className="flex flex-col justify-between pb-6 pr-1 text-right">
        {yLabels.map((label) => (
          <span key={label} className="font-montserrat text-[10px] leading-none text-gray-300">
            {label}
          </span>
        ))}
      </div>

      {/* Chart area */}
      <div className="relative flex flex-1 flex-col">
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
          {yLabels.map((label) => (
            <div key={label} className="h-px w-full bg-gray-100" />
          ))}
        </div>

        {/* Barres — les colonnes s'étirent sur toute la hauteur, barre poussée en bas */}
        <div className="flex flex-1 gap-1 pb-6">
          {MONTHS.map((month, i) => {
            const h = maxVal > 0 ? (collected[i] / maxVal) * 100 : 0;
            return (
              <div
                key={month}
                className="group relative flex flex-1 flex-col items-center justify-end"
              >
                {/* Tooltip au-dessus de la barre */}
                {collected[i] > 0 && (
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 hidden w-max -translate-x-1/2 group-hover:block"
                    style={{ bottom: `calc(${h}% + 8px)` }}
                  >
                    <div className="rounded-lg bg-[#04082E] px-3 py-2 shadow-lg">
                      <p className="mb-1 font-montserrat text-[10px] font-semibold text-white/60">
                        {month}
                      </p>
                      <span className="flex items-center gap-1.5 font-montserrat text-xs text-white">
                        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: barColors[i] }} />
                        {collected[i]} collecté{collected[i] > 1 ? "s" : ""}
                      </span>
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#04082E]" />
                    </div>
                  </div>
                )}

                {/* Barre */}
                <div
                  className="w-3/5 rounded-t-sm transition-opacity group-hover:opacity-70"
                  style={{
                    height: `${h}%`,
                    minHeight: collected[i] > 0 ? "3px" : "0",
                    backgroundColor: barColors[i],
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis */}
        <div className="flex h-6 items-center gap-1">
          {MONTHS.map((month) => (
            <div key={month} className="flex flex-1 justify-center">
              <span className="font-montserrat text-[10px] text-gray-400">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
