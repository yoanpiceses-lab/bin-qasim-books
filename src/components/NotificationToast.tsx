import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, showNotification } = useCart();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div
      id="notification-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full shadow-xl rounded-xl border bg-white p-4 transition-all duration-300 transform translate-y-0"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600" />}
        </div>
        <div className="flex-1 text-sm font-medium text-slate-800">
          {notification.message}
        </div>
        <button
          id="btn-close-toast"
          onClick={() => showNotification('', 'info')}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
