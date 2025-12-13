import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { logger } from "../utils/logger";

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const resolveRef = useRef(null);

  const confirm = useCallback(
    ({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
      return new Promise((resolve) => {
        if (modalState.isOpen) {
          logger.warn("Confirmation already pending");
          resolve(false);
          return;
        }

        resolveRef.current = resolve;
        setModalState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
        });
      });
    },
    [modalState.isOpen]
  );

  const handleResponse = useCallback((response) => {
    if (resolveRef.current) {
      resolveRef.current(response);
      resolveRef.current = null;
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ConfirmationContext.Provider value={confirm}>
      {children}
      {modalState.isOpen && (
        <ConfirmationModal
          message={modalState.message}
          title={modalState.title}
          confirmText={modalState.confirmText}
          cancelText={modalState.cancelText}
          onConfirm={() => handleResponse(true)}
          onCancel={() => handleResponse(false)}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirm = () => {
  const confirm = useContext(ConfirmationContext);
  if (!confirm) {
    throw new Error("useConfirm must be used within a ConfirmationProvider");
  }
  return confirm;
};

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
      <div
        className="relative flex max-h-[85vh] w-[400px] max-w-[90vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 p-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-slate-300">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t border-white/5 p-4">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-600"
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
    </div>
  );
};
