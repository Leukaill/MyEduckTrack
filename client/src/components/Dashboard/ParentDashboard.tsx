import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/types';
import { useStudents } from '@/hooks/useStudents';
import { useMessages } from '@/hooks/useMessages';
import { useCalendar } from '@/hooks/useCalendar';
import { formatRelativeTime, getGradeLevel } from '@/utils/dateHelpers';

interface ParentDashboardProps {
  stats: DashboardStats;
  onNavigate: (page: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ stats, onNavigate }) => {
  const { students } = useStudents();
  const { conversations } = useMessages();
  const { todayEvents } = useCalendar();

  const recentActivities = [
    {
      id: '1',
      type: 'grade',
      title: 'New grade posted',
      description: 'Mathematics quiz - 92%',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      icon: 'grade',
      color: 'bg-success',
    },
    {
      id: '2',
      type: 'message',
      title: 'Message from Ms. Johnson',
      description: 'Regarding homework assignment',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'message',
      color: 'bg-primary',
    },
    {
      id: '3',
      type: 'event',
      title: 'Parent-Teacher Conference',
      description: 'Scheduled for tomorrow at 3:00 PM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: 'event',
      color: 'bg-warning',
    },
  ];

  const childrenProgress = students.map(student => ({
    ...student,
    recentGrade: Math.floor(Math.random() * 30) + 70, // Mock grade between 70-100
    subjectCount: Math.floor(Math.random() * 3) + 4, // 4-6 subjects
    attendanceRate: Math.floor(Math.random() * 10) + 90, // 90-100% attendance
  }));

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-primary text-2xl">person</span>
              <span className="px-2 py-1 bg-blue-100 text-primary text-xs font-medium rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{students.length}</h3>
            <p className="text-sm text-gray-600">My Children</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-success text-2xl">school</span>
              <span className="text-xs text-gray-500">This Week</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingGrades}</h3>
            <p className="text-sm text-gray-600">New Grades</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-warning text-2xl">chat</span>
              {stats.unreadMessages > 0 && (
                <span className="w-2 h-2 bg-error rounded-full"></span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</h3>
            <p className="text-sm text-gray-600">New Messages</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-secondary text-2xl">event</span>
              <span className="text-xs text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.todayEvents}</h3>
            <p className="text-sm text-gray-600">Events Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Children Progress */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Children's Progress</h2>
            <Button 
              variant="link" 
              className="text-primary text-sm font-medium p-0"
              onClick={() => onNavigate('students')}
            >
              View Details
            </Button>
          </div>
          
          <div className="space-y-4">
            {childrenProgress.map((child) => {
              const gradeLevel = getGradeLevel(child.recentGrade);
              const gradeBadgeClass = 
                gradeLevel === 'excellent' ? 'grade-excellent' :
                gradeLevel === 'good' ? 'grade-good' :
                gradeLevel === 'average' ? 'grade-average' : 'grade-below';
              
              return (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onNavigate('students')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {child.firstName[0]}{child.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {child.grade} • {child.subjectCount} subjects
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{child.recentGrade}%</div>
                    <div className={`px-2 py-1 ${gradeBadgeClass} rounded-full text-xs font-medium`}>
                      Recent Grade
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Button variant="link" className="text-primary text-sm font-medium p-0">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                  <span className="material-icons text-white text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
              onClick={() => onNavigate('messages')}
            >
              <span className="material-icons text-xl">message</span>
              <span className="text-xs">Message Teachers</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
              onClick={() => onNavigate('calendar')}
            >
              <span className="material-icons text-xl">event</span>
              <span className="text-xs">View Calendar</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
              onClick={() => onNavigate('students')}
            >
              <span className="material-icons text-xl">assignment</span>
              <span className="text-xs">View Grades</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
              onClick={() => onNavigate('profile')}
            >
              <span className="material-icons text-xl">settings</span>
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
