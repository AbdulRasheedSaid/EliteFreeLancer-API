import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/callback/google',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_WEBSITE_URL}/user/login`,
    successRedirect: process.env.FRONTEND_WEBSITE_URL
  })
);

router.get('/logout/google', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      res.redirect(process.env.FRONTEND_WEBSITE_URL || '/');
    });
  });
});

export default router;