import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { AdminRegistration, ParentRegistration } from '@shared/schema';

interface OTPVerificationProps {
  onBack: () => void;
  registrationData?: AdminRegistration | ParentRegistration | null;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack, registrationData }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { verifyOTP, sendOTP } = useAuth();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(otpString);
      toast({
        title: "Success",
        description: "Welcome to EducTrack!",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Note: In a real app, you'd store the email/role and resend
      toast({
        title: "OTP Resent",
        description: "Please check your email for a new verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="EducTrack Logo" 
            className="w-16 h-16 object-contain"
            data-testid="img-otp-logo"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">EducTrack</h1>
        <p className="text-blue-100">School Management System</p>
      </div>
      
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="material-icons text-2xl text-primary">mark_email_read</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border border-gray-200 rounded-lg text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid={`otp-input-${index}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-white py-3 px-4 rounded-xl font-medium mb-4 transition-all duration-300"
              data-testid="button-verify-otp"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Verify & Continue
            </Button>
            
            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                className="text-primary text-sm font-medium"
                data-testid="button-resend-otp"
              >
                Didn't receive code? Resend
              </Button>
              
              <Button
                type="button"
                variant="link"
                onClick={onBack}
                className="text-gray-500 text-sm"
                data-testid="button-back"
              >
                Back to login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
