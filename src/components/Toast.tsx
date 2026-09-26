/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              t.type === 'success'
                ? 'bg-white border-emerald-200 text-neutral-900'
                : t.type === 'warning'
                ? 'bg-white border-amber-200 text-neutral-900'
                : t.type === 'error'
                ? 'bg-white border-rose-200 text-neutral-900'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <h4 className="font-semibold text-neutral-900 leading-snug">{t.title}</h4>
              {t.description && (
                <p className="text-neutral-500 text-[11px] mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
