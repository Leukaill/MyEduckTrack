import React from 'react';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'students', label: 'Students', icon: 'people' },
    { id: 'messages', label: 'Messages', icon: 'chat' },
    { id: 'calendar', label: 'Calendar', icon: 'event' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            data-testid={`nav-${tab.id}`}
          >
            <span className="material-icons text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
