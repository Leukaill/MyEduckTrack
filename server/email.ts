import nodemailer from 'nodemailer';

// Simple email service using Gmail SMTP (works with app passwords)
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // For development, we'll just log to console
    // In production, you'd configure with real SMTP credentials
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'your-email@gmail.com',
          pass: process.env.SMTP_PASS || 'your-app-password'
        }
      });
    } catch (error) {
      console.log('Email transporter not configured. Using console logging for development.');
      this.transporter = null;
    }
  }

  async sendOTP(email: string, otp: string, role: string): Promise<boolean> {
    try {
      // For development, log the OTP to console
      console.log(`\n🔐 OTP for ${email} (${role}): ${otp}\n`);
      
      if (!this.transporter) {
        console.log('Email transporter not configured. Using console logging for development.');
        return true;
      }

      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@eductrack.com',
        to: email,
        subject: 'EducTrack - Your Login Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">EducTrack Login Code</h2>
            <p>Hello,</p>
            <p>Your login code for EducTrack is:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
            <p>Role: ${role}</p>
            <p>Best regards,<br>EducTrack Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      // For development, still return true so the OTP process continues
      return true;
    }
  }
}

export const emailService = new EmailService();