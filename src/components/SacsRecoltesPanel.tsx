import SacsBarChart from "@/components/SacsBarChart";

interface Props {
  collected: number[];
  maxVal: number;
  yLabels: number[];
}

export default function SacsRecoltesPanel({ collected, maxVal, yLabels }: Props) {
  return (
    <div className="rounded-[5px] bg-[#FDFDFD] px-6 py-5 shadow-sm flex flex-col gap-4 h-[300px] lg:h-full min-h-0">
      <h2 className="shrink-0 font-kumbh text-base font-semibold text-[#04082E]">Sacs collectés</h2>
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <SacsBarChart collected={collected} maxVal={maxVal} yLabels={yLabels} />
      </div>
    </div>
  );
}
