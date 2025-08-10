import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ParentRegistration } from '@shared/schema';

interface ParentRegistrationFormProps {
  onOTPSent: (data: ParentRegistration) => void;
  onBackToRoleSelection: () => void;
}

export const ParentRegistrationForm: React.FC<ParentRegistrationFormProps> = ({ onOTPSent, onBackToRoleSelection }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'parent' as const,
    schoolId: '',
    parentPhone: '',
    parentOccupation: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    relationshipToStudent: '' as 'father' | 'mother' | 'guardian' | '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['email', 'firstName', 'lastName', 'schoolId', 'parentPhone', 'parentOccupation', 'emergencyContact', 'emergencyContactPhone', 'relationshipToStudent'];
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
      
      // In a real application, this would call the API
      toast({
        title: "Registration Started",
        description: "Please check your email for the verification code",
      });
      onOTPSent(formData as ParentRegistration);
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
        <h1 className="text-3xl font-bold text-white mb-2">Parent Registration</h1>
        <p className="text-blue-100">Join your child's educational journey</p>
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
                  placeholder="parent@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="relationshipToStudent" className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship to Student *
                </Label>
                <Select value={formData.relationshipToStudent} onValueChange={(value) => handleInputChange('relationshipToStudent', value)}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div>
                <Label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="parentOccupation" className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation *
                </Label>
                <Input
                  id="parentOccupation"
                  type="text"
                  value={formData.parentOccupation}
                  onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              
              <div>
                <Label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name *
                </Label>
                <Input
                  id="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone *
                </Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="(555) 987-6543"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
                  School ID *
                </Label>
                <Input
                  id="schoolId"
                  type="text"
                  value={formData.schoolId}
                  onChange={(e) => handleInputChange('schoolId', e.target.value)}
                  placeholder="Enter the school ID provided by your school"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This ID is provided by your school's administration
                </p>
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
                Create Parent Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};