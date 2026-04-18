const GovernmentScheme = require('../models/GovernmentScheme');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
exports.getSchemes = async (req, res) => {
  try {
    let query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by state
    if (req.query.state) {
      query.applicableStates = { $in: [req.query.state, 'All India'] };
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const schemes = await GovernmentScheme.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public
exports.getScheme = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new scheme
// @route   POST /api/schemes
// @access  Private (Admin only)
exports.createScheme = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.create(req.body);

    res.status(201).json({
      success: true,
      data: scheme,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Private (Admin only)
exports.updateScheme = async (req, res) => {
  try {
    let scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    scheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Admin only)
exports.deleteScheme = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    await scheme.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get scheme categories
// @route   GET /api/schemes/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await GovernmentScheme.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
