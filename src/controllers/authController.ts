import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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

    // Create verification token
    const verificationToken = crypto.randomUUID();
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

    // TODO: Send verification email here

    // Generate JWT token
    const token = generateToken(user.id);

    

    // Create a new session
    await prisma.session.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token,
    });
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

      // Generate JWT token
      const token = generateToken(user.id);

      // Create a new session
      await prisma.session.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Remove password from response
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

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