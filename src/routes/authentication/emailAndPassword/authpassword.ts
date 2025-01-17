import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import Author from '../../../models/authorModel.js';
import { generateToken } from "helpers/jwtGeneration.js";
const router = express.Router();

router.post('/register', async (req: express.Request, res:express.Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const author = await Author.create({
      email,
      password: hashedPassword,
      name,
      bio: `Hi, I'm ${name}`,
    });

    const token = generateToken(author._id.toString());

    console.log('Registration successful')

    res.status(201).json({ 
      message: 'Registration successful',
      token,
      user: {
        id: author._id,
        name: author.name,
        email: author.email
      }
    });
  } catch (error) {
    console.log('Error registering user')
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login',
  passport.authenticate('local', { session: false }),
  (req: express.Request & { user: { _id: string } }, res: express.Response) => {
    const token = generateToken(req.user._id);
    console.log('Login successful')
    res.json({ 
      message: 'Login successful',
      token,
      user: req.user
    });
  }
);

router.post("logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully." });
});

export default router;