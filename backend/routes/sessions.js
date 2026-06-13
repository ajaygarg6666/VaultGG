const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { protect } = require('../middleware/auth');

// @route   GET /api/sessions/library
// @desc    Get user's game library with session data (READ)
router.get('/library', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .populate('gameId', 'title genre coverImage developer tags platforms')
      .sort({ lastPlayed: -1 });

    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/sessions
// @desc    Add game to library / log session (CREATE)
router.post('/', protect, async (req, res) => {
  try {
    const { gameId, hoursPlayed, completed } = req.body;

    // Check if session already exists (upsert pattern)
    const existing = await Session.findOne({ userId: req.user._id, gameId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Game already in your library. Use PUT to update playtime.'
      });
    }

    // CREATE new session document
    const session = await Session.create({
      userId: req.user._id,
      gameId,
      hoursPlayed: hoursPlayed || 0,
      lastPlayed: new Date(),
      completed: completed || false
    });

    const populated = await Session.findById(session._id)
      .populate('gameId', 'title genre coverImage developer');

    res.status(201).json({ success: true, message: 'Game added to library', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update playtime & completion status (UPDATE)
router.put('/:id', protect, async (req, res) => {
  try {
    const { hoursPlayed, completed } = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $set: {
          hoursPlayed,
          completed,
          lastPlayed: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('gameId', 'title genre coverImage developer');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, message: 'Playtime updated', data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Remove game from library (DELETE)
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, message: 'Game removed from library' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/sessions/check/:gameId
// @desc    Check if a game is in user's library
router.get('/check/:gameId', protect, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.user._id,
      gameId: req.params.gameId
    });

    res.json({ success: true, inLibrary: !!session, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
