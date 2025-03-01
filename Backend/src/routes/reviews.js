import Review from '../models/Review.js';
import express from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';

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

// GET recent reviews with user information
// IMPORTANT: This route must be defined BEFORE the /:id route
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching ${limit} recent reviews`);
    
    const recentReviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'profileImageUrl']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit
    });
    
    console.log(`Found ${recentReviews.length} recent reviews`);
    
    // Format the response to include user information
    const formattedReviews = recentReviews.map(review => ({
      id: review.id,
      albumId: review.albumId,
      albumName: review.albumName,
      albumImageUrl: review.albumImageUrl,
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
      user: {
        id: review.User.id,
        name: review.User.displayName,
        profileImage: review.User.profileImageUrl
      }
    }));
    
    res.json(formattedReviews);
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
    const reviews = await Review.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
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
      include: [
        {
          model: User,
          attributes: ['id', 'displayName', 'profileImageUrl']
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error(`Error fetching review ${req.params.id}:`, error);
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


