const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Session = require('../models/Session');
const Game = require('../models/Game');
const { protect } = require('../middleware/auth');

// @route   GET /api/stats/top-games
// @desc    Top 5 highest rated games — AGGREGATION: $group + $sort + $limit + $lookup
router.get('/top-games', async (req, res) => {
  try {
    const topGames = await Review.aggregate([
      // Stage 1: Group by gameId, calculate avg rating and review count
      {
        $group: {
          _id: '$gameId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      },
      // Stage 2: Sort by average rating descending
      { $sort: { averageRating: -1 } },
      // Stage 3: Limit to top 5
      { $limit: 5 },
      // Stage 4: Lookup game details from games collection
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'game'
        }
      },
      // Stage 5: Unwind the game array
      { $unwind: '$game' },
      // Stage 6: Project desired fields
      {
        $project: {
          _id: 0,
          gameId: '$_id',
          title: '$game.title',
          genre: '$game.genre',
          coverImage: '$game.coverImage',
          developer: '$game.developer',
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1
        }
      }
    ]);

    res.json({ success: true, data: topGames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/stats/playtime
// @desc    Total hours played per user — AGGREGATION: $group + $sum + $lookup
router.get('/playtime', async (req, res) => {
  try {
    const playtime = await Session.aggregate([
      // Stage 1: Group by userId and sum all hours
      {
        $group: {
          _id: '$userId',
          totalHours: { $sum: '$hoursPlayed' },
          gamesPlayed: { $sum: 1 },
          completedGames: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      },
      // Stage 2: Sort by total hours descending
      { $sort: { totalHours: -1 } },
      // Stage 3: Limit to top 10 users
      { $limit: 10 },
      // Stage 4: Lookup user details
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.profile.avatar',
          totalHours: { $round: ['$totalHours', 1] },
          gamesPlayed: 1,
          completedGames: 1
        }
      }
    ]);

    res.json({ success: true, data: playtime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/stats/genre-ratings
// @desc    Average rating per genre — AGGREGATION: $lookup + $group + $avg
router.get('/genre-ratings', async (req, res) => {
  try {
    const genreRatings = await Review.aggregate([
      // Stage 1: Lookup game info to get genre
      {
        $lookup: {
          from: 'games',
          localField: 'gameId',
          foreignField: '_id',
          as: 'game'
        }
      },
      // Stage 2: Unwind game array
      { $unwind: '$game' },
      // Stage 3: Group by genre
      {
        $group: {
          _id: '$game.genre',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          uniqueGames: { $addToSet: '$gameId' }
        }
      },
      // Stage 4: Sort by avg rating desc
      { $sort: { averageRating: -1 } },
      // Stage 5: Project clean output
      {
        $project: {
          _id: 0,
          genre: '$_id',
          averageRating: { $round: ['$averageRating', 2] },
          totalReviews: 1,
          totalGames: { $size: '$uniqueGames' }
        }
      }
    ]);

    res.json({ success: true, data: genreRatings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/stats/completion
// @desc    Games completed vs in-progress breakdown — AGGREGATION
router.get('/completion', async (req, res) => {
  try {
    const completion = await Session.aggregate([
      // Stage 1: Group by completed status
      {
        $group: {
          _id: '$completed',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursPlayed' }
        }
      },
      {
        $project: {
          _id: 0,
          status: { $cond: [{ $eq: ['$_id', true] }, 'Completed', 'In Progress'] },
          count: 1,
          totalHours: { $round: ['$totalHours', 1] }
        }
      }
    ]);

    res.json({ success: true, data: completion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/stats/monthly-active
// @desc    Monthly active users — AGGREGATION: $match + $group by month
router.get('/monthly-active', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyActive = await Session.aggregate([
      // Stage 1: Match sessions within last 6 months
      {
        $match: {
          lastPlayed: { $gte: sixMonthsAgo }
        }
      },
      // Stage 2: Group by year + month
      {
        $group: {
          _id: {
            year: { $year: '$lastPlayed' },
            month: { $month: '$lastPlayed' }
          },
          activeUsers: { $addToSet: '$userId' },
          totalSessions: { $sum: 1 }
        }
      },
      // Stage 3: Sort chronologically
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      // Stage 4: Project clean output
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          activeUsers: { $size: '$activeUsers' },
          totalSessions: 1
        }
      }
    ]);

    res.json({ success: true, data: monthlyActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/stats/overview
// @desc    Quick summary stats for dashboard
router.get('/overview', async (req, res) => {
  try {
    const [totalGames, totalReviews, totalSessions, totalUsers] = await Promise.all([
      Game.countDocuments(),
      Review.countDocuments(),
      Session.countDocuments(),
      require('../models/User').countDocuments()
    ]);

    const totalHoursResult = await Session.aggregate([
      { $group: { _id: null, total: { $sum: '$hoursPlayed' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalGames,
        totalReviews,
        totalSessions,
        totalUsers,
        totalHoursPlayed: totalHoursResult[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
