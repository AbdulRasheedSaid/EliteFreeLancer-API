import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleCallback,
  verifyEmail,
  getCurrentUser,
  logout,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';

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
router.post('/resend-verification', resendVerificationEmail);

// Add this new route for frontend to request verification email
router.post('/send-verification', resendVerificationEmail);

// Password reset - rename for consistency with frontend
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  getCurrentUser
);

// Logout
router.post('/logout', logout);

export default router;