import { client } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = client.db(process.env.DB_NAME);
const users = db.collection('users');

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await users.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    name,
    email,
    password: hashed,
    createdAt: new Date(),
  };

  await users.insertOne(newUser);
  res.status(201).json({ message: 'User registered' });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: 'One week' });
  res.json({ token, user: { id: user._id, name: user.name } });
};
