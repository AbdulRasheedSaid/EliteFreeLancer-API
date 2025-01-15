import express from "express";
import mongoose from "mongoose";
import { Port, mongoDBUrl, apiURL } from "./config.js";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from "cors";
import session from "express-session";

import author from "./routes/authorRoutes.js";
import category from "./routes/categoryRoutes.js";
import search from "./routes/search.js";
import passport from "passport"; // Passport for authentication
import authRouter from "./routes/oath.js"; // Google OAuth 2.0 Route
import passwordRouter from "./routes/authpassword.js"; // Local Auth Route
import "./stratagies/password.js";
import "./stratagies/gOath.js";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import verifySessionRouter from "./routes/verifySession.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_WEBSITE_URL, // Frontend URL
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "none", // Required for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: mongoDBUrl,
      collectionName: "sessions",
      autoRemove: "native",
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/author", author);
app.use("/api/category", category);
app.use("/search", search);
app.use("/api/auth", authRouter);
app.use("/api/auth/local", passwordRouter);
app.use("/api/auth", verifySessionRouter);

// Session verification route
app.get("/session", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(Port, () => {
      console.log(`The server is running on ${apiURL}....`);
    });
  })
  .catch((error) => console.log(error));
