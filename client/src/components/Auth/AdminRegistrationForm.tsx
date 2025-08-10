import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { AdminRegistration } from '@shared/schema';

interface AdminRegistrationFormProps {
  onOTPSent: (data: AdminRegistration) => void;
  onBackToRoleSelection: () => void;
}

export const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ onOTPSent, onBackToRoleSelection }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin' as const,
    schoolName: '',
    schoolAddress: '',
    schoolPhone: '',
    adminTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['email', 'firstName', 'lastName', 'schoolName', 'schoolAddress', 'schoolPhone', 'adminTitle'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Generate a unique school ID based on school name
      const schoolId = `SCH_${formData.schoolName.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`;
      const adminData = { ...formData, schoolId };
      
      // In a real application, this would call the API
      toast({
        title: "Registration Started",
        description: "Please check your email for the verification code",
      });
      onOTPSent(adminData);
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
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="EducTrack Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Registration</h1>
        <p className="text-blue-100">Set up your school on EducTrack</p>
      </div>

      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@school.edu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adminTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Administrative Title *
                </Label>
                <Select value={formData.adminTitle} onValueChange={(value) => handleInputChange('adminTitle', value)}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select your title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="vice_principal">Vice Principal</SelectItem>
                    <SelectItem value="dean">Dean</SelectItem>
                    <SelectItem value="head_of_school">Head of School</SelectItem>
                    <SelectItem value="superintendent">Superintendent</SelectItem>
                    <SelectItem value="academic_director">Academic Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* School Information */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
              
              <div>
                <Label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </Label>
                <Input
                  id="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  placeholder="Lincoln Elementary School"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  School Address *
                </Label>
                <Input
                  id="schoolAddress"
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                  placeholder="123 Education St, Learning City, LC 12345"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  School Phone *
                </Label>
                <Input
                  id="schoolPhone"
                  type="tel"
                  value={formData.schoolPhone}
                  onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBackToRoleSelection}
                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-white py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Create Admin Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};