import { DashboardStats, Product, Category, Order, BackendConnectionStatus } from '../types';

const API_BASE = '/api/admin';

export const api = {
  // Health & Connection
  async getHealth(): Promise<{
    status: string;
    adminBackendPort: number;
    mainBackendConnection: BackendConnectionStatus;
  }> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    const json = await res.json();
    return json.data;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    const json = await res.json();
    return json.data || [];
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    return json.data || [];
  },

  async createProduct(data: {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    unit: string;
    initialStock?: number;
    imageUrl?: string;
    images?: string[];
  }): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create product');
    return json.data;
  },

  async updateProduct(
    productId: string,
    data: {
      name?: string;
      description?: string;
      categoryId?: string;
      price?: number;
      unit?: string;
      stock?: number;
      imageUrl?: string;
      images?: string[];
      isActive?: boolean;
    },
  ): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update product');
    return json.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to deactivate product');
  },

  // 3-Image Upload with Auto-White Background conversion
  async uploadProductImages(files: {
    frontImage?: File;
    backImage?: File;
    detailImage?: File;
  }): Promise<{
    primaryUrl: string;
    images: string[];
    details: any[];
  }> {
    const formData = new FormData();
    if (files.frontImage) formData.append('frontImage', files.frontImage);
    if (files.backImage) formData.append('backImage', files.backImage);
    if (files.detailImage) formData.append('detailImage', files.detailImage);

    const res = await fetch(`${API_BASE}/upload-product-images`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to process images');
    return json.data;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    const json = await res.json();
    return json.data || [];
  },

  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Order not found');
    return json.data;
  },

  // Simulation / Live testing helpers
  async simulateCustomerOrder(): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/simulate-customer-order`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to simulate order');
    return json.data;
  },

  async simulateAcceptOrder(orderId: string, deliveryPartnerId?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/simulate-accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryPartnerId }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to simulate acceptance');
    return json.data;
  },

  async simulateProgress(orderId: string, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/simulate-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update progress');
    return json.data;
  },

  // Dairy Plans / Recurring Subscriptions
  async getPlans(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/plans`);
    const json = await res.json();
    return json.data || [];
  },

  async getPlan(planId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/plans/${planId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Plan not found');
    return json.data;
  },

  async updatePlanStatus(planId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED'): Promise<any> {
    const res = await fetch(`${API_BASE}/plans/${planId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update plan status');
    return json.data;
  },
};
