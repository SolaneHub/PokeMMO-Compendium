import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import React from "react";

import { StrategyStep } from "@/pages/my-teams/types/teams";

import StepForm from "./StepForm";

interface SortableNestedStepItemProps {
  readonly step: StrategyStep;
  readonly id: string;
  readonly index: number;
  readonly onChange: (updatedStep: StrategyStep) => void;
  readonly onRemove: () => void;
  readonly onMoveUp?: () => void;
  readonly onMoveDown?: () => void;
  readonly isFirst?: boolean;
  readonly isLast?: boolean;
  readonly draggable?: boolean;
  readonly onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function SortableNestedStepItem({
  step,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: SortableNestedStepItemProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative overflow-hidden rounded-xl border border-l-[5px] border-white/5 border-l-purple-500 bg-[#0f1014]/40 p-6 text-white shadow-lg transition-shadow hover:shadow-purple-900/5"
    >
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 text-slate-500"
            aria-label="Reorder controls"
          >
            <div
              className="cursor-grab text-slate-600 transition-colors hover:text-purple-400 active:cursor-grabbing"
              aria-label={`Drag to reorder nested step ${index + 1}`}
            >
              <GripVertical size={20} />
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={isFirst}
                aria-label="Move step up"
                className="rounded p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={isLast}
                aria-label="Move step down"
                className="rounded p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          <h4 className="text-sm font-black tracking-widest text-purple-400 uppercase">
            Nested Step {index + 1}
          </h4>
        </div>
        <button
          type="button"
          className="rounded-lg border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
          onClick={onRemove}
        >
          Remove Nested
        </button>
      </div>
      <StepForm step={step} onChange={onChange} />
    </div>
  );
}
