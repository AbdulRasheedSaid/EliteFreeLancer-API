import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/verify/session', async (req: Request, res: Response): Promise<any> => {
  try {
    // Check if user is authenticated
    if (req.isAuthenticated() && req.user) {
        const user = req.user as Express.User;
      return res.status(200).json({
        authenticated: true,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          image: req.user.image,
          // Identify auth method
          provider: req.user.googleId ? 'google' : 'local'
        }
      });
    }

    // No valid session found
    return res.status(401).json({
      authenticated: false,
      message: 'No active session found'
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({
      authenticated: false,
      message: 'Internal server error'
    });
  }
});

export default router;