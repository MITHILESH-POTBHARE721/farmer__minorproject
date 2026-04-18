const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateStatus,
  getMySales,
  confirmPaymentReceived,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getOrders);
router.get('/my-sales', protect, authorize('farmer', 'admin'), getMySales);
router.get('/:id', protect, getOrder);
router.post('/', protect, authorize('buyer', 'admin'), createOrder);
router.put('/:id/status', protect, authorize('farmer', 'admin'), updateStatus);
router.put('/:id/payment-received', protect, authorize('farmer', 'admin'), confirmPaymentReceived);

module.exports = router;
