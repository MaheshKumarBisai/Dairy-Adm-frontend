import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Repeat,
  Package,
  Volume2,
  VolumeX,
  Bell,
  Plus,
  Check,
  Bike,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { AppNotification } from './Header';

interface FloatingMenuCardProps {
  hidden?: boolean;
  activeTab: 'dashboard' | 'orders' | 'plans' | 'products';
  onSelectTab: (tab: 'dashboard' | 'orders' | 'plans' | 'products') => void;
  pendingOrdersCount: number;
  activePlansCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProductModal: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onSelectNotificationOrder: (orderId: string) => void;
}

export const FloatingMenuCard: React.FC<FloatingMenuCardProps> = ({
  hidden = false,
  activeTab,
  onSelectTab,
  pendingOrdersCount,
  activePlansCount,
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

  const isRinging = unreadCount > 0;

  return (
    <nav className={`floating-menu-card ${hidden ? 'hidden' : ''}`}>
      {/* 1. Left: Brand & Live Status */}
      <div className="menu-card-brand" onClick={() => onSelectTab('dashboard')}>
        <div className="brand-logo-box">
          <img src={logoImg} alt="Daily Milk Logo" className="brand-logo-img" />
        </div>
        <div className="brand-info">
          <div className="react-bits-shiny-black brand-title">DAIRY ADMIN</div>
          <div className="brand-sub">
            <span className="live-dot" title="Store Online" />
            <span>Farm Fresh • Live</span>
          </div>
        </div>
      </div>

      {/* 2. Center: Navigation Tabs (Minimalist Floating Pills) */}
      <div className="menu-card-tabs">
        <button
          className={`menu-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          <LayoutDashboard size={17} className="tab-icon" />
          <span>Dashboard</span>
        </button>

        <button
          className={`menu-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => onSelectTab('orders')}
        >
          <ShoppingBag size={17} className="tab-icon" />
          <span>Live Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="tab-badge red">{pendingOrdersCount}</span>
          )}
        </button>

        <button
          className={`menu-tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => onSelectTab('plans')}
        >
          <Repeat size={17} className="tab-icon" />
          <span>Dairy Plans</span>
          {activePlansCount > 0 && (
            <span className="tab-badge green">{activePlansCount}</span>
          )}
        </button>

        <button
          className={`menu-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => onSelectTab('products')}
        >
          <Package size={17} className="tab-icon" />
          <span>Products</span>
        </button>
      </div>

      {/* 3. Right: Utility Controls (Volume, Ringing Bell, + Add Product) */}
      <div className="menu-card-actions">
        {/* Audio Volume Toggle */}
        <button
          className="menu-action-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Order Audio Chime' : 'Enable Order Audio Chime'}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={16} color="#059669" />
              <span style={{ color: '#0F172A' }}>Audio On</span>
            </>
          ) : (
            <>
              <VolumeX size={16} color="#64748B" />
              <span style={{ color: '#64748B' }}>Muted</span>
            </>
          )}
        </button>

        {/* Animated Ringing Bell Notification Icon */}
        <div style={{ position: 'relative' }} ref={popoverRef}>
          <button
            className={`bell-btn ${isRinging ? 'ringing' : ''}`}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
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

          {/* Notification Popover Dropdown */}
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

        {/* Primary + Add Product Button */}
        <button className="menu-action-btn primary" onClick={onOpenProductModal}>
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>
    </nav>
  );
};
