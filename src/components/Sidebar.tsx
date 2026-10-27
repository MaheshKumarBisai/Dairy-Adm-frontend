import React from 'react';
import { LayoutDashboard, ShoppingBag, Package, Store } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'orders' | 'products';
  onSelectTab: (tab: 'dashboard' | 'orders' | 'products') => void;
  pendingOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount,
}) => {
  return (
    <aside className="sidebar">
      {/* React Bits Ambient Aurora Glow */}
      <div className="sidebar-aurora" />
      <div className="sidebar-grid-pattern" />

      <div className="sidebar-brand">
        <div className="brand-icon-wrap">
          <Store size={22} color="#FFFFFF" />
        </div>
        <div className="brand-text">
          <h2 className="react-bits-shiny">DAIRY ADMIN</h2>
          <span>Operations & Catalog</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          <div className="nav-item-left">
            <LayoutDashboard size={18} className="nav-icon" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => onSelectTab('orders')}
        >
          <div className="nav-item-left">
            <ShoppingBag size={18} className="nav-icon" />
            <span>Live Orders & Delivery</span>
          </div>
          {pendingOrdersCount > 0 && (
            <span className="nav-badge">{pendingOrdersCount}</span>
          )}
        </button>

        <button
          className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => onSelectTab('products')}
        >
          <div className="nav-item-left">
            <Package size={18} className="nav-icon" />
            <span>Product Catalog</span>
          </div>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="store-info-pill">
          <div className="store-avatar" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
            FF
          </div>
          <div className="store-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="store-name">Farm Fresh</span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
                title="Store Online"
              />
            </div>
            <div className="store-id">ID: MR-100001 (Admin)</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
