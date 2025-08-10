import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adminRegistrationSchema, parentRegistrationSchema, teacherCreationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/register-admin", async (req, res) => {
    try {
      const validatedData = adminRegistrationSchema.parse(req.body);
      
      // Generate school ID if not provided
      if (!validatedData.schoolId) {
        validatedData.schoolId = `SCH_${validatedData.schoolName.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`;
      }
      
      // Create admin user with school-specific data
      const adminUser = await storage.createAdminUser(validatedData);
      
      res.json({ 
        success: true, 
        message: "Admin account created successfully",
        user: { id: adminUser.id, email: adminUser.email, role: adminUser.role, schoolId: adminUser.schoolId }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Registration failed" 
      });
    }
  });

  app.post("/api/auth/register-parent", async (req, res) => {
    try {
      const validatedData = parentRegistrationSchema.parse(req.body);
      
      // Create parent user with parent-specific data
      const parentUser = await storage.createParentUser(validatedData);
      
      res.json({ 
        success: true, 
        message: "Parent account created successfully",
        user: { id: parentUser.id, email: parentUser.email, role: parentUser.role, schoolId: parentUser.schoolId }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Registration failed" 
      });
    }
  });

  app.post("/api/teachers/create", async (req, res) => {
    try {
      const validatedData = teacherCreationSchema.parse(req.body);
      
      // Create teacher user (only accessible by admins)
      const teacherUser = await storage.createTeacherUser(validatedData);
      
      res.json({ 
        success: true, 
        message: "Teacher account created successfully",
        user: { id: teacherUser.id, email: teacherUser.email, role: teacherUser.role, schoolId: teacherUser.schoolId }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Teacher creation failed" 
      });
    }
  });

  app.get("/api/teachers", async (req, res) => {
    try {
      const { schoolId } = req.query;
      
      if (!schoolId) {
        return res.status(400).json({ 
          success: false, 
          message: "School ID is required" 
        });
      }
      
      const teachers = await storage.getTeachersBySchool(schoolId as string);
      
      res.json({ 
        success: true, 
        teachers 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to fetch teachers" 
      });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          schoolId: user.schoolId 
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to fetch user" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
