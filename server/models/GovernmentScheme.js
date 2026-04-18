const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add scheme title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add scheme description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please select category'],
    enum: ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other'],
  },
  eligibility: [{
    type: String,
    required: true,
  }],
  benefits: [{
    type: String,
    required: true,
  }],
  applicableStates: [{
    type: String,
    required: true,
  }],
  deadline: {
    type: Date,
  },
  applicationLink: {
    type: String,
  },
  documentsRequired: [{
    type: String,
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for search
GovernmentSchemeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
