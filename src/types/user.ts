// User Types

export type UserRole = 'customer' | 'admin';

export type AuthProvider = 'email' | 'phone' | 'google' | 'facebook';

export interface User {
  id: string;
  email: string;
  username: string;
  phoneNumber?: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  authProviders: AuthProvider[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Profile information
  addresses?: Address[];
  defaultAddressId?: string;
  
  // Preferences
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  
  // Stats
  totalOrders?: number;
  totalSpent?: number;
  lifetimeValue?: number;
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Work"
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string; // Ghana region
  digitalAddress?: string; // Ghana Digital Address
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPCode {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

export interface AuthSession {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
}
