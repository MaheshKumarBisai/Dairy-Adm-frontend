export interface BackendConnectionStatus {
  targetUrl: string;
  isOnline: boolean;
  latencyMs: number;
  lastCheckedAt: string;
  merchantStoreId: string;
  system: {
    customerAppApi: boolean;
    deliveryAppApi: boolean;
    database: boolean;
  };
}

export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Product {
  productId: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  quantityValue: number;
  imageId?: string | null;
  imageUrl?: string | null;
  images: string[];
  subscriptionAllowed: boolean;
  availableSchedules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  inventory?: {
    availableQuantity: number;
    stockStatus: string;
  };
}

export interface DeliveryPartnerProfile {
  deliveryPartnerId: string;
  name: string;
  phone: string | null;
  email: string;
  vehicleType: string | null;
  vehicleNumber: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationAt: string | null;
  isAvailable: boolean;
  rating: number;
}

export interface ProgressTimelineStep {
  step: 'ORDER_PLACED' | 'ACCEPTED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  label: string;
  completed: boolean;
  timestamp: string | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  imageUrl: string | null;
  images: string[];
}

export interface Order {
  orderId: string;
  merchantId: string;
  customer: {
    name: string;
    phone: string | null;
    email: string;
  };
  address: string;
  status: string;
  deliveryStatus: 'AVAILABLE' | 'ASSIGNED' | 'ACCEPTED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  total: number;
  subtotal: number;
  discount: number;
  deliverySlot: string;
  deliveryDate: string;
  createdAt: string;
  items: OrderItem[];
  deliveryPartner: DeliveryPartnerProfile | null;
  progressTimeline: ProgressTimelineStep[];
}

export interface DairyPlanItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  imageUrl: string | null;
}

export interface DairyPlan {
  planId: string;
  merchantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  frequency: 'DAILY' | 'SELECTED_DAYS' | 'WEEKLY' | 'MONTHLY';
  selectedDays: number[];
  startDate: string;
  endDate: string | null;
  createdAt: string;
  items: DairyPlanItem[];
  totalDailyCost: number;
  actionsCount?: number;
}

export interface DashboardStats {
  productsCount: number;
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  partnersCount: number;
  plansCount?: number;
  activePlansCount?: number;
  backendStatus: BackendConnectionStatus;
}
