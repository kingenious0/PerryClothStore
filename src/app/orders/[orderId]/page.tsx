'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Loader2, 
  CheckCircle,
  Clock,
  XCircle,
  Home,
  ShoppingBag,
  CreditCard,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusLabel } from '@/types/order';
import type { Order } from '@/types/order';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Status configuration
const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    progress: 25,
    label: 'Order Pending',
    description: 'Your order has been received and is awaiting confirmation'
  },
  confirmed: {
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    progress: 40,
    label: 'Payment Confirmed',
    description: 'Your payment has been confirmed successfully'
  },
  processing: {
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    progress: 60,
    label: 'Processing Order',
    description: 'We are preparing your items for shipment'
  },
  shipped: {
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    progress: 80,
    label: 'Order Shipped',
    description: 'Your order is on its way to you'
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    progress: 100,
    label: 'Delivered',
    description: 'Your order has been delivered successfully'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    progress: 0,
    label: 'Order Cancelled',
    description: 'This order has been cancelled'
  }
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time order updates
  useEffect(() => {
    if (!orderId) return;

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          paidAt: data.paidAt?.toDate(),
          shippedAt: data.shippedAt?.toDate(),
          deliveredAt: data.deliveredAt?.toDate(),
          cancelledAt: data.cancelledAt?.toDate(),
          estimatedDelivery: data.estimatedDelivery?.toDate(),
          actualDelivery: data.actualDelivery?.toDate(),
          timeline: data.timeline?.map((t: any) => ({
            ...t,
            timestamp: t.timestamp?.toDate() || new Date(),
          })) || [],
        } as Order);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching order:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your order...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="text-center py-20">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">Order not found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              This order doesn't exist or you don't have permission to view it
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/orders')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
              <Button onClick={() => router.push('/')}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const normalizedStatus = order.status?.toLowerCase() || 'pending';
  const statusConfig = STATUS_CONFIG[normalizedStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/shop')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Header with Status */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{order.orderNumber}</h1>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <p>
                  Placed on {order.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-2xl p-6 min-w-[280px]`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`${statusConfig.color} bg-white dark:bg-gray-800 rounded-full p-3`}>
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Status</p>
                  <p className={`text-xl font-bold ${statusConfig.color}`}>
                    {statusConfig.label}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {statusConfig.description}
              </p>
              <Progress value={statusConfig.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {statusConfig.progress}% Complete
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Timeline</h2>
                <Badge variant="outline" className="text-xs">
                  Real-time Updates
                </Badge>
              </div>
              <div className="space-y-6">
                {order.timeline.length > 0 ? (
                  order.timeline.map((event, index) => {
                    const eventConfig = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG];
                    const EventIcon = eventConfig?.icon || CheckCircle;
                    
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            index === 0
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            <EventIcon className={`h-6 w-6 ${
                              index === 0 ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                          )}
                        </div>
                        <div className="flex-grow pb-6">
                          <p className="font-bold text-lg mb-1">
                            {getStatusLabel(event.status)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {event.timestamp.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {event.note && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                              {event.note}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2 mt-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No timeline events yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-lg mb-1">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        GH₵{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">GH₵{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">
                    {order.shippingCost === 0 ? 'Free' : `GH₵${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-GH₵{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-purple-600">
                      GH₵{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-base">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.addressLine1}
                </p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.region}
                </p>
                {order.shippingAddress.digitalAddress && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Digital Address: {order.shippingAddress.digitalAddress}
                  </p>
                )}
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    {order.shippingAddress.phoneNumber}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    {order.customerEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method</span>
                  <span className="font-medium">{order.paymentMethod || 'Paystack'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
                    <p className="font-mono text-xs break-all bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
