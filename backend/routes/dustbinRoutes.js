import express from 'express';
import { getAllDustbins } from '../controllers/dustbinController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin-only route
router.get('/', protect, authorize('admin'), getAllDustbins);

export default router;




