import WorkerTaskLog from '../models/WorkerTaskLog.js';
import PickupRequest from '../models/PickupRequest.js';
import { emitSocketEvent } from '../services/socketService.js';

// @desc    Get worker's tasks
// @route   GET /api/v1/worker/tasks
// @access  Private (Worker)
export const getWorkerTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { workerId: req.user._id };

    if (status) {
      query.status = status;
    }

    const tasks = await WorkerTaskLog.find(query)
      .populate({
        path: 'pickupId',
        populate: {
          path: 'userId',
          select: 'name phone',
        },
      })
      .sort({ createdAt: -1 });

    // Format response
    const formattedTasks = tasks.map((task) => ({
      _id: task._id,
      pickupId: task.pickupId._id,
      pickupLocation: task.pickupId.location,
      status: task.status,
      startTime: task.startTime,
      endTime: task.endTime,
      user: {
        name: task.pickupId.userId.name,
        phone: task.pickupId.userId.phone,
      },
      notes: task.pickupId.notes,
      imageUrl: task.pickupId.imageUrl,
    }));

    res.status(200).json({
      success: true,
      count: formattedTasks.length,
      tasks: formattedTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/v1/worker/tasks/:id/status
// @access  Private (Worker)
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "in_progress" or "completed".',
      });
    }

    const task = await WorkerTaskLog.findOne({
      _id: id,
      workerId: req.user._id,
    }).populate('pickupId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Update task status
    task.status = status;
    if (status === 'in_progress' && !task.startTime) {
      task.startTime = new Date();
    }
    if (status === 'completed') {
      task.endTime = new Date();
    }
    await task.save();

    // Update pickup request status
    const pickupRequest = await PickupRequest.findById(task.pickupId._id);
    if (pickupRequest) {
      pickupRequest.status = status === 'completed' ? 'completed' : 'in_progress';
      await pickupRequest.save();

      // Emit socket event for real-time update
      emitSocketEvent('pickupStatusUpdated', {
        pickupId: pickupRequest._id,
        newStatus: pickupRequest.status,
        workerId: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully.',
      workerTaskLog: task,
      pickupRequest,
    });
  } catch (error) {
    next(error);
  }
};




