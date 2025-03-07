import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Load environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate verification token and store it
export const createVerificationToken = async (email: string): Promise<string> => {
  // Generate a random token
  const verificationToken = crypto.randomUUID();
  
  try {
    // Delete any existing verification tokens for this email
    await prisma.verification.deleteMany({
      where: { identifier: email },
    });
    
    // Create a new verification token
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return verificationToken;
  } catch (error) {
    console.error('Error creating verification token:', error);
    throw new Error('Failed to create verification token');
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
  const verificationLink = `${FRONTEND_URL}/auth/verify/${token}`;
  
  // HTML email template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering! Please verify your email address to complete your registration.</p>
      <div style="margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>The Team</p>
    </div>
  `;
  
  // Plain text alternative
  const textContent = `
    Verify Your Email Address
    
    Hello ${name},
    
    Thank you for registering! Please verify your email address to complete your registration.
    
    Please click on the link below to verify your email:
    ${verificationLink}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, you can safely ignore this email.
    
    Best regards,
    The Team
  `;
  
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"EliteFreelancer" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email Address',
      text: textContent,
      html: htmlContent,
    });
    
    console.log('Verification email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, name: string): Promise<string> => {
  // Generate a token
  const resetToken = crypto.randomUUID();
  
  try {
    // Delete any existing verification tokens for this email
    await prisma.verification.deleteMany({
      where: { 
        identifier: email,
      },
    });
    
    // Create a new verification token
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: resetToken,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    const resetLink = `${FRONTEND_URL}/user/reset-password/${resetToken}`;
    
    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4285F4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `;
    
    // Plain text alternative
    const textContent = `
      Reset Your Password
      
      Hello ${name},
      
      We received a request to reset your password. Please click on the link below to create a new password:
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Best regards,
      The Team
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"ElieFreeLancer" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Reset Your Password',
      text: textContent,
      html: htmlContent,
    });
    
    console.log('Password reset email sent:', info.messageId);
    return resetToken;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};