import express from "express";
import { auth } from "lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const signup = async (req: express.Request, res: express.Response) =>{
  try {
    console.log("Connected", req.body)
    // BetterAuth expects the payload to include email, password, name, and callbackURL (if needed)
    const { email, password, name } = req.body;
    
    // Use the BetterAuth signup functionality (here we indicate it's an email signup)
    const result = await auth.api.signUpEmail({
      headers: fromNodeHeaders(req.headers),
      method: "POST",
      body: {
        email,
        password,
        name,
      },
 
    });

    console.log("Succsess: ", result)
    res.json(result);
  }  catch (error: any) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
}

export const signIn = async (req: express.Request, res: express.Response) =>{
    try {
      console.log("Connected", req.body)
      // BetterAuth expects the payload to include email, password, name, and callbackURL (if needed)
      const { email, password } = req.body;
      
      // Use the BetterAuth signup functionality (here we indicate it's an email signup)
      const result = await auth.api.signInEmail({
        headers: fromNodeHeaders(req.headers),
        method: "POST",
        body: {
          email,
          password,
        },
        asResponse: true
      });

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          sessions: {
            orderBy: { createdAt: 'desc' }, // Order sessions with the newest first
            take: 1, // Limit to the newest session only
          },
        },
      });
    
      // Ensure the user and session exist
      if (!user || user.sessions.length === 0) {
        throw new Error('No sessions found for this user.');
      }
    
      // Access the token from the newest session
      const newestSessionToken = user.sessions[0].token;

      // Set a cookie named "testCookie" with the value "HelloWorld"
      res.cookie("session_token", newestSessionToken, {
        maxAge: 1000 * 60 * 5, // Cookie expires in 5 minutes
        httpOnly: true,        // Prevents client-side JavaScript from accessing the cookie
        sameSite: "lax",       // Adjust SameSite as needed (e.g., "lax", "strict", or "none")
        secure: false,         // Set to true if using HTTPS; for local testing over HTTP, use false
      });
  
      console.log("Succsess: ", result)
      res.json(result);
    }  catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ error: error.message });
    }
}

export const session = async (req: express.Request, res: express.Response) =>{
  try {
    console.log(req.headers, fromNodeHeaders(req.headers), req.cookies, req.body)
    // Better Auth's helper converts Node headers to the format it expects
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log("Session : ", session)
    res.json(session);
  } catch (error: any) {
    console.error("Error getting session:", error);
    res.status(500).json({ error: error.message });
  }
}

export const sessionTry = async (req: express.Request, res: express.Response) =>{
  try {
    const { session } = req.body;
    
    const checkSession = await prisma.session.findFirst({
      where: { token: session },
      include: { 
        user: { 
          select: { name: true, email: true, image:true }  // Only select name and email
        },
      },  
    })

    if (!checkSession || !checkSession.user) {
      console.log("Session not set or user not found");
      res.status(500).json("User not found!!!");
    }

    const data = checkSession.user;
    res.status(200).json(data)
  } catch (error: any) {
    console.error("Error getting session:", error);
    res.status(500).json({ error: error.message });
  }
}
