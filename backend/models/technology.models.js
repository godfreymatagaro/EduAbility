const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const technologySchema = new mongoose.Schema({
  techId: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  keyFeatures: {
    type: String,
    required: true,
  },
  systemRequirements: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['visual', 'auditory', 'physical', 'cognitive'],
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    enum: ['free', '$1-$50', '$51-$200', '$200+'],
    required: true,
  },
  evaluation: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
  inputs: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  featureComparison: {
    security: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    integration: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    support: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    userManagement: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    api: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    webhooks: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
    community: {
      type: String,
      enum: ['Yes', 'No', 'true', 'false'],
      required: true,
    },
  },
  coreVitals: {
    easeOfUse: { type: Number, required: true, min: 1, max: 5 },
    featuresRating: { type: Number, required: true, min: 1, max: 5 },
    valueForMoney: { type: Number, required: true, min: 1, max: 5 },
    customerSupport: { type: Number, required: true, min: 1, max: 5 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Technology', technologySchema);