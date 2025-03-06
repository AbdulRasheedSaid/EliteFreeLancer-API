// auth.ts
import { betterAuth } from "better-auth"; 
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
// import { sendEmail } from "./email.js"; // Import your email sending function

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", etc.
  }),
  emailAndPassword: {  
    enabled: true,
    // requireEmailVerification: true,
    // Example: send a reset password email using the sendEmail function.
    // sendResetPassword: async ({ user, url, token }, request) => {
    //   await sendEmail({
    //     to: user.email,
    //     subject: 'Reset your password',
    //     text: `Click the link to reset your password: ${url}`,
    //     // Alternatively, you can include HTML:
    //     // html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
    //   });
    // }
  },
//   emailVerification: {
//     sendVerificationEmail: async ( { user, url, token }, request) => {
//       await sendEmail({
//         to: user.email,
//         subject: "Verify your email address",
//         text: `Click the link to verify your email: ${url}`,
//       });
//     },
//   },
  socialProviders: { 
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    } 
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: "localhost:3000.com" // Optional. Defaults to the base url domain
  },
    cookies: {
        session_token: {
            name: "session_token",
            attributes: {
                // Set custom cookie attributes
                maxAge: 604800000,
                httpOnly: true,
                path: '/',
                domain: 'localhost:3000', // Explicitly set domain for localhost
                sameSite: 'lax',
                secure: false // Set to true if using HTTPS
            }
        },
    }
  },
  crossSubDomainCookies: {
    enabled: true,
  },
  rateLimit: {
    storage: "database",
    modelName: "rateLimit", // optional: by default, "rateLimit" is used
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  user: {
    deleteUser: {
      enabled: true
    }
  },
});
