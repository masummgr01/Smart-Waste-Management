import express from 'express';
import {
  createPickupRequest,
  getPickupStatus,
  getMyPickupRequests,
} from '../controllers/pickupController.js';
import { getNearbyDustbins } from '../controllers/dustbinController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Pickup routes
router.post('/pickup/request', protect, upload.single('image'), createPickupRequest);
router.get('/pickup/status/:id', protect, getPickupStatus);
router.get('/pickup/my-requests', protect, getMyPickupRequests);

// Dustbin routes
router.get('/dustbins/nearby', protect, getNearbyDustbins);

export default router;




