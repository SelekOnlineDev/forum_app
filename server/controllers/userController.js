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
    if (existing) {
      console.log('User already exists:', email);
    return res.status(400).json({ message: 'User already exists' });
    };

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      _id: uuidv4(),
      name,
      email,
      password: hashed,
      createdAt: new Date().toISOString(),
    };

     const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

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
    console.log('Login attempt for:', email);

    const user = await users.findOne({ email: email });
    console.log('User found:', user); // Ar vartotojas rastas?
    if (!user) {
     console.log(`User not found: ${email}`);
     return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored hash:', user.password);
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match); // Ar slaptažodis teisingas?
    if (!match) {
     console.log('Invalid password for user:', email);
     return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign ({ id: user._id, name: user.name, email: user.email }, 
    process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful for user:', email);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const { name, email } = req.body;
    const userId = req.user.id;

    // Patikrinu ar email jau naudojamas ar ne

    const existing = await users.findOne({ email, _id: { $ne: userId } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const result = await users.updateOne(
      { _id: userId },
      { $set: { name, email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = await api.patch('/user/profile', { name, email });

    const updatedUser = await users.findOne({ _id: userId });
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email
      }
    });

    res.status(200).json({ message: 'Profile updated', user: { name, email } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const response = await api.patch('/user/password', {
      currentPassword: password,
      newPassword
    });

    // Randu vartotoją

    const user = await users.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Tikrinu slaptažodį

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

    // Šifruoju naują slaptažodį

    const hashed = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { _id: userId },
      { $set: { password: hashed } }
    );

    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
