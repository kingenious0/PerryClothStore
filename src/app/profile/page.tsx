'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, Lock, Save, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();
          
          setFormData({
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            phoneNumber: userData?.phoneNumber || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        
        setIsLoading(false);
      } else {
        router.push('/auth/signin');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update display name
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.displayName,
        });
      }

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword(user, formData.newPassword);
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password. You may need to re-authenticate.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>

        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage your account information
        </p>

        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50 dark:bg-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0XX XXX XXXX"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={isSaving || !formData.newPassword}
                variant="outline"
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                <span className="font-medium">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Sign In</span>
                <span className="font-medium">
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User ID</span>
                <span className="font-mono text-xs">{user?.uid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
