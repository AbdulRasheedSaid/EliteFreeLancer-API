// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import Author from '../models/authorModel.js';
// import dotenv from 'dotenv';

// dotenv.config();

// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//   throw new Error('Missing Google OAuth credentials');
// }

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.API_WEBSITE_URL}/api/auth/callback/google`,
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         let author = await Author.findOne({ googleId: profile.id });
//         if (!author) {
//           author = await Author.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             image: profile.photos[0].value,
//             bio: "Google OAuth User",
//             languages: ["English"],
//             country: profile._json?.locale || "Not specified",
//           });
//         }
//         return done(null, author);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await Author.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// export default passport;