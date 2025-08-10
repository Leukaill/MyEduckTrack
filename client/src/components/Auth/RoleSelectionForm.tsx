import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Heart } from 'lucide-react';

interface RoleSelectionFormProps {
  onRoleSelect: (role: 'admin' | 'parent') => void;
  onBackToLogin: () => void;
}

export const RoleSelectionForm: React.FC<RoleSelectionFormProps> = ({ onRoleSelect, onBackToLogin }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="EducTrack Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Join EducTrack</h1>
        <p className="text-blue-100">Select your role to get started</p>
      </div>

      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Choose Your Role
          </h2>
          
          <div className="space-y-4">
            {/* Admin Option */}
            <div 
              onClick={() => onRoleSelect('admin')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">School Administrator</h3>
                  <p className="text-sm text-gray-600">
                    Set up your school, manage teachers, and oversee all operations
                  </p>
                  <div className="text-xs text-primary mt-2 font-medium">
                    • Create teacher accounts
                    • Manage school settings
                    • Full administrative access
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Option */}
            <div 
              onClick={() => onRoleSelect('parent')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Parent/Guardian</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your child's progress and communicate with teachers
                  </p>
                  <div className="text-xs text-primary mt-2 font-medium">
                    • Track student progress
                    • Communicate with teachers
                    • View schedules and events
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Note */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-amber-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">For Teachers</h4>
                  <p className="text-xs text-amber-700">
                    Teacher accounts are created by school administrators. Contact your school admin to get your account set up.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-600 text-sm mb-3">
              Already have an account?
            </p>
            <Button
              type="button"
              variant="link"
              onClick={onBackToLogin}
              className="text-primary font-medium text-sm"
            >
              Sign In Instead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};