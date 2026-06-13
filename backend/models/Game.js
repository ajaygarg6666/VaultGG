const mongoose = require('mongoose');

// NESTED DOCUMENT schema for platforms
const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series X', 'Nintendo Switch', 'Mobile', 'Mac', 'Linux']
  },
  releaseDate: {
    type: Date
  },
  price: {
    type: Number,
    min: 0
  }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Horror', 'Simulation', 'Puzzle', 'FPS', 'MOBA', 'Battle Royale', 'Sandbox', 'Stealth', 'Survival', 'Other']
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  coverImage: {
    type: String,
    default: ''
  },
  // NESTED DOCUMENTS: platforms array with nested objects
  platforms: {
    type: [platformSchema],
    default: []
  },
  developer: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// INDEX: Text index on title for search
gameSchema.index({ title: 'text', description: 'text' });
// INDEX: Genre index for filtering
gameSchema.index({ genre: 1 });

module.exports = mongoose.model('Game', gameSchema);
