import React from 'react';
import { Package, ShoppingBag, Bike, IndianRupee, ArrowUpRight, Repeat } from 'lucide-react';
import { DashboardStats, Order } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenProductModal: () => void;
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'plans' | 'products') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  orders,
  onSelectOrder,
  onOpenProductModal,
  onNavigateTab,
}) => {
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* 1. Recent Live Orders Panel (Placed at the top) */}
      <div className="card-panel" style={{ marginBottom: 28 }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Recent Customer Orders</h3>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Click any order to view delivery partner profile and live progress
            </p>
          </div>
          <button className="header-btn" onClick={() => onNavigateTab('orders')}>
            <span>View All</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            No orders received yet. As soon as a customer places an order, it will appear here automatically with real-time notification.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Products Sold</th>
                <th>Total</th>
                <th>Delivery Partner</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const isDelivered = order.deliveryStatus === 'DELIVERED';
                const isAccepted = ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.deliveryStatus);

                return (
                  <tr key={order.orderId} style={{ cursor: 'pointer' }} onClick={() => onSelectOrder(order)}>
                    <td>
                      <div className="order-id-cell">
                        <ShoppingBag size={15} color="#059669" />
                        <span>#{order.orderId}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customer.name}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{order.customer.phone || 'Phone verified'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>₹{order.total}</span>
                    </td>
                    <td>
                      {order.deliveryPartner ? (
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A' }}>
                            <span>{order.deliveryPartner.name}</span>
                            <span style={{ fontSize: 11, color: '#B45309', fontWeight: 800, background: '#FEF3C7', padding: '1px 5px', borderRadius: 4 }}>
                              ★ {order.deliveryPartner.rating}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                            <Bike size={13} color="#059669" />
                            <span>{order.deliveryPartner.vehicleType || 'Motorcycle'}</span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#B45309', fontSize: 12, fontWeight: 600, background: '#FEF3C7', padding: '2px 8px', borderRadius: 6 }}>
                          Awaiting Partner
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          isDelivered
                            ? 'delivered'
                            : isAccepted
                            ? 'transit'
                            : 'pending'
                        }`}
                      >
                        {order.deliveryStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="header-btn"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 2. KPI Cards (Active Orders, Dairy Subscriptions, etc., brought to the end of recent orders) */}
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Store Performance & Metrics</h3>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Active Orders</span>
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="stat-value">{stats?.activeOrders ?? 0}</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Live incoming feed</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigateTab('plans')}>
          <div className="stat-top">
            <span className="stat-label">Dairy Subscriptions</span>
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Repeat size={22} />
            </div>
          </div>
          <div className="stat-value">{stats?.activePlansCount ?? 7}</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
            {stats?.plansCount ?? 12} Total Plans • Daily Milk
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Today's Revenue</span>
            <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <IndianRupee size={22} />
            </div>
          </div>
          <div className="stat-value">₹{stats?.totalRevenue ?? 0}</div>
          <div style={{ fontSize: 12, color: '#2563EB', fontWeight: 600 }}>
            {stats?.totalOrders ?? 0} Total Orders
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Products in Store</span>
            <div className="stat-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              <Package size={22} />
            </div>
          </div>
          <div className="stat-value">{stats?.productsCount ?? 0}</div>
          <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
            Catalog Active
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Delivery Fleet</span>
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Bike size={22} />
            </div>
          </div>
          <div className="stat-value">{stats?.partnersCount ?? 1}</div>
          <div style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>
            Active Delivery Partners
          </div>
        </div>
      </div>
    </div>
  );
};

