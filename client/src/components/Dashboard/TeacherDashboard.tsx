import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/types';
import { useStudents } from '@/hooks/useStudents';
import { useMessages } from '@/hooks/useMessages';
import { useCalendar } from '@/hooks/useCalendar';
import { formatRelativeTime } from '@/utils/dateHelpers';

interface TeacherDashboardProps {
  stats: DashboardStats;
  onNavigate: (page: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ stats, onNavigate }) => {
  const { students } = useStudents();
  const { conversations } = useMessages();
  const { todayEvents } = useCalendar();

  const recentActivities = [
    {
      id: '1',
      type: 'grade',
      title: 'Math Quiz grades uploaded',
      description: `${students.length} students • Grade 10A`,
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      icon: 'grade',
      color: 'bg-success',
    },
    {
      id: '2',
      type: 'message',
      title: 'New message from Sarah Wilson',
      description: "Regarding Emma's homework progress",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      icon: 'message',
      color: 'bg-primary',
    },
    {
      id: '3',
      type: 'event',
      title: 'Parent-Teacher meeting scheduled',
      description: "Tomorrow at 3:00 PM with John's parents",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      icon: 'event',
      color: 'bg-warning',
    },
  ];

  const subjects = [
    {
      id: '1',
      name: 'Mathematics',
      class: 'Grade 10A • 25 students',
      average: '87.5%',
      trend: '+3.2%',
      icon: 'calculate',
      color: 'bg-primary',
    },
    {
      id: '2',
      name: 'Physics',
      class: 'Grade 10B • 28 students',
      average: '82.1%',
      trend: '-1.5%',
      icon: 'science',
      color: 'bg-secondary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-success text-2xl">people</span>
              <span className="px-2 py-1 bg-green-100 text-success text-xs font-medium rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-warning text-2xl">assignment</span>
              <span className="text-xs text-gray-500">This Week</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingGrades}</h3>
            <p className="text-sm text-gray-600">Pending Grades</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-primary text-2xl">chat</span>
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

      {/* Class Performance */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Performance</h2>
          
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onNavigate('students')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
                    <span className="material-icons text-white text-sm">{subject.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{subject.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{subject.average}</div>
                  <div className={`text-xs ${
                    subject.trend.startsWith('+') ? 'text-success' : 'text-error'
                  }`}>
                    {subject.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
