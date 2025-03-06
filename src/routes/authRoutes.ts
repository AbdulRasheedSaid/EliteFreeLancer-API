import express from 'express';
import passport from 'passport';
import { register, login, googleCallback, verifyEmail, getCurrentUser, logout } from '../controllers/authController.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login with email and password
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleCallback);

// Email verification
router.get('/verify/:token', verifyEmail);

// Protected routes
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  getCurrentUser
);

// Logout
router.post('/logout', logout);

export default router;