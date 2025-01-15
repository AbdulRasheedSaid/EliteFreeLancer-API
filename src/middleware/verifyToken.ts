import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'helpers/jwtGeneration.js';

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log('decoded', req.user)
    next();
  } catch (error) {
    console.log('Not Verified:', error)
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default checkToken