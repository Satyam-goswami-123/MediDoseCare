const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medidose_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log out and in again.' });
    }
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
};

module.exports = authMiddleware;
