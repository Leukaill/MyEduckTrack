export type UserRole = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  grade: string;
  classSection: string;
  parentId?: string;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  grade: string;
  classSection: string;
  schoolId: string;
  createdAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  assessmentType: 'quiz' | 'exam' | 'assignment' | 'project';
  assessmentName: string;
  score: string;
  maxScore: string;
  feedback?: string;
  gradedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: FileAttachment[];
  isRead: boolean;
  sentAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventType: 'academic' | 'extracurricular' | 'meeting' | 'holiday';
  startDate: Date;
  endDate?: Date;
  location?: string;
  organizerId: string;
  schoolId: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string, role: UserRole, additionalData?: Partial<User>) => Promise<void>;
}

export interface DashboardStats {
  totalStudents: number;
  pendingGrades: number;
  unreadMessages: number;
  todayEvents: number;
}
