import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log('Received token:', token); // paslėpti

  if (!token) {
    console.log('No token provided'); // paslėpti
   return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // paslėpti
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('Token verification failed:', err); // paslėpti
    return res.status(403).json({ message: 'Invalid token' });
  }
};
