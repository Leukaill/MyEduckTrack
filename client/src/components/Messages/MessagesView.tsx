import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { formatMessageTime } from '@/utils/dateHelpers';

interface MessagesViewProps {
  onChatSelect: (userId: string, userName: string) => void;
  onBack: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onChatSelect, onBack }) => {
  const { user } = useAuth();
  const { conversations, loading, error } = useMessages();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversation data for demo
  const mockConversations = [
    {
      id: '1',
      participant: {
        id: 'parent1',
        name: 'Sarah Wilson',
        initials: 'SW',
        role: 'parent',
        childName: 'Emma Martinez',
        isOnline: true,
      },
      lastMessage: {
        content: 'Thank you for the feedback on Emma\'s progress...',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
      },
      unreadCount: 1,
    },
    {
      id: '2',
      participant: {
        id: 'parent2',
        name: 'Mark Johnson',
        initials: 'MJ',
        role: 'parent',
        childName: 'James Davis',
        isOnline: false,
      },
      lastMessage: {
        content: 'Could we schedule a meeting to discuss...',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: '3',
      participant: {
        id: 'parent3',
        name: 'Amanda Thompson',
        initials: 'AT',
        role: 'parent',
        childName: 'Lisa Thompson',
        isOnline: true,
      },
      lastMessage: {
        content: 'Lisa has been working hard on math...',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isRead: true,
      },
      unreadCount: 2,
    },
  ];

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.childName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitialsColor = (initials: string) => {
    const colors = [
      'from-pink-400 to-pink-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-indigo-400 to-indigo-600',
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Messages</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <span className="material-icons absolute left-3 top-3 text-gray-400">search</span>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
          placeholder="Search conversations..."
          data-testid="input-search-messages"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-sm">
            <CardContent className="py-12 text-center">
              <span className="material-icons text-4xl text-gray-400 mb-4">chat</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversations Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start a conversation by messaging a parent.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => onChatSelect(conversation.participant.id, conversation.participant.name)}
              data-testid={`conversation-${conversation.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getInitialsColor(conversation.participant.initials)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-medium" data-testid={`text-initials-${conversation.id}`}>
                        {conversation.participant.initials}
                      </span>
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                      conversation.participant.isOnline ? 'bg-success' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate" data-testid={`text-name-${conversation.id}`}>
                        {conversation.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500" data-testid={`text-timestamp-${conversation.id}`}>
                        {formatMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate" data-testid={`text-child-name-${conversation.id}`}>
                      Parent of {conversation.participant.childName}
                    </p>
                    <p className={`text-sm truncate mt-1 ${
                      !conversation.lastMessage.isRead ? 'text-gray-800 font-medium' : 'text-gray-600'
                    }`} data-testid={`text-last-message-${conversation.id}`}>
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {conversation.unreadCount > 0 && (
                      <span 
                        className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center"
                        data-testid={`badge-unread-${conversation.id}`}
                      >
                        {conversation.unreadCount}
                      </span>
                    )}
                    {!conversation.lastMessage.isRead && conversation.unreadCount === 0 && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State for No Messages */}
      {conversations.length === 0 && !loading && (
        <Card className="bg-white rounded-2xl shadow-sm">
          <CardContent className="py-12 text-center">
            <span className="material-icons text-4xl text-gray-400 mb-4">chat_bubble_outline</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-600 mb-6">
              When parents send you messages, they'll appear here.
            </p>
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
