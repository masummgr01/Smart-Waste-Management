import mongoose from 'mongoose';

const dustbinSchema = new mongoose.Schema(
  {
    hardwareId: {
      type: String,
      sparse: true, // Allows multiple nulls
      trim: true,
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
    fillLevel: {
      type: Number,
      required: [true, 'Fill level is required'],
      min: 0,
      max: 100,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location-based queries
dustbinSchema.index({ location: '2dsphere' });

// Index for hardware ID (unique, sparse)
dustbinSchema.index({ hardwareId: 1 }, { unique: true, sparse: true });

const Dustbin = mongoose.model('Dustbin', dustbinSchema);

export default Dustbin;

