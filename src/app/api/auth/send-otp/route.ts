// API Route: Send OTP

import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, formatPhoneNumber, isValidGhanaPhone } from '@/lib/otp';
import { sendOTPSMS } from '@/lib/notifications/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!isValidGhanaPhone(formattedPhone)) {
      return NextResponse.json(
        { error: 'Invalid Ghana phone number' },
        { status: 400 }
      );
    }

    // Generate OTP
    const code = generateOTP();

    // Store OTP in Firestore
    await storeOTP(formattedPhone, code);

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(formattedPhone, code);

    if (!smsResult.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: formattedPhone,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
