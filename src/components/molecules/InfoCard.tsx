import { ReactNode } from "react";

interface InfoCardProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClass?: string;
  valueClass?: string;
}

const InfoCard = ({
  label,
  value,
  className = "",
  labelClass = "",
  valueClass = "",
}: InfoCardProps) => (
  <div
    className={`flex flex-col justify-center rounded-lg border border-white/10 bg-white/5 p-2.5 text-white ${className}`}
  >
    <span
      className={`mb-1 text-[10px] font-bold text-slate-400 uppercase ${labelClass}`}
    >
      {label}
    </span>
    <span className={`text-sm font-semibold ${valueClass}`}>
      {value || "None"}
    </span>
  </div>
);

export default InfoCard;
