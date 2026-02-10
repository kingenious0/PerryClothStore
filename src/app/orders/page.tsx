'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Package, Loader2, ShoppingBag, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusLabel } from '@/types/order';
import type { Order } from '@/types/order';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedOrders.push({
          id: doc.id,
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
      });
      
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center max-w-md mx-auto">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your order history
          </p>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/shop')}
          >
            Continue Shopping
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            When you place orders, they'll appear here
          </p>
          <Button onClick={() => router.push('/shop')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          Home
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/shop')}
        >
          Continue Shopping
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on {order.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-purple-600">
                      GH₵{order.total.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × GH₵{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold">
                      GH₵{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    +{order.items.length - 3} more item(s)
                  </p>
                )}
              </div>
            </div>

            {/* Order Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {order.items.length} item(s) • {order.shippingMethod}
              </div>
              <Link
                href={`/orders/${order.id}`}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Track Order →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
