import React, { useState } from 'react';
import { MessagesView } from '@/components/Messages/MessagesView';
import { ChatView } from '@/components/Messages/ChatView';

interface MessagesPageProps {
  onNavigate: (page: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [selectedChat, setSelectedChat] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  const handleChatSelect = (userId: string, userName: string) => {
    setSelectedChat({ userId, userName });
    setCurrentView('chat');
  };

  const handleBackToMessages = () => {
    setCurrentView('list');
    setSelectedChat(null);
  };

  const handleBackToDashboard = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 backdrop-blur-lg bg-white/95">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {currentView === 'list' ? (
              <>
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-back-to-dashboard"
                >
                  <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <button 
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-search-messages"
                >
                  <span className="material-icons">search</span>
                </button>
              </>
            ) : (
              <div className="w-full">
                {/* Chat header will be handled by ChatView component */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {currentView === 'list' ? (
          <MessagesView 
            onChatSelect={handleChatSelect}
            onBack={handleBackToDashboard}
          />
        ) : selectedChat ? (
          <ChatView
            participantId={selectedChat.userId}
            participantName={selectedChat.userName}
            onBack={handleBackToMessages}
          />
        ) : null}
      </div>
    </div>
  );
};
