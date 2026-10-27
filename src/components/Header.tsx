import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Plus, Bell, Check, ShoppingBag, Bike } from 'lucide-react';

export interface AppNotification {
  id: string;
  orderId?: string;
  type: 'NEW_ORDER' | 'DELIVERY_ACCEPTED' | 'DELIVERY_STATUS_UPDATED';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface HeaderProps {
  title: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProductModal: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onSelectNotificationOrder: (orderId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  soundEnabled,
  onToggleSound,
  onOpenProductModal,
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onSelectNotificationOrder,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const isRinging = unreadCount > 0;

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        {/* Mute / Unmute Sound Alerts */}
        <button
          className="header-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Order Audio Chime' : 'Enable Order Audio Chime'}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={16} color="#059669" />
              <span>Audio On</span>
            </>
          ) : (
            <>
              <VolumeX size={16} color="#64748B" />
              <span>Muted</span>
            </>
          )}
        </button>

        {/* Animated Ringing Bell Notification Symbol */}
        <div style={{ position: 'relative' }} ref={popoverRef}>
          <button
            className={`bell-btn ${isRinging ? 'ringing' : ''}`}
            onClick={handleTogglePopover}
            title={
              unreadCount > 0
                ? `${unreadCount} unread order notifications`
                : 'No unread notifications'
            }
          >
            <Bell size={18} className="bell-icon" />
            {unreadCount > 0 && (
              <span className="bell-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Sleek Notification Popover */}
          {isPopoverOpen && (
            <div className="notification-popover">
              <div className="popover-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bell size={16} color="#0F172A" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 8,
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#059669',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Check size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="popover-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No new notifications yet. When a customer orders, the bell will ring!
                  </div>
                ) : (
                  notifications.slice(0, 15).map((n) => (
                    <div
                      key={n.id}
                      className="popover-item"
                      style={{
                        backgroundColor: n.read ? '#FFFFFF' : '#F0FDF4',
                      }}
                      onClick={() => {
                        if (n.orderId) {
                          onSelectNotificationOrder(n.orderId);
                          setIsPopoverOpen(false);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            backgroundColor:
                              n.type === 'NEW_ORDER' ? '#ECFDF5' : '#EFF6FF',
                            color:
                              n.type === 'NEW_ORDER' ? '#059669' : '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {n.type === 'NEW_ORDER' ? (
                            <ShoppingBag size={14} />
                          ) : (
                            <Bike size={14} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: n.read ? 600 : 800,
                              color: '#0F172A',
                            }}
                          >
                            {n.title}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#64748B',
                              lineHeight: 1.3,
                              marginTop: 2,
                            }}
                          >
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: '#94A3B8',
                              fontWeight: 600,
                              marginTop: 4,
                            }}
                          >
                            {new Date(n.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        {!n.read && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#10B981',
                              marginTop: 6,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Product Button */}
        <button className="header-btn primary" onClick={onOpenProductModal}>
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
};
