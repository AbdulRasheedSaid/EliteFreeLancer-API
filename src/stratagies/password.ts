import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Author from "../models/authorModel.js";
import bcrypt from "bcrypt";

passport.serializeUser((author: any, done) => {
  done(null, author._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const author = await Author.findById(id);
    if (!author) {
      console.log('no author')
      return done(null, false); // User not found
    }
    console.log({ ...author.toObject(), _id: author._id.toString() });

    done(null, { ...author.toObject(), _id: author._id.toString() });
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const author = await Author.findOne({ email }).select("+password");

        if (!author) {
          return done(null, false, { message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, author.password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        
        // Create session
        const sessionId = author._id.toString();
        await Author.findByIdAndUpdate(author._id, {
          $push: { 
            sessions: { 
              sessionId
            }
          }
        });

        console.log({ ...author.toObject(), _id: author._id.toString() });
        return done(null, { ...author.toObject(), _id: author._id.toString() });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;