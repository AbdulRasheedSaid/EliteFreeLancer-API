import { Request, Response, NextFunction, Router } from 'express';
import { verifyToken } from 'helpers/jwtGeneration.js';
import Author from 'models/authorModel.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface DecodedToken {
  id: string;
  [key: string]: any;
}

const router = Router();

router.get('/verify/session', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Invalid authorization header format',
      author: { isAuthenticated: false }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as DecodedToken;
    console.log('Decoded token:', decoded);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ 
        message: 'Invalid token structure', 
        author: { isAuthenticated: false } 
      });
    }

    req.user = decoded;
    const { id } = req.user;

    const user = await Author.findById(id);
    if (!user) {
      console.log('No User with that ID');
      return res.status(401).json({
        message: 'User not found',
        author: { isAuthenticated: false }
      });
    }

    return res.status(200).json({
      message: 'Session verified successfully',
      author: {
        email: user.email,
        name: user.name,
        image: user.image,
        isAuthenticated: true
      }
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(401).json({
      message: 'Invalid token',
      author: { isAuthenticated: false }
    });
  }
});

export default router;