import { X } from "lucide-react";

interface ConfirmationModalProps {
  message: string;
  title: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  message,
  title,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <dialog
      open
      className="fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none animate-[fade-in_0.2s_ease-out] items-center justify-center bg-transparent p-0 backdrop-blur-sm"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onCancel();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="relative z-10 flex max-h-[85vh] w-[400px] max-w-[90vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 p-4 text-white">
          <h2 id="modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <button onClick={onCancel} className="hover: transition-colors">
            <X size={24} />
          </button>
        </div>
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 text-white">
          <p className="">{message}</p>
        </div>
        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t border-white/5 p-4">
          <button
            onClick={onCancel}
            className="rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
