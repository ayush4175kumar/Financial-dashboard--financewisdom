const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All dashboard endpoints: analyst and admin
router.get('/summary', auth, role(['analyst', 'admin']), dashboardController.summary);
router.get('/category-totals', auth, role(['analyst', 'admin']), dashboardController.categoryTotals);
router.get('/recent', auth, role(['analyst', 'admin']), dashboardController.recentActivity);
router.get('/trends', auth, role(['analyst', 'admin']), dashboardController.trends);

module.exports = router;
