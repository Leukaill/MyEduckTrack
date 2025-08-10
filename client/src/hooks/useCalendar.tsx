import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { getSchoolEvents, createEvent } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { isEventToday } from '@/utils/dateHelpers';

export const useCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const schoolEvents = await getSchoolEvents(user.schoolId);
        setEvents(schoolEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const addEvent = async (eventData: Partial<Event>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await createEvent({
        ...eventData,
        organizerId: user.id,
        schoolId: user.schoolId,
        isPublic: true,
      });
      
      // Refetch events
      const schoolEvents = await getSchoolEvents(user.schoolId);
      setEvents(schoolEvents);
    } catch (err) {
      console.error('Error adding event:', err);
      throw new Error('Failed to add event');
    }
  };

  const todayEvents = events.filter(event => isEventToday(new Date(event.startDate)));
  const upcomingEvents = events.filter(event => !isEventToday(new Date(event.startDate)));

  return {
    events,
    todayEvents,
    upcomingEvents,
    loading,
    error,
    addEvent,
  };
};
