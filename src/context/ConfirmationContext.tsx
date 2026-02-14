import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import ConfirmationModal from "@/components/molecules/ConfirmationModal";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmationContext = createContext<ConfirmFn | undefined>(undefined);

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

interface ConfirmationProviderProps {
  children: ReactNode;
}

export const ConfirmationProvider = ({
  children,
}: ConfirmationProviderProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(
    ({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
      return new Promise((resolve) => {
        if (modalState.isOpen) {
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

  const handleResponse = useCallback((response: boolean) => {
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
