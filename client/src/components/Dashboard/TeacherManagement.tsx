import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { TeacherCreation } from '@shared/schema';
import { UserPlus, Users, Mail, Phone, Book } from 'lucide-react';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  teacherSubjects: string[];
  teacherQualifications: string;
  isActive: boolean;
  createdAt: Date;
}

interface TeacherManagementProps {
  schoolId: string;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({ schoolId }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    teacherSubjects: [] as string[],
    teacherQualifications: '',
    role: 'teacher' as const,
    schoolId: schoolId,
  });

  // Common subjects for easy selection
  const availableSubjects = [
    'Mathematics', 'English Language Arts', 'Science', 'Social Studies',
    'History', 'Geography', 'Biology', 'Chemistry', 'Physics',
    'Physical Education', 'Art', 'Music', 'Computer Science',
    'Foreign Languages', 'Health Education', 'Special Education'
  ];

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      teacherSubjects: prev.teacherSubjects.includes(subject)
        ? prev.teacherSubjects.filter(s => s !== subject)
        : [...prev.teacherSubjects, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || 
        !formData.teacherQualifications || formData.teacherSubjects.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // In a real application, this would call the API to create the teacher
      // For now, we'll simulate the creation
      const newTeacher: Teacher = {
        id: `TEACHER_${Date.now()}`,
        ...formData,
        isActive: true,
        createdAt: new Date(),
      };
      
      setTeachers(prev => [...prev, newTeacher]);
      
      toast({
        title: "Teacher Created Successfully",
        description: `${formData.firstName} ${formData.lastName} has been added as a teacher`,
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        teacherSubjects: [],
        teacherQualifications: '',
        role: 'teacher' as const,
        schoolId: schoolId,
      });
      
      setShowCreateDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create teacher account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
      teacherSubjects: [],
      teacherQualifications: '',
      role: 'teacher' as const,
      schoolId: schoolId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Teacher Account</DialogTitle>
            </DialogHeader>
            
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
                    placeholder="teacher@school.edu"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID *
                  </Label>
                  <Input
                    id="employeeId"
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="EMP001"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Subjects * (Select at least one)
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {availableSubjects.map(subject => (
                      <div key={subject} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={subject}
                          checked={formData.teacherSubjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={subject} className="text-sm text-gray-700">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="teacherQualifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications *
                  </Label>
                  <Input
                    id="teacherQualifications"
                    type="text"
                    value={formData.teacherQualifications}
                    onChange={(e) => handleInputChange('teacherQualifications', e.target.value)}
                    placeholder="Bachelor's in Education, Master's in Mathematics"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowCreateDialog(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Create Teacher Account
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers List */}
      <div className="grid gap-4">
        {teachers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Yet</h3>
              <p className="text-gray-600 mb-4">Start by creating teacher accounts for your school.</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-primary hover:bg-primary/90 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Teacher
              </Button>
            </CardContent>
          </Card>
        ) : (
          teachers.map(teacher => (
            <Card key={teacher.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center">
                          <Badge variant="secondary">ID: {teacher.employeeId}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex flex-wrap gap-1 justify-end mb-2">
                      {teacher.teacherSubjects.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {teacher.teacherSubjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.teacherSubjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Book className="w-3 h-3 mr-1" />
                      {teacher.teacherQualifications}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};