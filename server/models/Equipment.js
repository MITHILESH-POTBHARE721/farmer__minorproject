const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add equipment name'],
    trim: true,
    maxlength: [100, 'Equipment name cannot be more than 100 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please select equipment type'],
    enum: ['tractor', 'harvester', 'seeder', 'sprayer', 'tiller', 'tools', 'other'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative'],
    default: 0,
  },
  dailyRate: {
    type: Number,
    min: [0, 'Daily rate cannot be negative'],
    default: 0,
  },
  images: [{
    type: String,
  }],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    state: {
      type: String,
      required: [true, 'Please add state'],
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
    },
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bookedDates: [{
      type: Date,
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
