import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onOTPSent: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onOTPSent }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await sendOTP(email, role as UserRole);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
      onOTPSent();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md">
          <span className="material-icons text-4xl text-primary">school</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">EducTrack</h1>
        <p className="text-blue-100">School Management System</p>
      </div>

      {/* Login Form */}
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Sign In
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-3 text-gray-400">
                  email
                </span>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-role"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1"
              data-testid="button-send-otp"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
