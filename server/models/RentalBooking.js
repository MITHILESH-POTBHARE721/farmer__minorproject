const mongoose = require('mongoose');

const RentalBookingSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  renter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date'],
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate that endDate is after startDate
RentalBookingSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('RentalBooking', RentalBookingSchema);
