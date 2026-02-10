'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    
    if (!reference) {
      // No reference, redirect to failed page
      router.push('/order/failed?message=No payment reference found');
      return;
    }

    // Verify the payment
    verifyPayment(reference);
  }, [searchParams, router]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/paystack/verify?reference=${reference}`);
      const data = await response.json();

      console.log('Verification response:', data);

      if (response.ok && data.success) {
        // Payment successful
        setStatus('success');
        // Redirect to success page with order details
        setTimeout(() => {
          router.push(`/order/success?reference=${reference}&orderId=${data.data?.orderId || ''}`);
        }, 1000);
      } else {
        // Payment failed
        console.error('Payment verification failed:', data);
        setStatus('failed');
        const errorMessage = data.message || data.error || 'Payment verification failed';
        setTimeout(() => {
          router.push(`/order/failed?reference=${reference}&message=${encodeURIComponent(errorMessage)}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setTimeout(() => {
        router.push(`/order/failed?reference=${reference}&message=Payment verification failed`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">
          {status === 'verifying' && 'Verifying your payment...'}
          {status === 'success' && 'Payment verified! ✅'}
          {status === 'failed' && 'Verification failed ❌'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {status === 'verifying' && 'Please wait while we confirm your payment'}
          {status === 'success' && 'Redirecting to order confirmation...'}
          {status === 'failed' && 'Redirecting...'}
        </p>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-md w-full text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
      </div>
    }>
      <PaymentVerifyContent />
    </Suspense>
  );
}
