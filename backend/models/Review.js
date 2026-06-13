const mongoose = require('mongoose');

// EMBEDDED DOCUMENT: votes inside each review
const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  helpful: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    minlength: 10,
    maxlength: 2000
  },
  // EMBEDDED DOCUMENTS: votes array embedded inside review
  votes: {
    type: [voteSchema],
    default: []
  }
}, { timestamps: true });

// INDEX: Compound index on gameId + rating (desc) for sorted review fetching
reviewSchema.index({ gameId: 1, rating: -1 });
// INDEX: userId index for user's reviews
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
