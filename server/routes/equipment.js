const express = require('express');
const {
  getEquipment,
  getSingleEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getMyEquipment,
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.get('/', getEquipment);
router.get(
  '/my-equipment',
  protect,
  authorize('farmer', 'admin'),
  getMyEquipment
);
router.get('/:id', getSingleEquipment);
router.post(
  '/',
  protect,
  authorize('farmer', 'admin'),
  uploadMultiple('images', 5),
  createEquipment
);
router.put(
  '/:id',
  protect,
  authorize('farmer', 'admin'),
  uploadMultiple('images', 5),
  updateEquipment
);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteEquipment);

module.exports = router;
