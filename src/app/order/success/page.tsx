'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  const reference = searchParams.get('reference');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Trigger confetti-like animation with CSS
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Verify payment if reference is provided
    if (reference) {
      verifyPayment();
    } else {
      setIsLoading(false);
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/paystack/verify?reference=${reference}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrderData(data);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 -mt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Thank you for your order! 🎉
            </p>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                  <span className="font-bold">{orderData.orderNumber || orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    GH₵{((orderData.amount || 0) / 100).toFixed(2)}
                  </span>
                </div>
                {reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                    <span className="font-mono text-sm">{reference}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Confirmation Email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent a confirmation email with your order details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We're preparing your items for shipment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Delivery Updates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll receive SMS updates about your delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 rounded-xl"
              onClick={() => router.push('/orders')}
            >
              <Package className="mr-2 h-5 w-5" />
              View Order Details
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => router.push('/shop')}
            >
              Continue Shopping
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Need help with your order?
            </p>
            <Link
              href="/contact"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🔒 Your payment was processed securely by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full space-y-6">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
