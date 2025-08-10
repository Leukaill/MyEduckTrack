import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adminRegistrationSchema, parentRegistrationSchema, teacherCreationSchema } from "@shared/schema";
import { emailService } from "./email";
import { randomInt } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // OTP storage (in production, use Redis or database)
  const otpStore = new Map<string, { otp: string; timestamp: number; userData?: any }>();

  // Send OTP endpoint
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email, role } = req.body;
      
      if (!email || !role) {
        return res.status(400).json({
          success: false,
          message: "Email and role are required"
        });
      }

      // Generate 6-digit OTP
      const otp = randomInt(100000, 999999).toString();
      
      // Store OTP with timestamp (expires in 10 minutes)
      otpStore.set(email, {
        otp,
        timestamp: Date.now(),
        userData: { email, role }
      });

      // Send OTP via email
      await emailService.sendOTP(email, otp, role);

      res.json({
        success: true,
        message: "OTP sent successfully",
        // In development, include OTP in response for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to send OTP"
      });
    }
  });

  // Verify OTP endpoint
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required"
        });
      }

      const storedData = otpStore.get(email);
      
      if (!storedData) {
        return res.status(400).json({
          success: false,
          message: "OTP not found or expired"
        });
      }

      // Check if OTP is expired (10 minutes)
      const isExpired = Date.now() - storedData.timestamp > 10 * 60 * 1000;
      
      if (isExpired) {
        otpStore.delete(email);
        return res.status(400).json({
          success: false,
          message: "OTP has expired"
        });
      }

      if (storedData.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
      }

      // OTP verified successfully
      otpStore.delete(email);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      
      res.json({
        success: true,
        message: "OTP verified successfully",
        user: existingUser ? {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          schoolId: existingUser.schoolId
        } : null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "OTP verification failed"
      });
    }
  });

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
