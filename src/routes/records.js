const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Create record (admin only)
router.post('/', auth, role('admin'), recordController.createRecord);
// Get all records (analyst, admin)
router.get('/', auth, role(['analyst', 'admin']), recordController.getRecords);
// Get single record (analyst, admin)
router.get('/:id', auth, role(['analyst', 'admin']), recordController.getRecord);
// Update record (admin only)
router.patch('/:id', auth, role('admin'), recordController.updateRecord);
// Delete record (admin only)
router.delete('/:id', auth, role('admin'), recordController.deleteRecord);

module.exports = router;
