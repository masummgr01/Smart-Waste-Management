import express from 'express';
import {
  getWorkerTasks,
  updateTaskStatus,
} from '../controllers/workerController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All worker routes require authentication and worker role
router.use(protect);
router.use(authorize('worker'));

router.get('/tasks', getWorkerTasks);
router.patch('/tasks/:id/status', updateTaskStatus);

export default router;




