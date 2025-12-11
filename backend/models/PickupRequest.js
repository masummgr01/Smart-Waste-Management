import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
      },
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Denormalized fields for faster queries
    userName: {
      type: String,
      default: '',
    },
    workerName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location-based queries
pickupRequestSchema.index({ location: '2dsphere' });

// Compound index for common queries
pickupRequestSchema.index({ status: 1, createdAt: -1 });
pickupRequestSchema.index({ workerId: 1, status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);

export default PickupRequest;




