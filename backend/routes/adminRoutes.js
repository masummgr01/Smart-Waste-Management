import express from 'express';
import {
  getAllPickups,
  assignPickupToWorker,
  optimizeRouteForPickups,
  getAnalytics,
  getAllWorkers,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/pickups', getAllPickups);
router.post('/assign/:pickupId', assignPickupToWorker);
router.post('/route/optimize', optimizeRouteForPickups);
router.get('/analytics', getAnalytics);
router.get('/workers', getAllWorkers);

export default router;




