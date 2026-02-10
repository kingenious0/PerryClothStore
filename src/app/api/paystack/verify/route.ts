// API Route: Verify Paystack Payment

import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    console.log('Verifying payment with reference:', reference);
    const verification = await verifyPayment(reference);
    
    console.log('Paystack verification response:', JSON.stringify(verification, null, 2));

    if (!verification.status) {
      console.error('Verification status is false:', verification);
      return NextResponse.json(
        { 
          error: 'Payment verification failed',
          message: verification.message || 'Unknown error',
          details: verification
        },
        { status: 400 }
      );
    }

    const paymentData = verification.data;

    // Find transaction in Firestore
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('reference', '==', reference));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transactionDoc = querySnapshot.docs[0];
    const transactionId = transactionDoc.id;

    // Update transaction status
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: paymentData.status === 'success' ? 'success' : 'failed',
      channel: paymentData.channel,
      paidAt: paymentData.status === 'success' ? new Date(paymentData.paid_at) : null,
      paystackResponse: paymentData,
      updatedAt: new Date(),
    });

    // If payment successful, update order status
    if (paymentData.status === 'success') {
      const orderId = paymentData.metadata.orderId;
      
      // Get current order to append to timeline
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      const currentOrder = orderSnap.data();
      
      // Determine payment method label
      const paymentMethodLabel = paymentData.channel === 'mobile_money' 
        ? 'Mobile Money' 
        : paymentData.channel === 'bank_transfer'
        ? 'Bank Transfer'
        : paymentData.channel === 'card'
        ? 'Card'
        : paymentData.channel || 'Paystack';
      
      // Create timeline event for payment
      const paymentTimeline = {
        status: 'confirmed',
        timestamp: new Date(paymentData.paid_at),
        note: `Payment confirmed via ${paymentMethodLabel}`,
        location: null,
      };
      
      // Append to existing timeline
      const updatedTimeline = [
        paymentTimeline,
        ...(currentOrder?.timeline || [])
      ];
      
      await updateDoc(orderRef, {
        paymentStatus: 'paid',
        paymentMethod: paymentMethodLabel,
        paymentChannel: paymentData.channel,
        status: 'confirmed',
        paidAt: new Date(paymentData.paid_at),
        timeline: updatedTimeline,
        updatedAt: new Date(),
      });

      // TODO: Send confirmation email/SMS to customer
      // TODO: Send notification to admin
    }

    return NextResponse.json({
      success: true,
      data: {
        status: paymentData.status,
        reference: paymentData.reference,
        amount: paymentData.amount / 100, // Convert pesewas to GHS
        channel: paymentData.channel,
        paidAt: paymentData.paid_at,
        message: paymentData.gateway_response,
        orderId: paymentData.metadata?.orderId,
        orderNumber: paymentData.metadata?.orderNumber,
      },
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
