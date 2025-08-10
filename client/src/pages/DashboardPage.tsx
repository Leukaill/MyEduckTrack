import React, { useState, useEffect } from 'react';
import { TeacherDashboard } from '@/components/Dashboard/TeacherDashboard';
// import { ParentDashboard } from '@/components/Dashboard/ParentDashboard';
// import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats } from '@/types';
import { LoadingPage } from '@/components/Common/LoadingSpinner';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 124,
    pendingGrades: 8,
    unreadMessages: 5,
    todayEvents: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      try {
        // In a real app, fetch actual stats from API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error('Error loading stats:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'teacher':
      return <TeacherDashboard stats={stats} onNavigate={onNavigate} />;
    case 'parent':
      // return <ParentDashboard stats={stats} onNavigate={onNavigate} />;
      return <TeacherDashboard stats={stats} onNavigate={onNavigate} />; // Temporary
    case 'admin':
      // return <AdminDashboard stats={stats} onNavigate={onNavigate} />;
      return <TeacherDashboard stats={stats} onNavigate={onNavigate} />; // Temporary
    default:
      return <TeacherDashboard stats={stats} onNavigate={onNavigate} />;
  }
};
