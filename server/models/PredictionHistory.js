const mongoose = require('mongoose');

const PredictionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  inputData: {
    soilType: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    irrigation: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    nitrogen: {
      type: Number,
    },
    phosphorus: {
      type: Number,
    },
    potassium: {
      type: Number,
    },
    ph: {
      type: Number,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    rainfall: {
      type: Number,
      required: true,
    },
  },
  predictions: [{
    crop: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PredictionHistory', PredictionHistorySchema);
