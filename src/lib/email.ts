// // utils/email.ts
// import nodemailer from 'nodemailer';

// type EmailOptions = {
//   to: string;
//   subject: string;
//   text?: string;
//   html?: string;
// };

// // Configure your email transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Generic email sending function
// export const sendEmail = async (options: EmailOptions) => {
//   try {
//     await transporter.sendMail({
//       from: `"EliteFreelancer" <${process.env.EMAIL_FROM}>`,
//       to: options.to,
//       subject: options.subject,
//       text: options.text,
//       html: options.html,
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// };

// // Email templates
// type PasswordResetParams = {
//   user: { email: string };
//   url: string;
//   token: string;
// };

// type VerificationEmailParams = {
//   user: { email: string };
//   url: string;
//   token: string;
// };

// export const sendPasswordResetEmail = async (params: PasswordResetParams) => {
//   const html = `
//     <p>Hello,</p>
//     <p>Click the link below to reset your password:</p>
//     <a href="${params.url}">Reset Password</a>
//     <p>This link will expire in 1 hour.</p>
//   `;

//   await sendEmail({
//     to: params.user.email,
//     subject: 'Password Reset Request',
//     html: html,
//     text: `Password Reset Link: ${params.url}`,
//   });
// };

// export const sendVerificationEmail = async (params: VerificationEmailParams) => {
//   const html = `
//     <p>Welcome to EliteFreelancer!</p>
//     <p>Please verify your email by clicking the link below:</p>
//     <a href="${params.url}">Verify Email</a>
//     <p>This link will expire in 24 hours.</p>
//   `;

//   await sendEmail({
//     to: params.user.email,
//     subject: 'Verify Your Email Address',
//     html: html,
//     text: `Verification Link: ${params.url}`,
//   });
// };

// email.ts
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Define the options for sending an email
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create a transporter using SMTP details from your environment variables
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., 'smtp.example.com'
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

// The sendEmail function sends an email using the transporter
export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // sender address (e.g., '"Your Name" <no-reply@example.com>')
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
