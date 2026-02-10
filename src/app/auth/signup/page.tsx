'use client';

// Premium Sign Up Page

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      displayName: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);

      // Check if username is already taken
      const usernameRef = doc(db, 'usernames', data.username.toLowerCase());
      const usernameDoc = await getDoc(usernameRef);

      if (usernameDoc.exists()) {
        throw new Error('Username is already taken');
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        emailVerified: false,
        phoneVerified: false,
        authProviders: ['email'],
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          newsletter: false,
          smsNotifications: false,
          emailNotifications: true,
          pushNotifications: false,
        },
        totalOrders: 0,
        totalSpent: 0,
      });

      // Reserve username
      await setDoc(usernameRef, {
        userId: userCredential.user.uid,
        email: data.email,
        createdAt: new Date(),
      });

      toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
      });

      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Perry Store today
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  className="pl-10"
                  {...form.register('username')}
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="displayName">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  {...form.register('displayName')}
                />
              </div>
              {form.formState.errors.displayName && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.displayName.message}
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
                  placeholder="Create a strong password"
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

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  {...form.register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={form.watch('agreeToTerms')}
                onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link href="/legal/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {form.formState.errors.agreeToTerms && (
              <p className="text-sm text-red-500">
                {form.formState.errors.agreeToTerms.message}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              Sign in
            </Link>
          </div>

          {/* Phone Sign Up Link */}
          <div className="mt-4 text-center">
            <Link
              href="/auth/phone"
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Sign up with phone number →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
