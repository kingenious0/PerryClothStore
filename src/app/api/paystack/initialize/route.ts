// API Route: Initialize Paystack Payment

import { NextRequest, NextResponse } from 'next/server';
import { initializePayment, generatePaymentReference, ghsToPesewas } from '@/lib/paystack';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, userId, email, amount, customerName, items } = body;

    // Validate required fields
    if (!orderId || !userId || !email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = generatePaymentReference(orderId);

    // Initialize payment with Paystack
    const paymentData = await initializePayment({
      email,
      amount: ghsToPesewas(amount), // Convert GHS to pesewas
      reference,
      currency: 'GHS',
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify?reference=${reference}`,
      metadata: {
        orderId,
        userId,
        customerName,
        items,
      },
      channels: ['card', 'mobile_money', 'bank_transfer'],
    });

    // Save transaction to Firestore
    await addDoc(collection(db, 'transactions'), {
      orderId,
      userId,
      reference,
      amount,
      currency: 'GHS',
      status: 'pending',
      paymentGateway: 'paystack',
      metadata: {
        customerEmail: email,
        customerName,
        items,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paymentData.data.authorization_url,
        access_code: paymentData.data.access_code,
        reference: paymentData.data.reference,
      },
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
