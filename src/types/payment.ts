// Payment Types for Paystack Integration

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'success' 
  | 'failed' 
  | 'cancelled'
  | 'refunded';

export type PaymentChannel = 
  | 'card' 
  | 'mobile_money' 
  | 'bank_transfer' 
  | 'bank'
  | 'ussd';

export interface PaystackInitializeData {
  email: string;
  amount: number; // in pesewas (GHS * 100)
  currency?: 'GHS';
  reference?: string;
  callback_url?: string;
  metadata?: {
    orderId: string;
    userId: string;
    customerName: string;
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    [key: string]: any;
  };
  channels?: PaymentChannel[];
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: PaymentChannel;
    currency: string;
    ip_address: string;
    metadata: any;
    fees: number;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
  };
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  reference: string;
  amount: number; // in GHS
  currency: 'GHS';
  status: PaymentStatus;
  channel: PaymentChannel;
  paymentGateway: 'paystack';
  metadata: {
    customerEmail: string;
    customerName: string;
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  paystackResponse?: PaystackVerifyResponse['data'];
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Optional: partial refund
  reason: string;
  merchantNote?: string;
}

export interface RefundResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    integration: number;
    domain: string;
    transaction: number;
    dispute: number;
    amount: number;
    currency: string;
    status: string;
    refunded_by: string;
    refunded_at: string;
    expected_at: string;
    settlement: number | null;
    customer_note: string;
    merchant_note: string;
    deducted_amount: number;
    fully_deducted: boolean;
    created_at: string;
  };
}

export interface PaymentWebhookEvent {
  event: 'charge.success' | 'charge.failed' | 'transfer.success' | 'transfer.failed';
  data: PaystackVerifyResponse['data'];
}
