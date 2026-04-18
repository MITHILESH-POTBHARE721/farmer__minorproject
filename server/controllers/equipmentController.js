const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getEquipment = async (req, res) => {
  try {
    let query = {};

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by state
    if (req.query.state) {
      query['location.state'] = req.query.state;
    }

    // Filter by availability
    if (req.query.available === 'true') {
      query['availability.isAvailable'] = true;
    }

    // Filter by owner
    if (req.query.owner) {
      query.owner = req.query.owner;
    }

    const equipment = await Equipment.find(query)
      .populate('owner', 'name phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
exports.getSingleEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      'owner',
      'name phone address'
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private (Farmer only)
exports.createEquipment = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user.id;

    // Parse location if it's sent as a JSON string
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format',
        });
      }
    }

    // Handle images
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const equipment = await Equipment.create(req.body);

    res.status(201).json({
      success: true,
      data: equipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Farmer only)
exports.updateEquipment = async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Make sure user is equipment owner
    if (
      equipment.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this equipment',
      });
    }

    // Parse location if it's sent as a JSON string
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format',
        });
      }
    }

    // Handle images
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Farmer only)
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Make sure user is equipment owner
    if (
      equipment.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this equipment',
      });
    }

    await equipment.deleteOne();

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

// @desc    Get owner's equipment
// @route   GET /api/equipment/my-equipment
// @access  Private (Farmer only)
exports.getMyEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};