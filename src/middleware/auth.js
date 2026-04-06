const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// Mock authentication middleware
module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'active') return res.status(401).json({ message: 'Invalid user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
