import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalendar } from '@/hooks/useCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { formatEventDate, formatEventTime, getCalendarDays, getMonthYear } from '@/utils/dateHelpers';
import { useToast } from '@/hooks/use-toast';

interface CalendarViewProps {
  onBack: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { events, todayEvents, upcomingEvents, loading, error, addEvent } = useCalendar();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
  });

  const calendarDays = getCalendarDays(currentDate);

  const eventTypes = [
    { value: 'academic', label: 'Academic' },
    { value: 'extracurricular', label: 'Extracurricular' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'holiday', label: 'Holiday' },
  ];

  const mockTodayEvents = [
    {
      id: '1',
      title: 'Parent-Teacher Conference',
      description: 'Meeting with parents to discuss student progress',
      eventType: 'meeting' as const,
      startDate: new Date(),
      endDate: new Date(),
      location: 'Room 101',
      time: '3:00 PM - 5:00 PM',
      icon: 'event',
      color: 'bg-primary',
    },
    {
      id: '2',
      title: 'Soccer Practice',
      description: 'Regular practice session for the school team',
      eventType: 'extracurricular' as const,
      startDate: new Date(),
      endDate: new Date(),
      location: 'School Field',
      time: '4:00 PM - 6:00 PM',
      icon: 'sports_soccer',
      color: 'bg-success',
    },
  ];

  const mockUpcomingEvents = [
    {
      id: '3',
      title: 'Science Fair',
      description: 'Annual science project exhibition',
      eventType: 'academic' as const,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '9:00 AM - 3:00 PM',
      date: '18',
      month: 'DEC',
    },
    {
      id: '4',
      title: 'Winter Break Begins',
      description: 'Last day of classes before holiday break',
      eventType: 'holiday' as const,
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: 'End of Day',
      date: '20',
      month: 'DEC',
    },
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const startDateTime = new Date(`${eventForm.startDate}T${eventForm.startTime}`);
      const endDateTime = eventForm.endDate && eventForm.endTime 
        ? new Date(`${eventForm.endDate}T${eventForm.endTime}`)
        : undefined;

      await addEvent({
        title: eventForm.title,
        description: eventForm.description,
        eventType: eventForm.eventType as any,
        startDate: startDateTime,
        endDate: endDateTime,
        location: eventForm.location,
      });

      toast({
        title: "Event Created",
        description: "Event has been successfully added to the calendar.",
      });

      setIsAddEventOpen(false);
      setEventForm({
        title: '',
        description: '',
        eventType: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEventDots = (day: any) => {
    // Mock event indicators
    const dayNum = parseInt(day.day);
    if (dayNum === 4) return [{ color: 'bg-primary' }];
    if (dayNum === 10) return [{ color: 'bg-warning' }];
    if (dayNum === 18) return [{ color: 'bg-success' }];
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          data-testid="button-previous-month"
        >
          <span className="material-icons">chevron_left</span>
        </Button>
        <h2 className="text-lg font-medium text-gray-900" data-testid="text-current-month">
          {getMonthYear(currentDate)}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          data-testid="button-next-month"
        >
          <span className="material-icons">chevron_right</span>
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-4">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const eventDots = getEventDots(day);
              
              return (
                <div
                  key={index}
                  className={`aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
                    day.isToday 
                      ? 'bg-primary text-white' 
                      : day.isCurrentMonth 
                        ? 'text-gray-900 font-medium' 
                        : 'text-gray-400'
                  }`}
                  data-testid={`calendar-day-${day.day}`}
                >
                  <div className="relative h-full flex flex-col items-center justify-center">
                    <div>{day.day}</div>
                    {eventDots.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {eventDots.map((dot, dotIndex) => (
                          <div
                            key={dotIndex}
                            className={`w-1 h-1 ${dot.color} rounded-full`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Today's Events</h3>
        <div className="space-y-3">
          {mockTodayEvents.map((event) => (
            <Card key={event.id} className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}>
                    <span className="material-icons text-white text-sm">{event.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900" data-testid={`event-title-${event.id}`}>
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1" data-testid={`event-description-${event.id}`}>
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-icons text-sm mr-1">schedule</span>
                        <span data-testid={`event-time-${event.id}`}>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-icons text-sm mr-1">location_on</span>
                        <span data-testid={`event-location-${event.id}`}>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Upcoming Events</h3>
        <div className="space-y-3">
          {mockUpcomingEvents.map((event) => (
            <Card key={event.id} className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold text-primary" data-testid={`event-date-${event.id}`}>
                      {event.date}
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`event-month-${event.id}`}>
                      {event.month}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900" data-testid={`upcoming-event-title-${event.id}`}>
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1" data-testid={`upcoming-event-description-${event.id}`}>
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="material-icons text-sm mr-1">schedule</span>
                      <span data-testid={`upcoming-event-time-${event.id}`}>{event.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={eventForm.eventType}
                onValueChange={(value) => setEventForm(prev => ({ ...prev, eventType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter event location"
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">Create Event</Button>
              <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddEventOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center"
        data-testid="button-add-new-event"
      >
        <span className="material-icons">add</span>
      </Button>
    </div>
  );
};
