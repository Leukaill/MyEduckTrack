import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key';

export const sendOTPEmail = async (email: string, otp: string, role: string): Promise<void> => {
  try {
    const templateParams = {
      to_email: email,
      otp_code: otp,
      user_role: role,
      app_name: 'EducTrack',
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send OTP. Please check your email address and try again.');
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(PUBLIC_KEY);
};
