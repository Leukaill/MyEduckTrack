import { auth, db } from './firebase';
import { User } from '@/types';
import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP temporarily (in production, use a more secure method)
const otpStorage = new Map<string, { otp: string; expiresAt: number; userData: Partial<User> }>();

export const storeOTP = (email: string, otp: string, userData: Partial<User>) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStorage.set(email, { otp, expiresAt, userData });
};

export const verifyOTP = (email: string, inputOTP: string): { isValid: boolean; userData?: Partial<User> } => {
  const stored = otpStorage.get(email);
  
  if (!stored) {
    return { isValid: false };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStorage.delete(email);
    return { isValid: false };
  }
  
  if (stored.otp === inputOTP) {
    otpStorage.delete(email);
    return { isValid: true, userData: stored.userData };
  }
  
  return { isValid: false };
};

export const createOrUpdateUser = async (userData: Partial<User>): Promise<User> => {
  if (!userData.id || !userData.email) {
    throw new Error('User ID and email are required');
  }

  const userRef = doc(db, 'users', userData.id);
  const userDoc = await getDoc(userRef);
  
  const now = serverTimestamp();
  const userInfo: Partial<User> = {
    ...userData,
    updatedAt: now as any,
  };

  if (!userDoc.exists()) {
    userInfo.createdAt = now as any;
  }

  await setDoc(userRef, userInfo, { merge: true });
  
  const updatedDoc = await getDoc(userRef);
  return { id: updatedDoc.id, ...updatedDoc.data() } as User;
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
