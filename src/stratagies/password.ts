import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Author from "../models/authorModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "helpers/jwtGeneration.js";

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

        const token = generateToken(author._id.toString());
        
        return done(null, { 
          ...author.toObject(), 
          _id: author._id.toString(),
          token 
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;