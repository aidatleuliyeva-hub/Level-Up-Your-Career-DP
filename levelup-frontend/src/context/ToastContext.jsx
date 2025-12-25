import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const ToastContext = createContext(null);

let idCounter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message, options = {}) => {
    const id = idCounter++;
    const duration = options.duration ?? 4000;

    setToasts((prev) => [
      ...prev,
      {
        id,
        type, // "success" | "error" | "info"
        message,
      },
    ]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, opts) => show("success", msg, opts),
    error: (msg, opts) => show("error", msg, opts),
    info: (msg, opts) => show("info", msg, opts),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Контейнер тостов сверху всех */}
      <div className="toast-root">
        {toasts.map((t) => (
          <button
            key={t.id}
            className={`toast toast-${t.type}`}
            onClick={() => removeToast(t.id)}
          >
            <span className="toast-dot" />
            <span className="toast-text">{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
