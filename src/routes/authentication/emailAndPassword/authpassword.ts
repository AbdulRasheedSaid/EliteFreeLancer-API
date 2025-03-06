import express, { Request, Response } from "express";
import session from "express-session";
import { APIError } from "better-auth/api";
import { Prisma, PrismaClient } from "@prisma/client";
import pgSession from "connect-pg-simple";
import { SessionOptions } from "express-session";
import { auth } from "lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}
const router = express.Router();


// Configure session store using PostgreSQL
const PgSession = pgSession(session);
const sessionConfig: SessionOptions = {
  store: new PgSession({
    conString: process.env.DATABASE_URL!, // Use your Neon PostgreSQL URL
  }),
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};
router.use(session(sessionConfig));

interface SignIn {
  email: string,
  password: string,
  name: string
}

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name }: SignIn = req.body;
  try {
    const response = await auth.api.signInEmail({
      body: {
          email,
          password,
          name
      },
      asResponse: true
  })

    const hashedPassword = await auth.hashPassword(password);

    const prisma = new PrismaClient()
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status)
    }
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login user and start session
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await auth.verifyPassword(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  // Create a session
  req.session.userId = user.id;
  req.session.save(() => {
    res.json({ message: "Login successful", userId: user.id });
  });

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
return res.json(session);
});

// Logout user and destroy session
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

// Protected route
router.get("/protected", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ message: "You have access!", userId: req.session.userId });
});

export default router;
