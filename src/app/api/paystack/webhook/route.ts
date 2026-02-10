// API Route: Paystack Webhook Handler

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/paystack';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import type { PaymentWebhookEvent } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the event
    const event: PaymentWebhookEvent = JSON.parse(body);

    console.log('Paystack webhook event:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data);
        break;

      case 'transfer.success':
        // Handle refund success
        console.log('Transfer success:', event.data);
        break;

      case 'transfer.failed':
        // Handle refund failure
        console.log('Transfer failed:', event.data);
        break;

      default:
        console.log('Unhandled event type:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;

    // Find transaction in Firestore
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('reference', '==', reference));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('Transaction not found for reference:', reference);
      return;
    }

    const transactionDoc = querySnapshot.docs[0];
    const transactionId = transactionDoc.id;
    const transactionData = transactionDoc.data();

    // Update transaction
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: 'success',
      channel: data.channel,
      paidAt: new Date(data.paid_at),
      paystackResponse: data,
      updatedAt: new Date(),
    });

    // Update order
    const orderId = data.metadata.orderId;
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus: 'paid',
      status: 'confirmed',
      paidAt: new Date(data.paid_at),
      updatedAt: new Date(),
      timeline: [
        ...(transactionData.timeline || []),
        {
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Payment confirmed via Paystack',
        },
      ],
    });

    // TODO: Send confirmation notifications
    console.log('Payment confirmed for order:', orderId);
  } catch (error) {
    console.error('Error handling charge success:', error);
  }
}

async function handleChargeFailed(data: any) {
  try {
    const reference = data.reference;

    // Find transaction in Firestore
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('reference', '==', reference));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('Transaction not found for reference:', reference);
      return;
    }

    const transactionDoc = querySnapshot.docs[0];
    const transactionId = transactionDoc.id;

    // Update transaction
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: 'failed',
      paystackResponse: data,
      updatedAt: new Date(),
    });

    // Update order
    const orderId = data.metadata.orderId;
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus: 'failed',
      status: 'cancelled',
      updatedAt: new Date(),
    });

    // TODO: Send failure notification
    console.log('Payment failed for order:', orderId);
  } catch (error) {
    console.error('Error handling charge failed:', error);
  }
}
