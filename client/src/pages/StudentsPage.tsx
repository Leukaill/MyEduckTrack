import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useStudents } from '@/hooks/useStudents';
import { getGradePercentage, getGradeLevel } from '@/utils/dateHelpers';

interface StudentsPageProps {
  onNavigate: (page: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onNavigate }) => {
  const { students, loading, error } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');

  const subjects = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
  ];

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeBadgeClass = (level: string) => {
    switch (level) {
      case 'excellent': return 'grade-excellent';
      case 'good': return 'grade-good';
      case 'average': return 'grade-average';
      default: return 'grade-below';
    }
  };

  const getStudentInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRandomGrade = () => {
    const grades = [92, 87, 78, 65, 94, 82, 76, 89];
    return grades[Math.floor(Math.random() * grades.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <span className="material-icons text-4xl text-error mb-4">error</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Students</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 backdrop-blur-lg bg-white/95">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Students & Grades</h1>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="button-filters"
            >
              <span className="material-icons">filter_list</span>
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <span className="material-icons absolute left-3 top-3 text-gray-400">search</span>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
              placeholder="Search students..."
              data-testid="input-search-students"
            />
          </div>
          
          {/* Subject Tabs */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedSubject === subject.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                data-testid={`tab-${subject.id}`}
              >
                {subject.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="px-4 py-6 space-y-4">
        {filteredStudents.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-sm">
            <CardContent className="py-12 text-center">
              <span className="material-icons text-4xl text-gray-400 mb-4">school</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No students are currently enrolled in this class.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => {
            const grade = getRandomGrade(); // In real app, fetch actual grades
            const gradeLevel = getGradeLevel(grade);
            const initials = getStudentInitials(student.firstName, student.lastName);
            const gradeBadgeClass = getGradeBadgeClass(gradeLevel);
            
            return (
              <Card 
                key={student.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                data-testid={`student-card-${student.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium" data-testid={`text-initials-${student.id}`}>
                          {initials}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900" data-testid={`text-name-${student.id}`}>
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600" data-testid={`text-student-id-${student.id}`}>
                          Student ID: #{student.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900" data-testid={`text-grade-${student.id}`}>
                        {grade}%
                      </div>
                      <div className={`px-3 py-1 ${gradeBadgeClass} rounded-full text-xs font-medium`}>
                        {gradeLevel === 'excellent' ? 'Excellent' : 
                         gradeLevel === 'good' ? 'Good' : 
                         gradeLevel === 'average' ? 'Average' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">8/10</div>
                        <div className="text-xs text-gray-600">Assignments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">95%</div>
                        <div className="text-xs text-gray-600">Attendance</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        data-testid={`button-add-grade-${student.id}`}
                      >
                        <span className="material-icons text-sm">add</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        data-testid={`button-view-details-${student.id}`}
                      >
                        <span className="material-icons text-sm">info</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('messages')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        data-testid={`button-message-parent-${student.id}`}
                      >
                        <span className="material-icons text-sm">message</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center"
        data-testid="button-add-new-grade"
      >
        <span className="material-icons">add</span>
      </Button>
    </div>
  );
};
