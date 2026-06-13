const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  hoursPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPlayed: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// INDEX: userId + gameId for fast library lookups
sessionSchema.index({ userId: 1, gameId: 1 }, { unique: true });
// INDEX: lastPlayed for monthly active users aggregation
sessionSchema.index({ lastPlayed: -1 });

module.exports = mongoose.model('Session', sessionSchema);
