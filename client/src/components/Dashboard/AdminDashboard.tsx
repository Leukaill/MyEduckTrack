import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/types';
import { formatRelativeTime } from '@/utils/dateHelpers';

interface AdminDashboardProps {
  stats: DashboardStats;
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, onNavigate }) => {
  const systemStats = {
    totalUsers: 342,
    totalTeachers: 28,
    totalParents: 189,
    totalStudents: 450,
    activeToday: 156,
    newRegistrations: 12,
  };

  const recentActivities = [
    {
      id: '1',
      type: 'user',
      title: 'New teacher registered',
      description: 'Dr. Sarah Chen joined Mathematics department',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      icon: 'person_add',
      color: 'bg-success',
    },
    {
      id: '2',
      type: 'event',
      title: 'School event created',
      description: 'Science Fair scheduled for next month',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      icon: 'event',
      color: 'bg-primary',
    },
    {
      id: '3',
      type: 'system',
      title: 'System backup completed',
      description: 'All data backed up successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'backup',
      color: 'bg-secondary',
    },
  ];

  const departments = [
    {
      id: '1',
      name: 'Mathematics',
      teachers: 5,
      students: 125,
      performance: 87.5,
      icon: 'calculate',
      color: 'bg-primary',
    },
    {
      id: '2',
      name: 'Science',
      teachers: 8,
      students: 180,
      performance: 84.2,
      icon: 'science',
      color: 'bg-success',
    },
    {
      id: '3',
      name: 'Languages',
      teachers: 6,
      students: 145,
      performance: 89.1,
      icon: 'translate',
      color: 'bg-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* System Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-primary text-2xl">people</span>
              <span className="px-2 py-1 bg-blue-100 text-primary text-xs font-medium rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</h3>
            <p className="text-sm text-gray-600">System Users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-success text-2xl">school</span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{systemStats.totalTeachers}</h3>
            <p className="text-sm text-gray-600">Teachers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-warning text-2xl">family_restroom</span>
              <span className="text-xs text-gray-500">Enrolled</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{systemStats.totalParents}</h3>
            <p className="text-sm text-gray-600">Parents</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons text-secondary text-2xl">groups</span>
              <span className="w-2 h-2 bg-success rounded-full"></span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{systemStats.activeToday}</h3>
            <p className="text-sm text-gray-600">Active Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
            <Button variant="link" className="text-primary text-sm font-medium p-0">
              Manage All
            </Button>
          </div>
          
          <div className="space-y-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${dept.color} rounded-lg flex items-center justify-center`}>
                    <span className="material-icons text-white text-sm">{dept.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">
                      {dept.teachers} teachers • {dept.students} students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{dept.performance}%</div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activity */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">System Activity</h2>
            <Button variant="link" className="text-primary text-sm font-medium p-0">
              View Logs
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

      {/* Admin Quick Actions */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Tools</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-icons text-xl">person_add</span>
              <span className="text-xs">Add User</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-icons text-xl">event</span>
              <span className="text-xs">Create Event</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-icons text-xl">analytics</span>
              <span className="text-xs">Reports</span>
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
