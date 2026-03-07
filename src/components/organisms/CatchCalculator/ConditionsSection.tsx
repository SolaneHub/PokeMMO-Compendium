import { Zap } from "lucide-react";
import React from "react";

import Slider from "@/components/atoms/Slider";
import { STATUS_CONDITIONS } from "@/constants/calculatorConstants";

interface ConditionsSectionProps {
  targetHpPercentage: number;
  setTargetHpPercentage: (val: number) => void;
  statusCondition: string;
  setStatusCondition: (val: string) => void;
}

const ConditionsSection = ({
  targetHpPercentage,
  setTargetHpPercentage,
  statusCondition,
  setStatusCondition,
}: ConditionsSectionProps) => {
  const getHpColorClass = (hp: number) => {
    if (hp > 50) return "bg-green-500";
    if (hp > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <Zap className="text-yellow-400" size={20} />
        <h2 className="text-lg font-bold text-slate-200">Conditions</h2>
      </div>

      {/* HP Slider */}
      <Slider
        label={`Remaining HP: ${targetHpPercentage}%`}
        value={targetHpPercentage}
        onChange={setTargetHpPercentage}
        min={1}
        max={100}
        colorClass={getHpColorClass(targetHpPercentage)}
      />

      {/* Status Conditions */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-500">
          Status Condition
        </label>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {STATUS_CONDITIONS.map((status) => (
            <button
              key={status.name}
              onClick={() => setStatusCondition(status.name)}
              style={{
                background:
                  statusCondition === status.name ? status.gradient : undefined,
              }}
              className={`rounded-lg border-2 px-3 py-3 text-sm font-bold transition-all ${
                statusCondition === status.name
                  ? "scale-105 border-white text-white shadow-lg text-shadow-sm"
                  : "border-white/5 bg-[#0f1014] text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200"
              } `}
            >
              <span
                className={
                  statusCondition === status.name ? "drop-shadow-md" : ""
                }
              >
                {status.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConditionsSection;
