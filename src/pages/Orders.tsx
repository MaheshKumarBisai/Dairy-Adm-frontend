import React, { useState } from 'react';
import { ShoppingBag, Bike, Star, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DELIVERED'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return o.deliveryStatus === 'AVAILABLE' || o.deliveryStatus === 'ASSIGNED';
    if (filter === 'ACCEPTED') return ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.deliveryStatus);
    if (filter === 'DELIVERED') return o.deliveryStatus === 'DELIVERED';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['ALL', 'PENDING', 'ACCEPTED', 'DELIVERED'] as const).map((tab) => (
            <button
              key={tab}
              className={`header-btn ${filter === tab ? 'primary' : ''}`}
              onClick={() => setFilter(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab.toLowerCase()} ({orders.filter((o) => {
                if (tab === 'ALL') return true;
                if (tab === 'PENDING') return o.deliveryStatus === 'AVAILABLE' || o.deliveryStatus === 'ASSIGNED';
                if (tab === 'ACCEPTED') return ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.deliveryStatus);
                if (tab === 'DELIVERED') return o.deliveryStatus === 'DELIVERED';
                return true;
              }).length})
            </button>
          ))}
        </div>
      </div>

      <div className="card-panel">
        {filteredOrders.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <ShoppingBag size={40} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No orders in this view</h4>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Orders placed by customers will automatically pop up here with real-time sound and status sync.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer & Address</th>
                <th>Products Sold</th>
                <th>Total</th>
                <th>Delivery Partner Profile</th>
                <th>Delivery Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const partner = order.deliveryPartner;
                const isDelivered = order.deliveryStatus === 'DELIVERED';
                const isAccepted = ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.deliveryStatus);

                return (
                  <tr key={order.orderId} style={{ cursor: 'pointer' }} onClick={() => onSelectOrder(order)}>
                    <td>
                      <div className="order-id-cell">
                        <ShoppingBag size={16} color="#059669" />
                        <div>
                          <div style={{ fontWeight: 800 }}>#{order.orderId}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customer.name}</div>
                      <div style={{ fontSize: 12, color: '#64748B', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.address}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                      <div style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                        {order.items.length} {order.items.length === 1 ? 'Product' : 'Products'} (Admin Store)
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>₹{order.total}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Paid Online</div>
                    </td>

                    <td>
                      {partner ? (
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A' }}>
                            <span>{partner.name}</span>
                            <span style={{ fontSize: 11, color: '#B45309', fontWeight: 800, background: '#FEF3C7', padding: '1px 6px', borderRadius: 4 }}>
                              ★ {partner.rating}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                            <Bike size={13} color="#059669" />
                            <span>{partner.vehicleType || 'Motorcycle'}</span>
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          Awaiting Partner
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          isDelivered ? 'delivered' : isAccepted ? 'transit' : 'pending'
                        }`}
                      >
                        {order.deliveryStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>
                      <button
                        className="header-btn primary"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                      >
                        View & Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
