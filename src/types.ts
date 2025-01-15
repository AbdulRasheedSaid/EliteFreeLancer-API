import { Express } from 'express-serve-static-core'

declare global {
  namespace Express {
    interface User {
      _id: string;
      name: string;
      email: string;
      image?: string;
      googleId?: string;
    }
  }
}