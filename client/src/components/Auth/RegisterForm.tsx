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

interface RegisterFormProps {
  onOTPSent: () => void;
  onBackToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOTPSent, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole | '',
    schoolId: 'default_school' // In production, this would be selected from a list
  });
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await sendOTP(formData.email, formData.role as UserRole, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        schoolId: formData.schoolId
      });
      toast({
        title: "Registration Started",
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
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="EducTrack Logo" 
            className="w-16 h-16 object-contain"
            data-testid="img-register-logo"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Join EducTrack</h1>
        <p className="text-blue-100">Create your account</p>
      </div>

      {/* Registration Form */}
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="input-first-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="input-last-name"
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="input-email"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-role"
                >
                  <SelectValue placeholder="Select your role in the school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">School Administrator</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent/Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1"
              data-testid="button-create-account"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Create Account
            </Button>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm mb-3">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={onBackToLogin}
                className="text-primary font-medium text-sm"
                data-testid="button-back-to-login"
              >
                Sign In Instead
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};