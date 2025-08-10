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

  const sendOTP = async (email: string, role: UserRole, additionalData?: Partial<User>): Promise<void> => {
    try {
      // Call backend to send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  };

  const login = async (email: string, role: UserRole): Promise<void> => {
    await sendOTP(email, role);
  };

  const verifyOTP = async (email: string, otp: string): Promise<void> => {
    try {
      // Call backend to verify OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // If user exists, set them as logged in
      if (result.user) {
        setUser(result.user);
      }
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
