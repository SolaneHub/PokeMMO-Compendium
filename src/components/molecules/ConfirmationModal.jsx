import { X } from "lucide-react";
const ConfirmationModal = ({
  message,
  title,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      {" "}
      <div
        className="relative flex max-h-[85vh] w-[400px] max-w-[90vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* Modal Header */}{" "}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 p-4">
          {" "}
          <h2 className="text-xl font-bold">{title}</h2>{" "}
          <button onClick={onCancel} className="hover: transition-colors">
            {" "}
            <X size={24} />{" "}
          </button>{" "}
        </div>{" "}
        {/* Modal Content */}{" "}
        <div className="flex-1 overflow-y-auto p-6">
          {" "}
          <p className="">{message}</p>{" "}
        </div>{" "}
        {/* Modal Footer */}{" "}
        <div className="flex justify-end gap-3 border-t border-white/5 p-4">
          {" "}
          <button
            onClick={onCancel}
            className="hover: rounded-lg bg-white/5 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/10"
          >
            {" "}
            {cancelText}{" "}
          </button>{" "}
          <button
            onClick={onConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold transition-colors hover:bg-blue-700"
          >
            {" "}
            {confirmText}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ConfirmationModal;
