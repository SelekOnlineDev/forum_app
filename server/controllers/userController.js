import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { getDb } from '../index.js';

export const registerUser = async (req, res) => {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const { name, email, password } = req.body;

    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      _id: uuidv4(),
      name,
      email,
      password: hashed,
      createdAt: new Date().toISOString(),
    };

    await users.insertOne(newUser);
    res.status(201).json({ message: 'User registered', id: newUser._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const { email, password } = req.body;
    console.log('Login attempt for:', req.body.email);

    const user = await users.findOne({ email: email });
    console.log('User found:', user); // Ar vartotojas rastas?
    if (!user) {
     console.log(`User not found: ${email}`);
     return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored hash:', user.password);
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match); // Ar slaptažodis teisingas?
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
