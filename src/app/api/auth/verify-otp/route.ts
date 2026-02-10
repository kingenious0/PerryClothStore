// API Route: Verify OTP

import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, deleteOTP, formatPhoneNumber } from '@/lib/otp';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Verify OTP
    const result = await verifyOTP(formattedPhone, code);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if user exists with this phone number
    const usersRef = doc(db, 'users', formattedPhone);
    const userDoc = await getDoc(usersRef);

    let userId = formattedPhone;
    let isNewUser = false;

    if (!userDoc.exists()) {
      // Create new user with phone number
      isNewUser = true;
      await setDoc(usersRef, {
        phoneNumber: formattedPhone,
        phoneVerified: true,
        authProviders: ['phone'],
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          newsletter: false,
          smsNotifications: true,
          emailNotifications: false,
          pushNotifications: false,
        },
      });
    } else {
      // Update existing user
      await setDoc(
        usersRef,
        {
          phoneVerified: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    // Delete OTP after successful verification
    await deleteOTP(formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      userId,
      isNewUser,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
