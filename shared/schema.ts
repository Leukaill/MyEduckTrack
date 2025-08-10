import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // 'admin', 'teacher', 'parent'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  schoolId: text("school_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  studentId: text("student_id").notNull().unique(),
  grade: text("grade").notNull(),
  classSection: text("class_section").notNull(),
  parentId: text("parent_id").references(() => users.id),
  schoolId: text("school_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull(),
  teacherId: text("teacher_id").references(() => users.id),
  grade: text("grade").notNull(),
  classSection: text("class_section").notNull(),
  schoolId: text("school_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: text("student_id").references(() => students.id),
  subjectId: text("subject_id").references(() => subjects.id),
  teacherId: text("teacher_id").references(() => users.id),
  assessmentType: text("assessment_type").notNull(), // 'quiz', 'exam', 'assignment', 'project'
  assessmentName: text("assessment_name").notNull(),
  score: text("score").notNull(),
  maxScore: text("max_score").notNull(),
  feedback: text("feedback"),
  gradedAt: timestamp("graded_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: text("sender_id").references(() => users.id),
  receiverId: text("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments"), // Array of file metadata
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // 'academic', 'extracurricular', 'meeting', 'holiday'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  organizerId: text("organizer_id").references(() => users.id),
  schoolId: text("school_id").notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  schoolId: true,
});

export const insertStudentSchema = createInsertSchema(students).pick({
  firstName: true,
  lastName: true,
  studentId: true,
  grade: true,
  classSection: true,
  parentId: true,
  schoolId: true,
});

export const insertGradeSchema = createInsertSchema(grades).pick({
  studentId: true,
  subjectId: true,
  teacherId: true,
  assessmentType: true,
  assessmentName: true,
  score: true,
  maxScore: true,
  feedback: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
  attachments: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  eventType: true,
  startDate: true,
  endDate: true,
  location: true,
  organizerId: true,
  schoolId: true,
  isPublic: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Subject = typeof subjects.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
