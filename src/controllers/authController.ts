import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createVerificationToken, sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password, bio, city, region, phone, languages, qualification } = req.body;

    console.log(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        bio,
        city: city || 'Accra',
        region: region || 'Greater Accra',
        phone,
        languages: languages || ['English'],
        qualification: qualification || ['Home School'],
        emailVerified: false, // Will be verified later
      },
    });

    console.log(user)

    // Create verification token and send email
    const verificationToken = await createVerificationToken(email);
    await sendVerificationEmail(email, name, verificationToken);

    // Generate JWT token
    const token = generateToken(user.id);

    // Create a new session
    await prisma.session.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    console.log('User Created')

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({ message: 'If your email exists in our database, you will receive a password reset link.' });
    }

    // Send password reset email
    await sendPasswordResetEmail(email, user.name);
    console.log('Reset Email Sent')

    res.status(200).json({ message: 'If your email exists in our database, you will receive a password reset link.' });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token, password } = req.body;

    // Find verification token
    const verification = await prisma.verification.findFirst({
      where: { value: token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    await prisma.user.update({
      where: { email: verification.identifier },
      data: { password: hashedPassword },
    });

    // Delete verification token
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    console.log('Password has been reseted')
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email } = req.body;

    // Check if user exists and is not already verified
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Create verification token and send email
    const verificationToken = await createVerificationToken(email);
    await sendVerificationEmail(email, user.name, verificationToken);

    res.status(200).json({ message: 'Verification email has been sent' });
  } catch (error) {
    next(error);
  }
};


// Login with email and password
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: info.message || 'Authentication failed' });
      }

      if(!user.emailVerified){
        return res.status(401).json({ message: 'Verify your email first' });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Create a new session
      await prisma.session.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          token: token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Remove password from response
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      console.log('Get current user',userWithoutPassword)
      res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

// Google OAuth login callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Create a new session
      await prisma.session.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          token: token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Redirect to frontend with token
      // You can customize this URL to your frontend app
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

// Verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.params;

    // Find verification token
    const verification = await prisma.verification.findFirst({
      where: { value: token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email: verification.identifier },
      data: { emailVerified: true },
    });

    // Delete verification token
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    console.log('Email is verified')
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

interface AuthenticatedUser {
  id: string;
  email: string;
  password?: string; // optional, since you want to remove it before sending a response
  // add other fields as needed
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // User is attached by passport middleware
    const user = req.user as AuthenticatedUser;

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    console.log('Get current user',userWithoutPassword)
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete session
    // Note: For JWT tokens, you typically don't invalidate them server-side
    // Instead, client-side should remove the token

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};