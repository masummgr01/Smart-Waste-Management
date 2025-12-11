import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';
import { uploadImage } from '../services/cloudinaryService.js';
import fs from 'fs';

// @desc    Create pickup request
// @route   POST /api/v1/pickup/request
// @access  Private (User)
export const createPickupRequest = async (req, res, next) => {
  try {
    let { location, notes } = req.body;
    let imageUrl = null;

    // Parse location if it's a JSON string (from FormData)
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format. Please provide valid coordinates.',
        });
      }
    }

    // Validate location coordinates
    if (!location || typeof location !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Location is required. Please provide valid coordinates.',
      });
    }

    const lng = typeof location.lng === 'number' ? location.lng : parseFloat(location.lng);
    const lat = typeof location.lat === 'number' ? location.lat : parseFloat(location.lat);

    // Validate that coordinates are valid numbers
    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location coordinates. Please provide valid latitude and longitude.',
      });
    }

    // Validate coordinate ranges
    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude. Must be between -180 and 180.',
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude. Must be between -90 and 90.',
      });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        imageUrl = await uploadImage(req.file.path, 'waste-management/pickups');
        
        // Delete temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        // Clean up temp file if upload fails
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        throw new Error('Image upload failed');
      }
    }

    // Get user name for denormalization
    const user = await User.findById(req.user._id);

    const pickupRequest = await PickupRequest.create({
      userId: req.user._id,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      imageUrl,
      notes,
      userName: user.name,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully.',
      pickupRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pickup request status
// @route   GET /api/v1/pickup/status/:id
// @access  Private (User - own requests, Admin - all)
export const getPickupStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pickupRequest = await PickupRequest.findById(id)
      .populate('userId', 'name email phone')
      .populate('workerId', 'name phone');

    if (!pickupRequest) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found.',
      });
    }

    // Check authorization: user can only see their own requests unless admin
    if (
      req.user.role !== 'admin' &&
      pickupRequest.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request.',
      });
    }

    res.status(200).json({
      success: true,
      pickupRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's pickup requests
// @route   GET /api/v1/pickup/my-requests
// @access  Private (User)
export const getMyPickupRequests = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('workerId', 'name phone');

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    next(error);
  }
};

