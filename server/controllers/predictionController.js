const axios = require('axios');
const PredictionHistory = require('../models/PredictionHistory');

// @desc    Get crop prediction
// @route   POST /api/predictions/predict
// @access  Private (Farmer only)
exports.getPrediction = async (req, res) => {
  try {
    const {
      soilType,
      season,
      irrigation,
      location,
      nitrogen,
      phosphorus,
      potassium,
      ph,
    } = req.body;

    // Call ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
    
    const response = await axios.post(`${mlServiceUrl}/predict`, {
      soil_type: soilType,
      season: season,
      irrigation: irrigation,
      location: location,
      nitrogen: nitrogen || 50,
      phosphorus: phosphorus || 50,
      potassium: potassium || 50,
      ph: ph || 6.5,
    });

    const { predictions, weather } = response.data;

    // Save prediction to history
    const predictionHistory = await PredictionHistory.create({
      user: req.user.id,
      inputData: {
        soilType,
        season,
        irrigation,
        location,
        nitrogen: nitrogen || 50,
        phosphorus: phosphorus || 50,
        potassium: potassium || 50,
        ph: ph || 6.5,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
      },
      predictions,
    });

    res.status(200).json({
      success: true,
      data: {
        predictions,
        weather,
        historyId: predictionHistory._id,
      },
    });
  } catch (err) {
    console.error('Prediction error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error getting prediction from ML service',
      error: err.message,
    });
  }
};

// @desc    Get prediction history for user
// @route   GET /api/predictions/history
// @access  Private (Farmer only)
exports.getHistory = async (req, res) => {
  try {
    const history = await PredictionHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single prediction from history
// @route   GET /api/predictions/history/:id
// @access  Private (Farmer only)
exports.getHistoryItem = async (req, res) => {
  try {
    const prediction = await PredictionHistory.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found',
      });
    }

    // Make sure user owns this prediction
    if (prediction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this prediction',
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get prediction statistics
// @route   GET /api/predictions/stats
// @access  Private (Farmer only)
exports.getStats = async (req, res) => {
  try {
    const stats = await PredictionHistory.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$predictions' },
      {
        $group: {
          _id: '$predictions.crop',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$predictions.confidence' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
