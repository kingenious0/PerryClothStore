'use client';

// Phone Number Sign In/Sign Up Page with OTP

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, ArrowLeft } from 'lucide-react';
import { formatPhoneNumber, maskPhoneNumber } from '@/lib/otp';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/firebase/config';

export default function PhoneAuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setPhoneNumber(data.phoneNumber); // Use formatted phone number
      setStep('otp');

      toast({
        title: 'OTP Sent!',
        description: `Verification code sent to ${maskPhoneNumber(data.phoneNumber)}`,
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // If new user, redirect to complete profile
      if (data.isNewUser) {
        toast({
          title: 'Phone Verified!',
          description: 'Please complete your profile.',
        });
        router.push(`/auth/complete-profile?phone=${encodeURIComponent(phoneNumber)}`);
      } else {
        // Existing user, sign in
        // Note: You'll need to implement custom token generation on the backend
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully signed in.',
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handleSendOTP(new Event('submit') as any);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -mt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {step === 'phone' ? 'Phone Sign In' : 'Verify OTP'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'phone'
                ? 'Enter your phone number to continue'
                : `Enter the code sent to ${maskPhoneNumber(phoneNumber)}`}
            </p>
          </div>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0XX XXX XXXX"
                    className="pl-10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Ghana phone number
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl tracking-widest font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Code expires in 10 minutes
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Alternative Sign In */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Prefer email? </span>
            <Link
              href="/auth/signin"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              Sign in with email
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/legal/terms" className="text-purple-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy" className="text-purple-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
