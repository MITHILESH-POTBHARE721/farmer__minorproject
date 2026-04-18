const express = require('express');
const {
  getSchemes,
  getScheme,
  createScheme,
  updateScheme,
  deleteScheme,
  getCategories,
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSchemes);
router.get('/categories', getCategories);
router.get('/:id', getScheme);
router.post('/', protect, authorize('admin'), createScheme);
router.put('/:id', protect, authorize('admin'), updateScheme);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

module.exports = router;
