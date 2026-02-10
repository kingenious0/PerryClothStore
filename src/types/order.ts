// Order Types

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
  sku?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  digitalAddress?: string; // Ghana Digital Address
  deliveryInstructions?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // Human-readable order number (e.g., ORD-20260202-001)
  userId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  currency: 'GHS';
  
  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Shipping
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  
  // Timeline
  timeline: OrderTimeline[];
  
  // Payment
  paymentMethod: string;
  paymentReference?: string;
  transactionId?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  
  // Additional
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface OrderSummary {
  orderNumber: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  createdAt: Date;
}

export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  userId?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

// Helper function to generate order number
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// Helper function to get status color
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    placed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    out_for_delivery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colors[status];
}

// Helper function to get status label
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    placed: 'Order Placed',
    confirmed: 'Payment Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return labels[status];
}
