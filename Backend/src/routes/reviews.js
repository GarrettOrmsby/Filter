import Review from '../models/Review.js';
import express from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Like from '../models/Like.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

dotenv.config();
const router = express.Router();

// Middleware to check if user is authenticated
const authenticateUser = async (req, res, next) => {
  try {
    // Get the user ID from the request headers or query params
    const userId = req.headers['user-id'] || req.query.userId;
    
    // Enhanced validation
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate userId format (assuming it's a number)
    if (isNaN(parseInt(userId))) {
      return res.status(401).json({ error: 'Invalid user ID format' });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    
    // Check if token is provided (optional additional check)
    const token = req.headers['authorization'] || req.query.token;
    if (!token) {
      console.warn(`Request from user ${userId} missing token`);
      // Still allowing for now, but logging the warning
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'profileImageUrl']
        }
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET top reviews from the past week
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate date range (last 7 days)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    console.log('Fetching top reviews with date range:', { 
      from: lastWeek.toISOString(), 
      to: today.toISOString() 
    });
    
    // First, get all reviews from the past week
    const recentReviews = await Review.findAll({
      where: {
        createdAt: {
          [Op.gte]: lastWeek,
          [Op.lte]: today
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'profileImageUrl']
        }
      ]
    });
    
    console.log(`Found ${recentReviews.length} reviews from the past week`);
    
    // If no reviews, return empty array
    if (recentReviews.length === 0) {
      return res.json([]);
    }
    
    // Get like counts for each review
    const reviewsWithLikes = await Promise.all(recentReviews.map(async (review) => {
      const reviewJson = review.toJSON();
      const likeCount = await Like.count({ where: { reviewId: review.id } });
      
      // Check if the current user has liked this review
      let userLiked = false;
      const userId = req.headers['user-id'];
      if (userId) {
        const userLike = await Like.findOne({
          where: { userId, reviewId: review.id }
        });
        userLiked = !!userLike;
      }
      
      return {
        ...reviewJson,
        likeCount,
        userLiked
      };
    }));
    
    // Sort by like count (descending)
    reviewsWithLikes.sort((a, b) => b.likeCount - a.likeCount);
    
    // Limit to requested number
    const topReviews = reviewsWithLikes.slice(0, limit);
    
    console.log(`Returning ${topReviews.length} top reviews`);
    res.json(topReviews);
  } catch (error) {
    console.error('Error fetching top reviews:', error);
    res.status(500).json({ error: 'Failed to fetch top reviews', details: error.message });
  }
});

// GET recent reviews with user information
// IMPORTANT: This route must be defined BEFORE the /:id route
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentReviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit,
      include: [{
        model: User,
        attributes: ['id', 'displayName', 'profileImageUrl']
      }]
    });
    
    // Get like counts for each review
    const reviewsWithLikes = await Promise.all(recentReviews.map(async (review) => {
      const reviewJson = review.toJSON();
      const likeCount = await Like.count({ where: { reviewId: review.id } });
      
      // Check if the current user has liked this review
      let userLiked = false;
      const userId = req.headers['user-id'];
      if (userId) {
        const userLike = await Like.findOne({
          where: { userId, reviewId: review.id }
        });
        userLiked = !!userLike;
      }
      
      return {
        ...reviewJson,
        likeCount,
        userLiked
      };
    }));
    
    res.json(reviewsWithLikes);
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    res.status(500).json({ error: 'Failed to fetch recent reviews' });
  }
});

// GET reviews for a specific album
router.get('/album/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const reviews = await Review.findAll({
      where: { albumId },
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'profileImageUrl']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews for album ${req.params.albumId}:`, error);
    res.status(500).json({ error: 'Failed to fetch album reviews' });
  }
});

// GET reviews by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{
        model: User,
        attributes: ['id', 'displayName', 'profileImageUrl']
      }]
    });

    res.json({
      reviews,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error(`Error fetching reviews for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// GET a single review by ID
// This must come AFTER all other GET routes with specific paths
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'displayName', 'profileImageUrl']
      }]
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Get like count
    const likeCount = await Like.count({ where: { reviewId: review.id } });
    
    // Check if the current user has liked this review
    let userLiked = false;
    const userId = req.headers['user-id'];
    if (userId) {
      const userLike = await Like.findOne({
        where: { userId, reviewId: review.id }
      });
      userLiked = !!userLike;
    }
    
    res.json({
      ...review.toJSON(),
      likeCount,
      userLiked
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// POST create a new review
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { albumId, albumName, albumImageUrl, reviewText, rating } = req.body;
    
    console.log('Review submission received:', {
      userId: req.user.id,
      albumId,
      albumName,
      albumImageUrl: albumImageUrl ? 'Image URL received' : null,
      reviewText: reviewText ? `${reviewText.substring(0, 20)}...` : null,
      rating
    });
    
    // Validate required fields with detailed errors
    const missingFields = [];
    if (!albumId) missingFields.push('albumId');
    if (!albumName) missingFields.push('albumName');
    if (!reviewText) missingFields.push('reviewText');
    if (rating === undefined || rating === null) missingFields.push('rating');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Check if user already reviewed this album
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        albumId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this album' });
    }
    
    // Create the review
    const review = await Review.create({
      userId: req.user.id,
      albumId,
      albumName,
      albumImageUrl,
      reviewText,
      rating
    });
    
    console.log('Review created successfully:', {
      id: review.id,
      userId: review.userId,
      albumId: review.albumId
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
});

// PUT update an existing review
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Check if the review belongs to the user
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }
    
    // Update the review
    const { reviewText, rating } = req.body;
    await review.update({
      reviewText: reviewText || review.reviewText,
      rating: rating || review.rating
    });
    
    res.json(review);
  } catch (error) {
    console.error(`Error updating review ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE a review
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Check if the review belongs to the user
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }
    
    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(`Error deleting review ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;


