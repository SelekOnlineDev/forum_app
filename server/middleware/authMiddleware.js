import jwt from 'jsonwebtoken';

// Tarpinė programinė įranga, skirta patikrinti, ar vartotojas yra autentifikuotas
// Ši funkcija tikrina, ar yra JWT tokenas ir ar jis galioja
// Jei tokenas yra teisingas, vartotojo informacija pridedama prie užklausos objekto

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Gauti Authorization antraštę iš užklausos
  console.log('Received token:', authHeader);

  if (!authHeader) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token after Bearer');
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Patikrinti tokeną
    console.log('Decoded token:', decoded); 
    req.user = { 
      id: decoded.id, 
      name: decoded.name,
      email: decoded.email
    };
    next();
  } catch (err) {
    console.error('Token verification failed:', err); 
    return res.status(403).json({ message: 'Invalid token' });
  }
};
