import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import MoveColoredText from "@/components/molecules/MoveColoredText";
import { Pokemon } from "@/types/pokemon";
import { StrategyStep, StrategyVariation } from "@/types/teams";

interface StrategyModalProps {
  readonly currentPokemonObject: Pokemon | { name: string };
  readonly detailsTitleBackground: string;
  readonly strategyHistory: StrategyStep[][];
  readonly currentStrategyView: StrategyStep[];
  readonly onClose: () => void;
  readonly onBack: () => void;
  readonly onStepClick: (variation: StrategyVariation) => void;
}

const StrategyModal = ({
  currentPokemonObject,
  detailsTitleBackground,
  strategyHistory,
  currentStrategyView,
  onClose,
  onBack,
  onStepClick,
}: StrategyModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderWarning = (warningText: string | undefined) =>
    warningText ? (
      <div className="mb-3 flex w-full">
        <div className="w-full rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-200 shadow-sm">
          ⚠️ {warningText}
        </div>
      </div>
    ) : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      className="fixed inset-0 z-100 m-0 flex h-full max-h-none w-full max-w-none animate-[fade-in_0.2s_ease-out_forwards] items-center justify-center border-none bg-black/80 p-4 backdrop-blur-sm backdrop:bg-transparent"
    >
      <div
        className="relative flex max-h-[85vh] w-[500px] max-w-[90vw] animate-[scale-in_0.3s_ease-out_forwards] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="z-10 flex shrink-0 items-center justify-between p-4 shadow-md"
          style={{ background: detailsTitleBackground }}
        >
          <div className="w-8" /> {/* Spacer to help center the title */}
          <h2 className="m-0 text-xl font-bold text-[#1a1b20] drop-shadow-sm">
            {currentPokemonObject.name}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xl leading-none font-bold text-slate-900 transition-colors hover:bg-black/20"
            aria-label="Close modal"
          >
            <span className="mb-1">×</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#1a1b20] p-6">
          <div className="flex flex-col gap-4">
            {strategyHistory.length > 0 && (
              <button
                className="group mb-2 flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-all hover:bg-white/10"
                onClick={onBack}
              >
                <ArrowLeft size={16} className="text-white" />
                <span>Back</span>
              </button>
            )}

            {currentStrategyView.length === 0 ? (
              <p className="py-8 text-center text-slate-500 italic">
                No strategy available for this Pokémon.
              </p>
            ) : (
              currentStrategyView.map((item, index) => {
                return (
                  <div
                    key={`step-${index}-${item.type}`}
                    className="flex animate-[fade-in_0.3s_ease-out] flex-col"
                  >
                    {(item.type === "main" || item.type === "step") && (
                      <>
                        {item.player && (
                          <div
                            className={`mb-3 rounded-xl border p-4 ${
                              item.type === "main"
                                ? "border-white/5 bg-[#25272e] shadow-sm"
                                : "border-transparent bg-transparent"
                            }`}
                          >
                            <p className="m-0 text-center text-base leading-relaxed">
                              <MoveColoredText text={item.player} />
                            </p>
                          </div>
                        )}
                        {renderWarning(item.warning)}
                      </>
                    )}

                    {item.variations && (
                      <div className="my-2 flex flex-col gap-2.5 border-l-2 border-white/5 pl-4">
                        {item.variations.map((v, vi) => (
                          <button
                            key={`variation-${vi}-${v.name}`}
                            className="group w-full rounded-xl border border-white/5 bg-[#25272e] p-3 text-left transition-all hover:border-blue-500/50 hover:bg-[#2d3038] hover:text-blue-200"
                            onClick={() => onStepClick(v)}
                          >
                            <div className="m-0 flex items-center justify-between text-sm font-semibold">
                              <MoveColoredText text={v.name || "Next"} />
                              <ArrowRight
                                size={16}
                                className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </div>
                            {renderWarning(v.warning)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default StrategyModal;
