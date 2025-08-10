import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatMessageTime } from '@/utils/dateHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatViewProps {
  participantId: string;
  participantName: string;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
  participantId, 
  participantName, 
  onBack 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showParentInfo, setShowParentInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demo
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: participantId,
      content: 'Hi Ms. Johnson! I wanted to ask about Emma\'s math homework. She\'s finding the algebra problems quite challenging.',
      timestamp: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
      isRead: true,
    },
    {
      id: '2',
      senderId: user?.id || 'teacher1',
      content: 'Hello Sarah! I understand Emma\'s concern. Algebra can be tricky at first. I\'d be happy to schedule some extra help sessions after class.',
      timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
      isRead: true,
    },
    {
      id: '3',
      senderId: participantId,
      content: 'That would be wonderful! What days are you available? Emma is free on Tuesdays and Thursdays after 4 PM.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      isRead: true,
    },
    {
      id: '4',
      senderId: user?.id || 'teacher1',
      content: 'Perfect! I can do Thursday at 4:15 PM in my classroom. I\'ll also send home some practice problems that might help.',
      timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      isRead: false,
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [participantId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const messageId = Date.now().toString();
      const newMsg: ChatMessage = {
        id: messageId,
        senderId: user.id,
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false,
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttachment = () => {
    toast({
      title: "Feature Coming Soon",
      description: "File attachments will be available in a future update.",
    });
  };

  const getParticipantInitials = () => {
    const names = participantName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            data-testid="button-back-to-messages"
          >
            <span className="material-icons">arrow_back</span>
          </Button>
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium" data-testid="text-participant-initials">
              {getParticipantInitials()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-medium text-gray-900" data-testid="text-participant-name">
              {participantName}
            </h1>
            <p className="text-sm text-gray-600">Parent of Emma Martinez</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParentInfo(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            data-testid="button-show-info"
          >
            <span className="material-icons">info</span>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            data-testid={`message-${message.id}`}
          >
            <div className="max-w-xs">
              <div className={`p-3 text-sm ${
                message.senderId === user?.id
                  ? 'chat-bubble-sent text-white'
                  : 'chat-bubble-received'
              }`}>
                <p data-testid={`message-content-${message.id}`}>
                  {message.content}
                </p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 px-3 ${
                message.senderId === user?.id ? 'text-right' : 'text-left'
              }`} data-testid={`message-time-${message.id}`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAttachment}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            data-testid="button-attach-file"
          >
            <span className="material-icons">attach_file</span>
          </Button>
          <div className="flex-1 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary pr-12"
              placeholder="Type a message..."
              disabled={loading}
              data-testid="input-new-message"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!newMessage.trim() || loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary hover:text-white rounded-lg disabled:opacity-50"
              data-testid="button-send-message"
            >
              <span className="material-icons">send</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Parent Info Dialog */}
      <Dialog open={showParentInfo} onOpenChange={setShowParentInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Parent Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {getParticipantInitials()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{participantName}</h3>
              <p className="text-sm text-gray-600">Parent of Emma Martinez</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="material-icons text-gray-600">email</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">sarah.wilson@email.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="material-icons text-gray-600">phone</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="material-icons text-gray-600">schedule</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Preferred Contact Time</p>
                  <p className="text-sm text-gray-600">After 6:00 PM on weekdays</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowParentInfo(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
