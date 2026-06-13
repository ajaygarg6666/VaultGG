const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { protect } = require('../middleware/auth');

// @route   GET /api/games
// @desc    Get all games with optional search & genre filter (READ + INDEX usage)
router.get('/', async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 12 } = req.query;
    let query = {};

    // TEXT INDEX search on title + description
    if (search) {
      query.$text = { $search: search };
    }

    // GENRE INDEX filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Game.countDocuments(query);

    const games = await Game.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: games,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// @route   GET /api/games/genres/list
// @desc    Get distinct genres
router.get('/genres/list', async (req, res) => {
  try {
    const genres = await Game.distinct('genre');
    res.json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// @route   GET /api/games/:id
// @desc    Get game by ID with nested platform details (READ nested documents)
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/games
// @desc    Create a new game with nested platforms (CREATE)
router.post('/', protect, async (req, res) => {
  try {
    const { title, genre, description, coverImage, platforms, developer, tags } = req.body;

    // CREATE with nested platform documents
    const game = await Game.create({
      title,
      genre,
      description,
      coverImage: coverImage || '',
      platforms: platforms || [],  // nested {name, releaseDate, price} objects
      developer,
      tags: tags || []
    });

    res.status(201).json({ success: true, message: 'Game created', data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/games/:id
// @desc    Update game info including nested platforms (UPDATE nested documents)
router.put('/:id', protect, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, message: 'Game updated', data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/games/:id
// @desc    Delete a game (DELETE)
router.delete('/:id', protect, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// MOVED

module.exports = router;
