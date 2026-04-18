const express = require('express');
const {
  getPrediction,
  getHistory,
  getHistoryItem,
  getStats,
} = require('../controllers/predictionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/predict', protect, authorize('farmer', 'admin'), getPrediction);
router.get('/history', protect, authorize('farmer', 'admin'), getHistory);
router.get('/stats', protect, authorize('farmer', 'admin'), getStats);
router.get('/history/:id', protect, authorize('farmer', 'admin'), getHistoryItem);

module.exports = router;
