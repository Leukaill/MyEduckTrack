import React, { useState } from 'react';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RoleSelectionForm } from '@/components/Auth/RoleSelectionForm';
import { AdminRegistrationForm } from '@/components/Auth/AdminRegistrationForm';
import { ParentRegistrationForm } from '@/components/Auth/ParentRegistrationForm';
import { OTPVerification } from '@/components/Auth/OTPVerification';
import { AdminRegistration, ParentRegistration } from '@shared/schema';

type AuthView = 'login' | 'roleSelection' | 'adminRegister' | 'parentRegister' | 'otp';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [registrationData, setRegistrationData] = useState<AdminRegistration | ParentRegistration | null>(null);

  const handleOTPSent = (data: AdminRegistration | ParentRegistration) => {
    setRegistrationData(data);
    setCurrentView('otp');
  };

  const handleBackToAuth = () => {
    setCurrentView('login');
    setRegistrationData(null);
  };

  const handleGoToRegister = () => {
    setCurrentView('roleSelection');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setRegistrationData(null);
  };

  const handleRoleSelect = (role: 'admin' | 'parent') => {
    if (role === 'admin') {
      setCurrentView('adminRegister');
    } else {
      setCurrentView('parentRegister');
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentView('roleSelection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      {currentView === 'otp' ? (
        <OTPVerification 
          onBack={handleBackToAuth}
          registrationData={registrationData}
        />
      ) : currentView === 'adminRegister' ? (
        <AdminRegistrationForm 
          onOTPSent={handleOTPSent} 
          onBackToRoleSelection={handleBackToRoleSelection}
        />
      ) : currentView === 'parentRegister' ? (
        <ParentRegistrationForm 
          onOTPSent={handleOTPSent} 
          onBackToRoleSelection={handleBackToRoleSelection}
        />
      ) : currentView === 'roleSelection' ? (
        <RoleSelectionForm 
          onRoleSelect={handleRoleSelect}
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
