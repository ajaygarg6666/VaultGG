const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews/game/:gameId
// @desc    Get all reviews for a game sorted by rating desc (READ + INDEX)
router.get('/game/:gameId', async (req, res) => {
  try {
    // Uses compound index { gameId: 1, rating: -1 }
    const reviews = await Review.find({ gameId: req.params.gameId })
      .sort({ rating: -1, createdAt: -1 })
      .populate('userId', 'username profile.avatar');

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: reviews,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/user/my
// @desc    Get logged-in user's reviews (READ)
router.get('/user/my', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('gameId', 'title coverImage genre')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review (CREATE with embedded votes array)
router.post('/', protect, async (req, res) => {
  try {
    const { gameId, rating, reviewText } = req.body;

    // Check if user already reviewed this game
    const existingReview = await Review.findOne({ userId: req.user._id, gameId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this game' });
    }

    // CREATE review with empty embedded votes array
    const review = await Review.create({
      userId: req.user._id,
      gameId,
      rating,
      reviewText,
      votes: []  // embedded votes array
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username profile.avatar');

    res.status(201).json({ success: true, message: 'Review posted', data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Edit a review (UPDATE)
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    const { rating, reviewText } = req.body;
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    await review.save();

    const updated = await Review.findById(review._id).populate('userId', 'username profile.avatar');
    res.json({ success: true, message: 'Review updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (DELETE)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews/:id/vote
// @desc    Vote on a review as helpful (UPDATE embedded votes array)
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { helpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user already voted on this review (embedded doc check)
    const existingVoteIdx = review.votes.findIndex(
      v => v.userId.toString() === req.user._id.toString()
    );

    if (existingVoteIdx > -1) {
      // UPDATE existing embedded vote
      review.votes[existingVoteIdx].helpful = helpful;
    } else {
      // ADD new embedded vote document
      review.votes.push({ userId: req.user._id, helpful });
    }

    await review.save();
    res.json({ success: true, message: 'Vote recorded', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
