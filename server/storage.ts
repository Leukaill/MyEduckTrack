import { type User, type InsertUser, type AdminRegistration, type ParentRegistration, type TeacherCreation } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAdminUser(adminData: AdminRegistration): Promise<User>;
  createParentUser(parentData: ParentRegistration): Promise<User>;
  createTeacherUser(teacherData: TeacherCreation): Promise<User>;
  getTeachersBySchool(schoolId: string): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      schoolName: null,
      schoolAddress: null,
      schoolPhone: null,
      adminTitle: null,
      parentPhone: null,
      parentOccupation: null,
      emergencyContact: null,
      emergencyContactPhone: null,
      relationshipToStudent: null,
      teacherSubjects: null,
      teacherQualifications: null,
      employeeId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createAdminUser(adminData: AdminRegistration): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: adminData.email,
      role: adminData.role,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      schoolId: adminData.schoolId || `SCH_${adminData.schoolName.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`,
      schoolName: adminData.schoolName,
      schoolAddress: adminData.schoolAddress,
      schoolPhone: adminData.schoolPhone,
      adminTitle: adminData.adminTitle,
      parentPhone: null,
      parentOccupation: null,
      emergencyContact: null,
      emergencyContactPhone: null,
      relationshipToStudent: null,
      teacherSubjects: null,
      teacherQualifications: null,
      employeeId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createParentUser(parentData: ParentRegistration): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: parentData.email,
      role: parentData.role,
      firstName: parentData.firstName,
      lastName: parentData.lastName,
      schoolId: parentData.schoolId,
      schoolName: null,
      schoolAddress: null,
      schoolPhone: null,
      adminTitle: null,
      parentPhone: parentData.parentPhone,
      parentOccupation: parentData.parentOccupation,
      emergencyContact: parentData.emergencyContact,
      emergencyContactPhone: parentData.emergencyContactPhone,
      relationshipToStudent: parentData.relationshipToStudent,
      teacherSubjects: null,
      teacherQualifications: null,
      employeeId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createTeacherUser(teacherData: TeacherCreation): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: teacherData.email,
      role: teacherData.role,
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      schoolId: teacherData.schoolId,
      schoolName: null,
      schoolAddress: null,
      schoolPhone: null,
      adminTitle: null,
      parentPhone: null,
      parentOccupation: null,
      emergencyContact: null,
      emergencyContactPhone: null,
      relationshipToStudent: null,
      teacherSubjects: teacherData.teacherSubjects,
      teacherQualifications: teacherData.teacherQualifications,
      employeeId: teacherData.employeeId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getTeachersBySchool(schoolId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'teacher' && user.schoolId === schoolId && user.isActive
    );
  }
}

export const storage = new MemStorage();
