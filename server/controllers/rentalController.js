const RentalBooking = require('../models/RentalBooking');
const Equipment = require('../models/Equipment');

// @desc    Get all rentals for logged in user
// @route   GET /api/rentals
// @access  Private
exports.getRentals = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, only show their rentals
    if (req.user.role !== 'admin') {
      query.$or = [{ renter: req.user.id }, { owner: req.user.id }];
    }

    const rentals = await RentalBooking.find(query)
      .populate('equipment', 'name type images dailyRate hourlyRate')
      .populate('renter', 'name phone email')
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single rental
// @route   GET /api/rentals/:id
// @access  Private
exports.getRental = async (req, res) => {
  try {
    const rental = await RentalBooking.findById(req.params.id)
      .populate('equipment', 'name type images dailyRate hourlyRate location')
      .populate('renter', 'name phone email address')
      .populate('owner', 'name phone email address');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Make sure user is involved in rental or is admin
    if (
      rental.renter._id.toString() !== req.user.id &&
      rental.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this rental',
      });
    }

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new rental request
// @route   POST /api/rentals
// @access  Private (Buyer only)
exports.createRental = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, message } = req.body;

    // Get equipment details
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Check if equipment is available
    if (!equipment.availability.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is not available for rent',
      });
    }

    // Check if user is not the owner
    if (equipment.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own equipment',
      });
    }

    // Calculate total amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = equipment.dailyRate * days;

    const rental = await RentalBooking.create({
      equipment: equipmentId,
      renter: req.user.id,
      owner: equipment.owner,
      startDate,
      endDate,
      totalAmount,
      message,
    });

    res.status(201).json({
      success: true,
      data: rental,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update rental status (approve/reject)
// @route   PUT /api/rentals/:id/status
// @access  Private (Owner only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let rental = await RentalBooking.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Make sure user is the owner
    if (rental.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this rental',
      });
    }

    rental.status = status;
    await rental.save();

    // If approved, add dates to equipment's booked dates
    if (status === 'approved') {
      const equipment = await Equipment.findById(rental.equipment);
      const dates = [];
      let currentDate = new Date(rental.startDate);
      const endDate = new Date(rental.endDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      equipment.availability.bookedDates.push(...dates);
      await equipment.save();
    }

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Cancel rental
// @route   PUT /api/rentals/:id/cancel
// @access  Private (Renter only)
exports.cancelRental = async (req, res) => {
  try {
    const rental = await RentalBooking.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Make sure user is the renter
    if (rental.renter.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this rental',
      });
    }

    // Can only cancel pending rentals
    if (rental.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending rentals',
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
