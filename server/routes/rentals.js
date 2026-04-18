const express = require('express');
const {
  getRentals,
  getRental,
  createRental,
  updateStatus,
  cancelRental,
} = require('../controllers/rentalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getRentals);
router.get('/:id', protect, getRental);
router.post('/', protect, authorize('buyer', 'admin'), createRental);
router.put('/:id/status', protect, authorize('farmer', 'admin'), updateStatus);
router.put('/:id/cancel', protect, authorize('buyer', 'admin'), cancelRental);

module.exports = router;
