import React, { useState } from 'react';
import { X, Phone, Bike, Star, CheckCircle, Clock, MapPin, Package, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

interface DeliveryTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const DeliveryTrackerModal: React.FC<DeliveryTrackerModalProps> = ({
  order,
  onClose,
  onOrderUpdated,
}) => {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const partner = order.deliveryPartner;

  // Progress transition action
  const handleStepProgress = async (nextStatus: string) => {
    try {
      setUpdating(true);
      const updated = await api.simulateProgress(order.orderId, nextStatus);
      onOrderUpdated(updated);
    } catch (err: any) {
      alert(`Error updating delivery status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleSimulateAccept = async () => {
    try {
      setUpdating(true);
      const updated = await api.simulateAcceptOrder(order.orderId);
      onOrderUpdated(updated);
    } catch (err: any) {
      alert(`Error accepting order: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Order #{order.orderId} Details</h3>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Real-time delivery partner profile & live tracking
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* 1. DELIVERY PARTNER PROFILE */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Delivery Partner Profile
            </h4>
            {partner ? (
              <div className="partner-card" style={{ padding: '16px 20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#0F172A' }}>
                      {partner.name}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        background: '#FEF3C7',
                        color: '#B45309',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      <Star size={12} fill="#B45309" color="#B45309" />
                      {partner.rating}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 6, fontSize: 13, color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, color: '#334155' }}>
                      <Bike size={15} color="#059669" />
                      {partner.vehicleType || 'Motorcycle'} • {partner.vehicleNumber}
                    </span>
                    {partner.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Phone size={13} color="#64748B" />
                        {partner.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 9999,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  Assigned & Active
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: '#FEF3C7',
                  border: '1px dashed #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>
                    No delivery partner assigned yet
                  </div>
                  <div style={{ fontSize: 12, color: '#B45309', marginTop: 2 }}>
                    Assign a registered rider partner to deliver this order.
                  </div>
                </div>
                <button
                  className="header-btn"
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    borderColor: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                  }}
                  onClick={handleSimulateAccept}
                  disabled={updating}
                  title="Assign Raj Kumar (Preview: RK)"
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    RK
                  </div>
                  <span>Assign Raj Kumar</span>
                </button>
              </div>
            )}
          </div>

          {/* LIVE OPENSTREETMAP TRACKER (100% Free & Open Source) */}
          {partner && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Rider GPS (OpenStreetMap)
                </h4>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  Free & Open-Source (No API Key)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 190,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                  background: '#F1F5F9',
                }}
              >
                <iframe
                  title="OpenStreetMap Live Tracker"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${((partner.currentLongitude || 77.5946) - 0.008).toFixed(4)}%2C${((partner.currentLatitude || 12.9716) - 0.008).toFixed(4)}%2C${((partner.currentLongitude || 77.5946) + 0.008).toFixed(4)}%2C${((partner.currentLatitude || 12.9716) + 0.008).toFixed(4)}&layer=mapnik&marker=${(partner.currentLatitude || 12.9716).toFixed(4)}%2C${(partner.currentLongitude || 77.5946).toFixed(4)}`}
                  style={{ border: 0, display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* 2. LIVE DELIVERY TIMELINE TRACKER */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Delivery Progress
            </h4>
            <div className="timeline-list">
              {order.progressTimeline.map((item, idx) => (
                <div key={item.step} className="timeline-step">
                  <div className={`step-marker ${item.completed ? 'active' : ''}`}>
                    {item.completed ? <CheckCircle size={16} /> : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: item.completed ? 800 : 600,
                          color: item.completed ? '#0F172A' : '#94A3B8',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.timestamp && (
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick status stepper controls */}
            {partner && order.deliveryStatus !== 'DELIVERED' && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: 12,
                  background: '#F8FAFC',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  marginTop: 8,
                }}
              >
                {order.deliveryStatus === 'ACCEPTED' && (
                  <button
                    className="header-btn primary"
                    style={{ flex: 1 }}
                    onClick={() => handleStepProgress('PICKED_UP')}
                    disabled={updating}
                  >
                    <span>Mark as Picked Up</span>
                    <ArrowRight size={14} />
                  </button>
                )}
                {order.deliveryStatus === 'PICKED_UP' && (
                  <button
                    className="header-btn primary"
                    style={{ flex: 1 }}
                    onClick={() => handleStepProgress('OUT_FOR_DELIVERY')}
                    disabled={updating}
                  >
                    <span>Mark Out for Delivery</span>
                    <ArrowRight size={14} />
                  </button>
                )}
                {order.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                  <button
                    className="header-btn primary"
                    style={{ flex: 1, backgroundColor: '#059669' }}
                    onClick={() => handleStepProgress('DELIVERED')}
                    disabled={updating}
                  >
                    <span>Confirm Order Delivered</span>
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. ORDERED PRODUCTS (ADMIN'S PRODUCTS ONLY) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Admin Products Sold ({order.items.length})
              </h4>
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 700, background: '#ECFDF5', padding: '2px 8px', borderRadius: 6 }}>
                Admin Store Only
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 10,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: '#FFFFFF',
                      border: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <Package size={20} color="#94A3B8" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      Qty: {item.quantity} • {item.unit} • ₹{item.unitPrice} each
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                    ₹{item.totalPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. CUSTOMER & DELIVERY ADDRESS */}
          <div
            style={{
              padding: 14,
              background: '#F8FAFC',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#334155' }}>Customer:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>
                {order.customer.name} ({order.customer.phone || 'No phone'})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#334155' }}>Delivery Address:</span>
              <span style={{ fontWeight: 500, color: '#475569', textAlign: 'right', maxWidth: '65%' }}>
                {order.address}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#334155' }}>Delivery Slot:</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>
                {order.deliverySlot} (Today)
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTop: '1px solid #E2E8F0',
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              <span>Total Paid:</span>
              <span style={{ color: '#0F172A' }}>₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="header-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
