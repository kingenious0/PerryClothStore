'use client';

// Premium Sign In Page

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, Chrome, Facebook, ArrowLeft } from 'lucide-react';

const signInSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);

      // Check if identifier is email or username
      const isEmail = data.identifier.includes('@');
      let email = data.identifier;

      if (!isEmail) {
        // Look up email by username
        const usernamesRef = doc(db, 'usernames', data.identifier.toLowerCase());
        const usernameDoc = await getDoc(usernamesRef);

        if (!usernameDoc.exists()) {
          throw new Error('Invalid username or password');
        }

        email = usernameDoc.data().email;
      }

      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, data.password);

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      router.push('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create/update user in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          authProviders: ['google'],
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      toast({
        title: 'Welcome!',
        description: 'Signed in with Google successfully.',
      });

      router.push('/');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Failed to sign in with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create/update user in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          authProviders: ['facebook'],
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      toast({
        title: 'Welcome!',
        description: 'Signed in with Facebook successfully.',
      });

      router.push('/');
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Failed to sign in with Facebook.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Card with glassmorphism effect */}
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your Perry Store account
            </p>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleFacebookSignIn}
              disabled={isLoading}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Continue with Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">
              or
            </span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Email or Username</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  className="pl-10"
                  {...form.register('identifier')}
                />
              </div>
              {form.formState.errors.identifier && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link
              href="/auth/signup"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              Sign up
            </Link>
          </div>

          {/* Phone Sign In Link */}
          <div className="mt-4 text-center">
            <Link
              href="/auth/phone"
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Sign in with phone number →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our{' '}
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
