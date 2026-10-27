import React, { useState, useEffect, useCallback } from 'react';
import { FloatingMenuCard } from './components/FloatingMenuCard';
import { AppNotification } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { OrdersPage } from './pages/Orders';
import { DairyPlansPage } from './pages/DairyPlans';
import { ProductsPage } from './pages/Products';
import { ProductModal } from './components/ProductModal';
import { DeliveryTrackerModal } from './components/DeliveryTrackerModal';
import { api } from './services/api';
import { soundService } from './services/sound';
import { Product, Order, Category, DashboardStats, DairyPlan } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'plans' | 'products'>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<DairyPlan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Notifications & Ringing Bell state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Modals & Tracking
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const isDetailsModalOpen = Boolean(selectedOrder || isProductModalOpen || isPlanModalOpen);

  // Fetch initial data
  const loadData = useCallback(async () => {
    try {
      const [statsData, ordersData, plansData, productsData, categoriesData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getOrders().catch(() => []),
        api.getPlans().catch(() => []),
        api.getProducts().catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
      }
      setOrders(ordersData);
      setPlans(plansData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Connect to SSE Event Stream for automatic live order and delivery updates
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectEvents = () => {
      eventSource = new EventSource('/api/admin/events');

      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);

          if (payload.type === 'NEW_ORDER') {
            const newOrder = payload.data.order;
            // Play notification chime
            soundService.playNewOrderSound();

            // Create notification item
            const notif: AppNotification = {
              id: `notif-${Date.now()}-${Math.random()}`,
              orderId: payload.data.orderId,
              type: 'NEW_ORDER',
              title: `New Order #${payload.data.orderId}`,
              message: `${payload.data.customerName} ordered ${payload.data.items?.join(', ')} (₹${payload.data.total})`,
              timestamp: new Date().toISOString(),
              read: false,
            };

            // Increment unread count -> triggers ringing bell animation!
            setNotifications((prev) => [notif, ...prev.slice(0, 24)]);
            setUnreadCount((c) => c + 1);

            // Update live orders state
            if (newOrder) {
              setOrders((prev) => [newOrder, ...prev.filter((o) => o.orderId !== newOrder.orderId)]);
            }
            api.getStats().then((s) => setStats(s)).catch(() => {});
          } else if (payload.type === 'DELIVERY_ACCEPTED') {
            soundService.playDeliveryAcceptedSound();

            const notif: AppNotification = {
              id: `notif-${Date.now()}-${Math.random()}`,
              orderId: payload.data.orderId,
              type: 'DELIVERY_ACCEPTED',
              title: `Rider Accepted Order #${payload.data.orderId}`,
              message: `${payload.data.deliveryPartner?.name || 'Partner'} claimed delivery. Track live progress now.`,
              timestamp: new Date().toISOString(),
              read: false,
            };

            setNotifications((prev) => [notif, ...prev.slice(0, 24)]);
            setUnreadCount((c) => c + 1);

            if (payload.data.order) {
              setOrders((prev) =>
                prev.map((o) => (o.orderId === payload.data.orderId ? payload.data.order : o)),
              );
              if (selectedOrder && selectedOrder.orderId === payload.data.orderId) {
                setSelectedOrder(payload.data.order);
              }
            }
          } else if (payload.type === 'DELIVERY_STATUS_UPDATED') {
            if (payload.data.order) {
              setOrders((prev) =>
                prev.map((o) => (o.orderId === payload.data.orderId ? payload.data.order : o)),
              );
              if (selectedOrder && selectedOrder.orderId === payload.data.orderId) {
                setSelectedOrder(payload.data.order);
              }
            }
          }
        } catch {
          // Ignore heartbeat or parse errors
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        setTimeout(connectEvents, 4000);
      };
    };

    connectEvents();

    return () => {
      eventSource?.close();
    };
  }, [selectedOrder]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.soundEnabled = next;
  };

  // Mark all notifications as read -> immediately stops ringing animation!
  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Select an order from notification popover
  const handleSelectNotificationOrder = (orderId: string) => {
    const ord = orders.find((o) => o.orderId === orderId);
    if (ord) setSelectedOrder(ord);

    // Mark that notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.orderId === orderId ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleUpdatePlanStatus = async (planId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    try {
      const updated = await api.updatePlanStatus(planId, status);
      setPlans((prev) => prev.map((p) => (p.planId === updated.planId ? updated : p)));
      api.getStats().then((s) => setStats(s)).catch(() => {});
    } catch (err) {
      console.error('Failed to update plan status:', err);
    }
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.deliveryStatus === 'AVAILABLE' || o.deliveryStatus === 'ASSIGNED',
  ).length;

  const activePlansCount = plans.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div className="app-container full-width">
      {/* React Bits Unified Floating Menu Card (Hides smoothly when order or product details are open) */}
      <FloatingMenuCard
        hidden={isDetailsModalOpen}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        activePlansCount={activePlansCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenProductModal={() => {
          setEditingProduct(null);
          setIsProductModalOpen(true);
        }}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectNotificationOrder={handleSelectNotificationOrder}
      />

      {/* Main Page Body */}
      <main className="page-body full-width">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            orders={orders}
            onSelectOrder={setSelectedOrder}
            onOpenProductModal={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersPage
            orders={orders}
            onSelectOrder={setSelectedOrder}
          />
        )}

        {activeTab === 'plans' && (
          <DairyPlansPage
            plans={plans}
            onUpdateStatus={handleUpdatePlanStatus}
            onModalToggle={setIsPlanModalOpen}
          />
        )}

        {activeTab === 'products' && (
          <ProductsPage
            products={products}
            categories={categories}
            onOpenCreate={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onOpenEdit={(product) => {
              setEditingProduct(product);
              setIsProductModalOpen(true);
            }}
            onToggleActive={async (product) => {
              const updated = await api.updateProduct(product.productId, {
                isActive: !product.isActive,
              });
              setProducts((prev) =>
                prev.map((p) => (p.productId === updated.productId ? updated : p)),
              );
            }}
          />
        )}
      </main>

      {/* Delivery Partner Profile & Live Progress Tracker Modal */}
      <DeliveryTrackerModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdated={(updated) => {
          setSelectedOrder(updated);
          setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
        }}
      />

      {/* Product Add & Edit Modal with 3-Image Auto-White Background Uploader */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={(product) => {
          setProducts((prev) => {
            const exists = prev.some((p) => p.productId === product.productId);
            if (exists) {
              return prev.map((p) => (p.productId === product.productId ? product : p));
            }
            return [product, ...prev];
          });
          api.getStats().then((s) => setStats(s)).catch(() => {});
        }}
        categories={categories}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default App;
