import Dustbin from '../models/Dustbin.js';

// @desc    Get nearby dustbins
// @route   GET /api/v1/dustbins/nearby
// @access  Private (User)
export const getNearbyDustbins = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude.',
      });
    }

    const dustbins = await Dustbin.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
      isActive: true,
    }).sort({ fillLevel: -1 }); // Sort by fill level (highest first)

    res.status(200).json({
      success: true,
      count: dustbins.length,
      dustbins,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all dustbins (Admin)
// @route   GET /api/v1/dustbins
// @access  Private (Admin)
export const getAllDustbins = async (req, res, next) => {
  try {
    const dustbins = await Dustbin.find().sort({ fillLevel: -1 });

    res.status(200).json({
      success: true,
      count: dustbins.length,
      dustbins,
    });
  } catch (error) {
    next(error);
  }
};




