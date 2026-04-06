const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public: Register user
router.post('/register', userController.register);
// Public: Login user
router.post('/login', userController.login);
// Admin: List all users
router.get('/', auth, role('admin'), userController.listUsers);
// Admin: Update user role/status
router.patch('/:id', auth, role('admin'), userController.updateUser);
// Admin: Delete user
router.delete('/:id', auth, role('admin'), userController.deleteUser);

module.exports = router;
