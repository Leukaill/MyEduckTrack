import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/contexts/AuthContext';
import { getGradePercentage, getGradeLevel } from '@/utils/dateHelpers';
import { useToast } from '@/hooks/use-toast';

interface StudentsViewProps {
  onBack: () => void;
  onMessageParent: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onBack, onMessageParent }) => {
  const { user } = useAuth();
  const { students, loading, error, addGrade } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({
    assessmentType: '',
    assessmentName: '',
    score: '',
    maxScore: '',
    feedback: '',
  });

  const subjects = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
  ];

  const assessmentTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'project', label: 'Project' },
  ];

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGrade = (studentId: string) => {
    setSelectedStudent(studentId);
    setIsAddGradeOpen(true);
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !user) return;

    try {
      await addGrade({
        studentId: selectedStudent,
        subjectId: selectedSubject,
        assessmentType: gradeForm.assessmentType as any,
        assessmentName: gradeForm.assessmentName,
        score: gradeForm.score,
        maxScore: gradeForm.maxScore,
        feedback: gradeForm.feedback,
      });

      toast({
        title: "Grade Added",
        description: "Grade has been successfully added.",
      });

      setIsAddGradeOpen(false);
      setGradeForm({
        assessmentType: '',
        assessmentName: '',
        score: '',
        maxScore: '',
        feedback: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add grade. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
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

      {/* Students List */}
      <div className="space-y-4">
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
            const grade = getRandomGrade();
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
                        onClick={() => handleAddGrade(student.id)}
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
                        onClick={() => onMessageParent(student.id)}
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

      {/* Add Grade Dialog */}
      <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitGrade} className="space-y-4">
            <div>
              <Label htmlFor="assessmentType">Assessment Type</Label>
              <Select
                value={gradeForm.assessmentType}
                onValueChange={(value) => setGradeForm(prev => ({ ...prev, assessmentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assessmentName">Assessment Name</Label>
              <Input
                id="assessmentName"
                value={gradeForm.assessmentName}
                onChange={(e) => setGradeForm(prev => ({ ...prev, assessmentName: e.target.value }))}
                placeholder="e.g., Unit 1 Quiz"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  type="number"
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, score: e.target.value }))}
                  placeholder="85"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxScore">Max Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  value={gradeForm.maxScore}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, maxScore: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Great work! Keep it up."
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">Add Grade</Button>
              <Button type="button" variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
