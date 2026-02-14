import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import ConfirmationModal from "@/components/molecules/ConfirmationModal";
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
      {" "}
      {children}{" "}
      {modalState.isOpen && (
        <ConfirmationModal
          message={modalState.message}
          title={modalState.title}
          confirmText={modalState.confirmText}
          cancelText={modalState.cancelText}
          onConfirm={() => handleResponse(true)}
          onCancel={() => handleResponse(false)}
        />
      )}{" "}
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
