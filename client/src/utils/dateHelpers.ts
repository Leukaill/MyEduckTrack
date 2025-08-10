import { format, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export const formatMessageTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};

export const formatEventDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatEventTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
};

export const getCalendarDays = (currentDate: Date) => {
  const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const end = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
  
  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isToday(date),
    day: format(date, 'd'),
  }));
};

export const isEventToday = (eventDate: Date): boolean => {
  return isSameDay(eventDate, new Date());
};

export const getMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getGradePercentage = (score: string, maxScore: string): number => {
  const scoreNum = parseFloat(score);
  const maxScoreNum = parseFloat(maxScore);
  
  if (isNaN(scoreNum) || isNaN(maxScoreNum) || maxScoreNum === 0) {
    return 0;
  }
  
  return Math.round((scoreNum / maxScoreNum) * 100);
};

export const getGradeLevel = (percentage: number): 'excellent' | 'good' | 'average' | 'below' => {
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 70) return 'average';
  return 'below';
};
