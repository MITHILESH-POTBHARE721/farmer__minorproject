const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['grains', 'vegetables', 'fruits', 'dairy', 'other'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [0, 'Quantity cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit'],
    enum: ['kg', 'quintal', 'ton', 'liter', 'piece', 'dozen'],
  },
  images: [{
    type: String,
  }],
  farmer: {
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
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for search
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
