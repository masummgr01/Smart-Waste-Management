import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    // Validate and format location if provided
    let locationData = undefined;
    if (location) {
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
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.',
        });
      }

      locationData = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    }

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role: role || 'user',
      phone,
      location: locationData,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

