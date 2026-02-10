'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCcw, HelpCircle, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const reference = searchParams.get('reference');
  const message = searchParams.get('message') || 'Payment was not completed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl w-full">
        {/* Failure Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -mt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          {/* Failure Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-orange-600 mb-6">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          {/* Error Details */}
          {reference && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 mb-8 border border-red-200 dark:border-red-800">
              <h2 className="text-lg font-bold mb-2 text-red-900 dark:text-red-200">
                Transaction Reference
              </h2>
              <p className="font-mono text-sm text-red-700 dark:text-red-300">
                {reference}
              </p>
            </div>
          )}

          {/* Common Reasons */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Common reasons for payment failure:</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Insufficient funds in your account
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Incorrect card details or expired card
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Payment was cancelled or timed out
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Network connectivity issues
                </p>
              </div>
            </div>
          </div>

          {/* What to Do */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">What you can do:</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <RefreshCcw className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Try Again</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Double-check your payment details and try again
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Use Different Payment Method</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Try using a different card or mobile money
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If the problem persists, reach out to our support team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => router.push('/checkout')}
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => router.push('/shop')}
            >
              Back to Shop
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Need help?
            </p>
            <Link
              href="/contact"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Reassurance */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            💡 Don't worry - your cart items are still saved
          </p>
        </div>
      </div>
    </div>
  );
}
