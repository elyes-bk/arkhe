import SacsBarChart from "@/components/SacsBarChart";

interface Props {
  collected: number[];
  maxVal: number;
  yLabels: number[];
}

export default function SacsRecoltesPanel({ collected, maxVal, yLabels }: Props) {
  return (
    <div className="rounded-[5px] bg-[#FDFDFD] px-6 py-5 shadow-sm space-y-4">
      <h2 className="font-kumbh text-base font-semibold text-[#04082E]">Sacs collectés</h2>
      <SacsBarChart collected={collected} maxVal={maxVal} yLabels={yLabels} />
    </div>
  );
}
