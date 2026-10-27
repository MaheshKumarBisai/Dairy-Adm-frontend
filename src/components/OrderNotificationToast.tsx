import React from 'react';
import { Bell, X, CheckCircle2, Bike } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'NEW_ORDER' | 'DELIVERY_ACCEPTED' | 'DELIVERY_STATUS_UPDATED';
  title: string;
  message: string;
  timestamp: string;
}

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onViewOrder: (orderId: string) => void;
}

export const OrderNotificationToast: React.FC<ToastProps> = ({
  toasts,
  onDismiss,
  onViewOrder,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isOrder = toast.type === 'NEW_ORDER';
        const isAccept = toast.type === 'DELIVERY_ACCEPTED';

        return (
          <div key={toast.id} className="toast-item">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: isOrder ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isOrder ? (
                <Bell size={18} color="#10B981" />
              ) : isAccept ? (
                <Bike size={18} color="#3B82F6" />
              ) : (
                <CheckCircle2 size={18} color="#8B5CF6" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
                {toast.title}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.3 }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
