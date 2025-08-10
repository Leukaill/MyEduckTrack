import React, { useState } from 'react';
import { LoginForm } from '@/components/Auth/LoginForm';
import { OTPVerification } from '@/components/Auth/OTPVerification';

export const AuthPage: React.FC = () => {
  const [showOTP, setShowOTP] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      {showOTP ? (
        <OTPVerification onBack={() => setShowOTP(false)} />
      ) : (
        <LoginForm onOTPSent={() => setShowOTP(true)} />
      )}
    </div>
  );
};
