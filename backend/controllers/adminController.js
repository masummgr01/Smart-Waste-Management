import PickupRequest from '../models/PickupRequest.js';
import WorkerTaskLog from '../models/WorkerTaskLog.js';
import User from '../models/User.js';
import { optimizeRoute } from '../utils/routeOptimizer.js';
import { emitSocketEvent } from '../services/socketService.js';

// @desc    Get all pickup requests
// @route   GET /api/v1/admin/pickups
// @access  Private (Admin)
export const getAllPickups = async (req, res, next) => {
  try {
    const { status, workerId } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (workerId) {
      query.workerId = workerId;
    }

    const pickups = await PickupRequest.find(query)
      .populate('userId', 'name email phone')
      .populate('workerId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign pickup to worker
// @route   POST /api/v1/admin/assign/:pickupId
// @access  Private (Admin)
export const assignPickupToWorker = async (req, res, next) => {
  try {
    const { pickupId } = req.params;
    const { workerId } = req.body;

    // Validate worker exists and is a worker
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({
        success: false,
        message: 'Worker not found.',
      });
    }

    // Get pickup request
    const pickupRequest = await PickupRequest.findById(pickupId);
    if (!pickupRequest) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found.',
      });
    }

    if (pickupRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Pickup request is already assigned or completed.',
      });
    }

    // Update pickup request
    pickupRequest.workerId = workerId;
    pickupRequest.status = 'assigned';
    pickupRequest.workerName = worker.name;
    await pickupRequest.save();

    // Create worker task log
    const workerTaskLog = await WorkerTaskLog.create({
      workerId,
      pickupId,
      status: 'assigned',
      workerName: worker.name,
      pickupLocation: pickupRequest.location,
    });

    // Emit socket event for real-time update
    emitSocketEvent('pickupAssigned', {
      pickupRequest,
      workerId,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup assigned successfully.',
      pickupRequest,
      workerTaskLog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Optimize route for pickups
// @route   POST /api/v1/admin/route/optimize
// @access  Private (Admin)
export const optimizeRouteForPickups = async (req, res, next) => {
  try {
    const { pickupIds, startLocation } = req.body;

    if (!pickupIds || pickupIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide pickup IDs to optimize.',
      });
    }

    // Get pickup requests
    const pickups = await PickupRequest.find({
      _id: { $in: pickupIds },
    });

    if (pickups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No pickup requests found.',
      });
    }

    // Optimize route
    const optimizedRoute = await optimizeRoute(pickups, startLocation);

    res.status(200).json({
      success: true,
      optimizedRoute,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 7 days for daily, last 4 weeks for weekly
      const days = period === 'weekly' ? 28 : 7;
      dateFilter.createdAt = {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      };
    }

    // Get pickup statistics
    const totalPickups = await PickupRequest.countDocuments(dateFilter);
    const completedPickups = await PickupRequest.countDocuments({
      ...dateFilter,
      status: 'completed',
    });
    const pendingPickups = await PickupRequest.countDocuments({
      ...dateFilter,
      status: 'pending',
    });
    const assignedPickups = await PickupRequest.countDocuments({
      ...dateFilter,
      status: 'assigned',
    });

    // Calculate average completion time
    const completedTasks = await WorkerTaskLog.find({
      status: 'completed',
      endTime: { $exists: true },
      ...dateFilter,
    });

    let averageCompletionTime = 0;
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        const duration = task.endTime - task.startTime;
        return sum + duration;
      }, 0);
      averageCompletionTime = Math.round(totalTime / completedTasks.length / 1000 / 60); // in minutes
    }

    // Worker performance
    const workerPerformance = await WorkerTaskLog.aggregate([
      {
        $match: {
          status: 'completed',
          endTime: { $exists: true },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$workerId',
          completed: { $sum: 1 },
          avgTime: {
            $avg: {
              $subtract: ['$endTime', '$startTime'],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'worker',
        },
      },
      {
        $unwind: '$worker',
      },
      {
        $project: {
          workerId: '$_id',
          name: '$worker.name',
          completed: 1,
          avgTime: { $divide: ['$avgTime', 1000 * 60] }, // Convert to minutes
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalPickups,
        completedPickups,
        pendingPickups,
        assignedPickups,
        averageCompletionTime: `${averageCompletionTime}min`,
        workerPerformance: workerPerformance.map((wp) => ({
          ...wp,
          avgTime: `${Math.round(wp.avgTime)}min`,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workers
// @route   GET /api/v1/admin/workers
// @access  Private (Admin)
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await User.find({ role: 'worker' }).select(
      'name email phone location'
    );

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    next(error);
  }
};




