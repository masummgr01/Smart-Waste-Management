import mongoose from 'mongoose';

const workerTaskLogSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Worker ID is required'],
      index: true,
    },
    pickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      required: [true, 'Pickup ID is required'],
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'completed'],
      default: 'assigned',
    },
    completionNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    completionPhoto: {
      type: String,
      default: null,
    },
    // Denormalized fields for faster queries
    workerName: {
      type: String,
      default: '',
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for worker queries
workerTaskLogSchema.index({ workerId: 1, status: 1, createdAt: -1 });

const WorkerTaskLog = mongoose.model('WorkerTaskLog', workerTaskLogSchema);

export default WorkerTaskLog;




