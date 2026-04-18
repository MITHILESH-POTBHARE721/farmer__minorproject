const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/my-products', protect, authorize('farmer', 'admin'), getMyProducts);
router.get('/:id', getProduct);
router.post(
  '/',
  protect,
  authorize('farmer', 'admin'),
  uploadMultiple('images', 5),
  createProduct
);
router.put(
  '/:id',
  protect,
  authorize('farmer', 'admin'),
  uploadMultiple('images', 5),
  updateProduct
);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;
