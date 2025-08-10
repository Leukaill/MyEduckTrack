import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface UserContextType {
  user: User | null;
  isOnline: boolean;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  getDisplayName: () => string;
  getInitials: () => string;
}

interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const defaultPreferences: UserPreferences = {
  notifications: true,
  darkMode: false,
  language: 'en',
  emailNotifications: true,
  pushNotifications: true,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Load user preferences from localStorage
    if (user) {
      const savedPrefs = localStorage.getItem(`eductrack_prefs_${user.id}`);
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setPreferences({ ...defaultPreferences, ...parsed });
        } catch (error) {
          console.error('Error loading user preferences:', error);
        }
      }
    }
  }, [user]);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    if (user) {
      localStorage.setItem(`eductrack_prefs_${user.id}`, JSON.stringify(updated));
    }
  };

  const getDisplayName = (): string => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    return user.email;
  };

  const getInitials = (): string => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    
    return user.email.substring(0, 2).toUpperCase();
  };

  const value: UserContextType = {
    user,
    isOnline,
    preferences,
    updatePreferences,
    getDisplayName,
    getInitials,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
