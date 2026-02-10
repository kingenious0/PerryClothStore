// Paystack SDK Wrapper for Ghana Payments

import type {
  PaystackInitializeData,
  PaystackInitializeResponse,
  PaystackVerifyResponse,
  RefundRequest,
  RefundResponse,
} from '@/types/payment';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Initialize a Paystack payment transaction
 */
export async function initializePayment(
  data: PaystackInitializeData
): Promise<PaystackInitializeResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        currency: 'GHS', // Ghana Cedis
        channels: data.channels || ['card', 'mobile_money', 'bank_transfer'],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to initialize payment');
    }

    return result;
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
}

/**
 * Verify a Paystack payment transaction
 */
export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to verify payment');
    }

    return result;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}

/**
 * Initiate a refund for a transaction
 */
export async function initiateRefund(
  request: RefundRequest
): Promise<RefundResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: request.transactionId,
        amount: request.amount, // Optional: in pesewas
        currency: 'GHS',
        customer_note: request.reason,
        merchant_note: request.merchantNote,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to initiate refund');
    }

    return result;
  } catch (error) {
    console.error('Paystack refund error:', error);
    throw error;
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(transactionId: string) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to get transaction');
    }

    return result;
  } catch (error) {
    console.error('Paystack get transaction error:', error);
    throw error;
  }
}

/**
 * List all transactions with optional filters
 */
export async function listTransactions(params?: {
  perPage?: number;
  page?: number;
  customer?: string;
  status?: 'success' | 'failed' | 'abandoned';
  from?: string;
  to?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.customer) queryParams.append('customer', params.customer);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to list transactions');
    }

    return result;
  } catch (error) {
    console.error('Paystack list transactions error:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(orderId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PS-${orderId}-${timestamp}-${random}`;
}

/**
 * Convert GHS to pesewas (Paystack uses pesewas)
 */
export function ghsToPesewas(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert pesewas to GHS
 */
export function pesewasToGhs(amount: number): number {
  return amount / 100;
}

/**
 * Format amount for display
 */
export function formatGHS(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
}
