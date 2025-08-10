import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_yvl11d5';
const TEMPLATE_ID = 'template_zlp263e';
const PUBLIC_KEY = 'Un7snKzeE4AGeorc-';

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
