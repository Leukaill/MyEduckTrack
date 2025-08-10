import React, { useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BottomNav } from '@/components/Navigation/BottomNav';
import { LoadingPage } from '@/components/Common/LoadingSpinner';
import { initEmailJS } from '@/lib/emailjs';

// Initialize EmailJS
initEmailJS();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'students':
        return <StudentsPage onNavigate={setCurrentPage} />;
      case 'messages':
        return <MessagesPage onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                <img 
                  src="/attached_assets/WhatsApp Image 2025-08-10 at 5.46.34 PM_1754841275992.jpeg" 
                  alt="School Logo" 
                  className="w-8 h-8 object-contain"
                  data-testid="img-nav-logo"
                />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">EducTrack School</h1>
                <p className="text-sm text-gray-500 capitalize">{user.role} Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="material-icons">notifications</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 px-4 py-6">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
