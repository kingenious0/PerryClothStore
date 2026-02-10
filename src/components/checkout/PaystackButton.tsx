'use client';

// Paystack Payment Button Component

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface PaystackButtonProps {
  orderId: string;
  userId: string;
  email: string;
  amount: number;
  customerName: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function PaystackButton({
  orderId,
  userId,
  email,
  amount,
  customerName,
  items,
  onSuccess,
  onError,
  className,
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Initialize payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          userId,
          email,
          amount,
          customerName,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive',
      });
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay GH₵ {amount.toFixed(2)}
        </>
      )}
    </Button>
  );
}
