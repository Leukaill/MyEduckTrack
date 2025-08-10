import { useState, useEffect, useCallback } from 'react';
import { Message, User, Conversation } from '@/types';
import { 
  getConversations, 
  getMessagesBetweenUsers, 
  sendMessage, 
  markMessageAsRead,
  subscribeToMessages,
  subscribeToUserConversations
} from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const messages = await getConversations(user.id);
        setConversations(messages);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserConversations(user.id, (messages) => {
      setConversations(messages);
    });

    return unsubscribe;
  }, [user]);

  const send = useCallback(async (receiverId: string, content: string, attachments?: any[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await sendMessage({
        senderId: user.id,
        receiverId,
        content,
        attachments: attachments || [],
        isRead: false,
      });
    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  }, [user]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    send,
    markAsRead,
  };
};

export const useChatMessages = (otherUserId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !otherUserId) return;

    setLoading(true);

    // Subscribe to real-time messages
    const unsubscribe = subscribeToMessages(user.id, otherUserId, (messages) => {
      setMessages(messages);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [user, otherUserId]);

  const sendMessageToChatUser = useCallback(async (content: string, attachments?: any[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await sendMessage({
        senderId: user.id,
        receiverId: otherUserId,
        content,
        attachments: attachments || [],
        isRead: false,
      });
    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  }, [user, otherUserId]);

  return {
    messages,
    loading,
    error,
    sendMessage: sendMessageToChatUser,
  };
};
