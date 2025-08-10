import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, UserRole } from '@/types';
import { 
  generateOTP, 
  storeOTP, 
  verifyOTP as verifyOTPUtil, 
  createOrUpdateUser, 
  getUserProfile,
  signOut as authSignOut,
  onAuthChange
} from '@/lib/auth';
import { sendOTPEmail } from '@/lib/emailjs';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setUser(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendOTP = async (email: string, role: UserRole): Promise<void> => {
    try {
      const otp = generateOTP();
      
      // Create user data
      const userData: Partial<User> = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
        email,
        role,
        firstName: '',
        lastName: '',
        schoolId: 'default_school', // In production, this should be selected
        isActive: true,
      };

      // Store OTP temporarily
      storeOTP(email, otp, userData);

      // Send OTP via email
      await sendOTPEmail(email, otp, role);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  };

  const login = async (email: string, role: UserRole): Promise<void> => {
    await sendOTP(email, role);
  };

  const verifyOTP = async (otp: string): Promise<void> => {
    try {
      // Get stored data (in a real app, you'd pass the email as well)
      const storedEntries = Array.from((window as any).otpStorage?.entries() || []);
      if (storedEntries.length === 0) {
        throw new Error('No OTP found. Please request a new one.');
      }

      const [email] = storedEntries[0] as [string, any];
      const { isValid, userData } = verifyOTPUtil(email, otp);

      if (!isValid) {
        throw new Error('Invalid OTP. Please try again.');
      }

      if (!userData) {
        throw new Error('User data not found.');
      }

      // Create or update user in Firestore
      const createdUser = await createOrUpdateUser(userData);

      // Sign in to Firebase (in production, you'd use a custom token from your backend)
      // For demo purposes, we'll set the user directly
      setUser(createdUser);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    verifyOTP,
    logout,
    sendOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
