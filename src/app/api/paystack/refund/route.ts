// API Route: Initiate Refund

import { NextRequest, NextResponse } from 'next/server';
import { initiateRefund, ghsToPesewas } from '@/lib/paystack';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, amount, reason, merchantNote } = body;

    // Validate required fields
    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get transaction from Firestore
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transaction = transactionDoc.data();

    // Check if transaction is eligible for refund
    if (transaction.status !== 'success') {
      return NextResponse.json(
        { error: 'Only successful transactions can be refunded' },
        { status: 400 }
      );
    }

    if (transaction.status === 'refunded') {
      return NextResponse.json(
        { error: 'Transaction already refunded' },
        { status: 400 }
      );
    }

    // Get Paystack transaction ID from response
    const paystackTransactionId = transaction.paystackResponse?.id?.toString();

    if (!paystackTransactionId) {
      return NextResponse.json(
        { error: 'Paystack transaction ID not found' },
        { status: 400 }
      );
    }

    // Initiate refund with Paystack
    const refundData = await initiateRefund({
      transactionId: paystackTransactionId,
      amount: amount ? ghsToPesewas(amount) : undefined, // Optional partial refund
      reason,
      merchantNote,
    });

    if (!refundData.status) {
      return NextResponse.json(
        { error: refundData.message || 'Refund failed' },
        { status: 400 }
      );
    }

    // Update transaction in Firestore
    await updateDoc(transactionRef, {
      status: 'refunded',
      refundedAt: new Date(),
      refundAmount: amount || transaction.amount,
      refundReason: reason,
      refundData: refundData.data,
      updatedAt: new Date(),
    });

    // Update order status
    const orderRef = doc(db, 'orders', transaction.orderId);
    await updateDoc(orderRef, {
      status: 'refunded',
      paymentStatus: 'refunded',
      refundedAt: new Date(),
      updatedAt: new Date(),
    });

    // TODO: Send refund notification to customer

    return NextResponse.json({
      success: true,
      message: 'Refund initiated successfully',
      data: refundData.data,
    });
  } catch (error: any) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate refund' },
      { status: 500 }
    );
  }
}
