import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type SnackbarTone = 'success' | 'error' | 'info';

interface SnackbarItem {
  id: number;
  message: string;
  tone: SnackbarTone;
}

interface SnackbarContextType {
  showSnackbar: (message: string, tone?: SnackbarTone) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const idRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showSnackbar = useCallback((message: string, tone: SnackbarTone = 'success') => {
    const id = idRef.current++;
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  const api = useMemo(
    () => ({
      showSnackbar,
      success: (message: string) => showSnackbar(message, 'success'),
      error: (message: string) => showSnackbar(message, 'error'),
      info: (message: string) => showSnackbar(message, 'info'),
    }),
    [showSnackbar]
  );

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((item) => {
          const isSuccess = item.tone === 'success';
          const isError = item.tone === 'error';
          return (
            <div
              key={item.id}
              className={`pointer-events-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md flex items-start gap-3 ${
                isSuccess
                  ? 'bg-[#0B162A]/95 border-[#C9B7A5]/40 text-white'
                  : isError
                    ? 'bg-rose-950/95 border-rose-400/40 text-white'
                    : 'bg-slate-900/95 border-slate-500/40 text-white'
              }`}
              role="status"
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-[#C9B7A5]" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-300" />
                ) : (
                  <Info className="w-5 h-5 text-sky-300" />
                )}
              </div>
              <p className="flex-1 text-sm font-semibold leading-snug m-0">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="shrink-0 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
};
