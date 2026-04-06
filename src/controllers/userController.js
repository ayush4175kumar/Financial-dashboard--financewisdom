const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.status !== 'active') return res.status(403).json({ message: 'User inactive' });
    const token = jwt.sign({ id: user._id, username:user.username, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) { next(err); }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, status }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, username: user.username, role: user.role, status: user.status });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};
