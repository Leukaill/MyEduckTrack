import React, { useState } from 'react';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { OTPVerification } from '@/components/Auth/OTPVerification';

type AuthView = 'login' | 'register' | 'otp';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const handleOTPSent = () => {
    setCurrentView('otp');
  };

  const handleBackToAuth = () => {
    setCurrentView('login');
  };

  const handleGoToRegister = () => {
    setCurrentView('register');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      {currentView === 'otp' ? (
        <OTPVerification onBack={handleBackToAuth} />
      ) : currentView === 'register' ? (
        <RegisterForm 
          onOTPSent={handleOTPSent} 
          onBackToLogin={handleBackToLogin}
        />
      ) : (
        <LoginForm 
          onOTPSent={handleOTPSent} 
          onGoToRegister={handleGoToRegister}
        />
      )}
    </div>
  );
};
