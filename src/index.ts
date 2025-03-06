import express from "express";
import mongoose from "mongoose";
import { Port, mongoDBUrl, apiURL } from "./config/config.js";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";

import author from "./routes/authRoutes.js";
import gig from "./routes/gigRoutes.js";
import search from "./routes/search.js";
import cors from "cors";

import authRouter from "./routes/authentication/emailAndPassword/authRouter.js";
import passwordRouter from "./routes/authentication/emailAndPassword/authpassword.js";
import "./stratagies/password.js";
import "./stratagies/gOath.js";
import dotenv from "dotenv";
import authenticateToken from "./routes/verifySession.js";

import { toNodeHandler } from "better-auth/node";
import { auth } from "lib/auth.js";

import userRoutes from "./routes/userRouter.js";
import passport from "config/passport.js";
import authRoutes from 'routes/authRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_WEBSITE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Initialize passport
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Routes
app.use("/api/author", author);
app.use("/api/gig", gig);
app.use("/search", search);

app.use("/api/auth", authRouter);

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/users", userRoutes);

app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.get("/set-cookie", (req, res) => {
  // Set a cookie named "testCookie" with the value "HelloWorld"
  res.cookie("testCookie", "HelloWorld", {
    maxAge: 1000 * 60 * 5, // Cookie expires in 5 minutes
    httpOnly: true,        // Prevents client-side JavaScript from accessing the cookie
    sameSite: "lax",       // Adjust SameSite as needed (e.g., "lax", "strict", or "none")
    secure: false,         // Set to true if using HTTPS; for local testing over HTTP, use false
  });
  res.json({ message: "Cookie set successfully" });
});

app.use(express.json());

  app.listen(Port, () => {
    console.log(`The server is running on ${apiURL}....`);
  });