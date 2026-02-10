// Notification Types

export type NotificationType =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'low_stock'
  | 'out_of_stock'
  | 'customer_inquiry'
  | 'review_posted'
  | 'promotional'
  | 'system';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  channels: NotificationChannel[];
  
  // Metadata
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    productId?: string;
    productName?: string;
    amount?: number;
    [key: string]: any;
  };
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Timestamps
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  
  // Notification types
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  productUpdates: boolean;
  accountActivity: boolean;
}

export interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
}

// Helper function to get notification icon
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    order_placed: '🛍️',
    order_confirmed: '✅',
    order_shipped: '📦',
    order_delivered: '🎉',
    order_cancelled: '❌',
    payment_success: '💳',
    payment_failed: '⚠️',
    low_stock: '📉',
    out_of_stock: '🚫',
    customer_inquiry: '💬',
    review_posted: '⭐',
    promotional: '🎁',
    system: 'ℹ️',
  };
  return icons[type];
}

// Helper function to get notification color
export function getNotificationColor(priority: NotificationPriority): string {
  const colors: Record<NotificationPriority, string> = {
    low: 'bg-gray-100 dark:bg-gray-800',
    medium: 'bg-blue-100 dark:bg-blue-900',
    high: 'bg-yellow-100 dark:bg-yellow-900',
    urgent: 'bg-red-100 dark:bg-red-900',
  };
  return colors[priority];
}
