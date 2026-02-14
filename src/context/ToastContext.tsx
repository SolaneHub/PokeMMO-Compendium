import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

type ShowToastFn = (
  message: string,
  type?: ToastType,
  duration?: number
) => void;

const ToastContext = createContext<ShowToastFn | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-green-500" : ""
            } ${toast.type === "error" ? "bg-red-500" : ""} ${
              toast.type === "info" ? "bg-blue-500" : ""
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ShowToastFn => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
