// OTP Utilities for Phone Verification

import { db } from '@/firebase/config';
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import type { OTPCode } from '@/types/user';

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP code in Firestore
 */
export async function storeOTP(phoneNumber: string, code: string): Promise<void> {
  const otpData: Omit<OTPCode, 'phoneNumber'> = {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    verified: false,
    attempts: 0,
    createdAt: new Date(),
  };

  await setDoc(doc(db, 'otpCodes', phoneNumber), otpData);
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  phoneNumber: string,
  code: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const otpDoc = await getDoc(doc(db, 'otpCodes', phoneNumber));

    if (!otpDoc.exists()) {
      return { valid: false, error: 'OTP not found or expired' };
    }

    const otpData = otpDoc.data() as Omit<OTPCode, 'phoneNumber'>;

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt.toDate()) {
      await deleteDoc(doc(db, 'otpCodes', phoneNumber));
      return { valid: false, error: 'OTP has expired' };
    }

    // Check if already verified
    if (otpData.verified) {
      return { valid: false, error: 'OTP already used' };
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      await deleteDoc(doc(db, 'otpCodes', phoneNumber));
      return { valid: false, error: 'Too many failed attempts' };
    }

    // Verify code
    if (otpData.code !== code) {
      // Increment attempts
      await setDoc(
        doc(db, 'otpCodes', phoneNumber),
        { attempts: otpData.attempts + 1 },
        { merge: true }
      );
      return { valid: false, error: 'Invalid OTP code' };
    }

    // Mark as verified
    await setDoc(
      doc(db, 'otpCodes', phoneNumber),
      { verified: true },
      { merge: true }
    );

    return { valid: true };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { valid: false, error: 'Verification failed' };
  }
}

/**
 * Delete OTP code after successful verification
 */
export async function deleteOTP(phoneNumber: string): Promise<void> {
  await deleteDoc(doc(db, 'otpCodes', phoneNumber));
}

/**
 * Format phone number to E.164 format (Ghana)
 * Converts various formats to +233XXXXXXXXX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('233')) {
    // Already in international format without +
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    // Local format (0XXXXXXXXX)
    cleaned = '+233' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    // Missing leading 0 (XXXXXXXXX)
    cleaned = '+233' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    // Add + if missing
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

/**
 * Validate Ghana phone number
 */
export function isValidGhanaPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Ghana phone numbers: +233 followed by 9 digits
  const ghanaPhoneRegex = /^\+233[0-9]{9}$/;
  return ghanaPhoneRegex.test(formatted);
}

/**
 * Mask phone number for display
 * +233XXXXXXXXX -> +233****XXX
 */
export function maskPhoneNumber(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  if (formatted.length < 8) return formatted;
  
  const countryCode = formatted.substring(0, 4); // +233
  const lastDigits = formatted.substring(formatted.length - 3);
  return `${countryCode}****${lastDigits}`;
}
