import express from 'express';
import Like from '../models/Like.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

const router = express.Router();

// Toggle like status (like or unlike)
router.post('/toggle/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.headers['user-id'];
        
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        // Check if review exists
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        // Check if user has already liked this review
        const existingLike = await Like.findOne({
            where: { userId, reviewId }
        });
        
        if (existingLike) {
            // User already liked this review, so unlike it
            await existingLike.destroy();
            return res.json({ liked: false, message: 'Review unliked successfully' });
        } else {
            // User hasn't liked this review, so like it
            await Like.create({ userId, reviewId });
            return res.json({ liked: true, message: 'Review liked successfully' });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to process like action' });
    }
});

// Get like count for a review
router.get('/count/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        const count = await Like.count({
            where: { reviewId }
        });
        
        res.json({ count });
    } catch (error) {
        console.error('Error getting like count:', error);
        res.status(500).json({ error: 'Failed to get like count' });
    }
});

// Check if a user has liked a review
router.get('/status/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.headers['user-id'];
        
        if (!userId) {
            return res.json({ liked: false });
        }
        
        const like = await Like.findOne({
            where: { userId, reviewId }
        });
        
        res.json({ liked: !!like });
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ error: 'Failed to check like status' });
    }
});

// Get all reviews liked by a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const likedReviews = await Like.findAll({
            where: { userId },
            include: [{
                model: Review,
                include: [{
                    model: User,
                    attributes: ['id', 'displayName', 'profileImageUrl']
                }]
            }]
        });
        
        res.json(likedReviews.map(like => like.Review));
    } catch (error) {
        console.error('Error getting liked reviews:', error);
        res.status(500).json({ error: 'Failed to get liked reviews' });
    }
});

export default router; 