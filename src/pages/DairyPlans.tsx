import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  PauseCircle,
  XCircle,
  ShoppingBag,
  User,
  MapPin,
  Repeat,
  AlertCircle,
  Eye,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { DairyPlan } from '../types';

interface DairyPlansPageProps {
  plans: DairyPlan[];
  onUpdateStatus: (planId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => Promise<void>;
  onModalToggle?: (isOpen: boolean) => void;
}

export const DairyPlansPage: React.FC<DairyPlansPageProps> = ({
  plans,
  onUpdateStatus,
  onModalToggle,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'CANCELLED'>('ALL');
  const [selectedPlan, setSelectedPlan] = useState<DairyPlan | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleOpenPlanModal = (plan: DairyPlan) => {
    setSelectedPlan(plan);
    onModalToggle?.(true);
  };

  const handleClosePlanModal = () => {
    setSelectedPlan(null);
    onModalToggle?.(false);
  };

  const filteredPlans = plans.filter((p) => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  const activePlans = plans.filter((p) => p.status === 'ACTIVE');
  const pausedPlans = plans.filter((p) => p.status === 'PAUSED');
  const cancelledPlans = plans.filter((p) => p.status === 'CANCELLED');

  const dailyVolume = activePlans.reduce((sum, p) => {
    return sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const estimatedMonthlyRevenue = activePlans.reduce((sum, p) => {
    return sum + p.totalDailyCost * 30;
  }, 0);

  const handleToggleStatus = async (plan: DairyPlan, targetStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    try {
      setIsUpdating(plan.planId);
      await onUpdateStatus(plan.planId, targetStatus);
    } finally {
      setIsUpdating(null);
    }
  };

  const getFrequencyLabel = (freq: string, days?: number[]) => {
    if (freq === 'DAILY') return 'Everyday (Daily 6-8 AM)';
    if (freq === 'SELECTED_DAYS') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const formatted = days && days.length > 0 ? days.map((d) => dayNames[d] || d).join(', ') : 'Custom Days';
      return `Selected Days (${formatted})`;
    }
    if (freq === 'WEEKLY') return 'Weekly Once';
    if (freq === 'MONTHLY') return 'Monthly Delivery';
    return freq;
  };

  return (
    <div>
      {/* 4 Plan KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Active Subscriptions</span>
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Repeat size={22} />
            </div>
          </div>
          <div className="stat-value">{activePlans.length}</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
            {plans.length} Total Subscribed Customers
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Daily Delivery Units</span>
            <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="stat-value">{dailyVolume} packs</div>
          <div style={{ fontSize: 12, color: '#2563EB', fontWeight: 600 }}>
            Scheduled for Tomorrow Morning
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Est. Monthly Subscription MRR</span>
            <div className="stat-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              <IndianRupee size={22} />
            </div>
          </div>
          <div className="stat-value">₹{estimatedMonthlyRevenue.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
            Recurring predictable revenue
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Paused Plans</span>
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <PauseCircle size={22} />
            </div>
          </div>
          <div className="stat-value">{pausedPlans.length}</div>
          <div style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>
            {cancelledPlans.length} Cancelled
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`header-btn ${filter === 'ALL' ? 'primary' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Plans ({plans.length})
          </button>
          <button
            className={`header-btn ${filter === 'ACTIVE' ? 'primary' : ''}`}
            onClick={() => setFilter('ACTIVE')}
          >
            Active ({activePlans.length})
          </button>
          <button
            className={`header-btn ${filter === 'PAUSED' ? 'primary' : ''}`}
            onClick={() => setFilter('PAUSED')}
          >
            Paused ({pausedPlans.length})
          </button>
          <button
            className={`header-btn ${filter === 'CANCELLED' ? 'primary' : ''}`}
            onClick={() => setFilter('CANCELLED')}
          >
            Cancelled ({cancelledPlans.length})
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="card-panel">
        {filteredPlans.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <Repeat size={44} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No dairy plans found</h4>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              When customers set up daily or weekly milk delivery schedules in the mobile app, they appear here.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan ID</th>
                <th>Customer & Phone</th>
                <th>Delivery Address</th>
                <th>Subscribed Items</th>
                <th>Frequency & Schedule</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => {
                const isActive = plan.status === 'ACTIVE';
                const isPaused = plan.status === 'PAUSED';

                return (
                  <tr key={plan.planId}>
                    <td>
                      <div className="order-id-cell">
                        <Repeat size={15} color="#059669" />
                        <div>
                          <div style={{ fontWeight: 800 }}>#{plan.planId}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>
                            Since {new Date(plan.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{plan.customerName}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{plan.customerPhone}</div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#475569',
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={plan.address}
                      >
                        {plan.address}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {plan.items.map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: '#0F172A',
                            }}
                          >
                            • {item.productName} (x{item.quantity})
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        {getFrequencyLabel(plan.frequency, plan.selectedDays)}
                      </div>
                      <div style={{ fontSize: 11, color: '#059669', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={11} />
                        <span>Morning Delivery</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>₹{plan.totalDailyCost}</div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>per delivery</div>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          isActive ? 'delivered' : isPaused ? 'pending' : 'cancelled'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isActive && (
                          <button
                            className="header-btn"
                            style={{ padding: '5px 10px', fontSize: 11, color: '#D97706' }}
                            disabled={isUpdating === plan.planId}
                            onClick={() => handleToggleStatus(plan, 'PAUSED')}
                            title="Pause subscriptions temporarily"
                          >
                            <PauseCircle size={13} />
                            <span>Pause</span>
                          </button>
                        )}

                        {isPaused && (
                          <button
                            className="header-btn primary"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                            disabled={isUpdating === plan.planId}
                            onClick={() => handleToggleStatus(plan, 'ACTIVE')}
                            title="Resume subscriptions"
                          >
                            <CheckCircle size={13} />
                            <span>Resume</span>
                          </button>
                        )}

                        <button
                          className="header-btn"
                          style={{ padding: '5px 8px', fontSize: 11 }}
                          onClick={() => handleOpenPlanModal(plan)}
                          title="View Plan Details"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="modal-overlay" onClick={handleClosePlanModal}>
          <div
            className="modal-dialog"
            style={{ maxWidth: 540 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Repeat size={18} color="#059669" />
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Plan #{selectedPlan.planId}</h3>
                  <span
                    className={`status-badge ${
                      selectedPlan.status === 'ACTIVE'
                        ? 'delivered'
                        : selectedPlan.status === 'PAUSED'
                        ? 'pending'
                        : 'cancelled'
                    }`}
                  >
                    {selectedPlan.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Created on {new Date(selectedPlan.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="modal-close-btn" onClick={handleClosePlanModal}>
                &times;
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Customer Box */}
              <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                  Customer Details
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={16} color="#059669" />
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{selectedPlan.customerName}</span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                  Phone: {selectedPlan.customerPhone}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 6 }}>
                  <MapPin size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{selectedPlan.address}</span>
                </div>
              </div>

              {/* Products Subscribed */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>
                  Subscribed Dairy Products
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedPlan.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{item.productName}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          ₹{item.unitPrice} per {item.unit}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>x{item.quantity}</div>
                        <div style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                          ₹{item.unitPrice * item.quantity}/day
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Info */}
              <div style={{ padding: 14, background: '#ECFDF5', borderRadius: 12, border: '1px solid #A7F3D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>Delivery Frequency</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#065F46' }}>
                    {getFrequencyLabel(selectedPlan.frequency, selectedPlan.selectedDays)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>Daily Cost Total</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#065F46' }}>
                    ₹{selectedPlan.totalDailyCost}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
                {selectedPlan.status === 'ACTIVE' ? (
                  <button
                    className="header-btn"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', color: '#D97706', borderColor: '#FDE68A' }}
                    onClick={() => {
                      handleToggleStatus(selectedPlan, 'PAUSED');
                      handleClosePlanModal();
                    }}
                  >
                    <PauseCircle size={16} />
                    <span>Pause Plan</span>
                  </button>
                ) : (
                  <button
                    className="header-btn primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                    onClick={() => {
                      handleToggleStatus(selectedPlan, 'ACTIVE');
                      handleClosePlanModal();
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>Resume Plan</span>
                  </button>
                )}

                {selectedPlan.status !== 'CANCELLED' && (
                  <button
                    className="header-btn"
                    style={{ padding: '10px 16px', color: '#EF4444', borderColor: '#FECACA' }}
                    onClick={() => {
                      handleToggleStatus(selectedPlan, 'CANCELLED');
                      handleClosePlanModal();
                    }}
                  >
                    <XCircle size={16} />
                    <span>Cancel Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
