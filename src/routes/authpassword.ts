import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import Author from '../models/authorModel.js';

const router = express.Router();

router.post('/register', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    // Validate request body
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email is already registered
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new author
    const author = await Author.create({
      email,
      password: hashedPassword,
      name,
    });

    console.log(author)
    return res.status(201).json({ message: 'Registration and login successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json({ message: 'Login successful' });
  }
);

router.post('/logout', (req, res) => {
  req.logout(() => {
      req.session.destroy((err) => {
          if (err) {
              return res.status(500).json({ message: 'Error logging out' });
          }
          res.clearCookie('connect.sid');
          console.log('Logged out successfully')
          res.status(200).json({ message: 'Logged out successfully' });
      });
  });
});


export default router;