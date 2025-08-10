import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/Calendar/CalendarView';

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const handleBack = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 backdrop-blur-lg bg-white/95">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="button-back-to-dashboard"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">School Calendar</h1>
            <div className="w-10 h-10"> {/* Placeholder for spacing */}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <CalendarView onBack={handleBack} />
      </div>
    </div>
  );
};
