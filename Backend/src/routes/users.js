import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import FavoriteAlbum from '../models/FavoriteAlbum.js';
import { getAlbumWithCache } from '../services/albumService.js';

const router = express.Router();

// Get user profile with review count
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Count total reviews by user
        const reviewCount = await Review.count({
            where: { userId: req.params.id }
        });
        
        res.json({
            id: user.id,
            displayName: user.displayName,
            profileImageUrl: user.profileImageUrl,
            reviewCount
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Get user's favorite albums
router.get('/:id/favorites', async (req, res) => {
    try {
        const favorites = await FavoriteAlbum.findAll({
            where: { userId: req.params.id },
            order: [['position', 'ASC']],
            limit: 5
        });
        
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorite albums:', error);
        res.status(500).json({ error: 'Failed to fetch favorite albums' });
    }
});

// Update user's favorite albums
router.post('/:id/favorites', async (req, res) => {
    try {
        const userId = req.params.id;
        const { albums } = req.body; // Array of { albumId, position }

        // Validate user authentication
        if (userId !== req.headers['user-id']) {
            return res.status(403).json({ error: 'Not authorized to update favorites' });
        }

        // Validate input
        if (!Array.isArray(albums) || albums.length > 5) {
            return res.status(400).json({ error: 'Invalid favorites data' });
        }

        // Start transaction
        const transaction = await FavoriteAlbum.sequelize.transaction();

        try {
            // Remove existing favorites
            await FavoriteAlbum.destroy({
                where: { userId },
                transaction
            });

            // Add new favorites
            for (const album of albums) {
                const albumData = await getAlbumWithCache(album.albumId);
                await FavoriteAlbum.create({
                    userId,
                    albumId: album.albumId,
                    position: album.position,
                    albumName: albumData.albumName,
                    artistName: albumData.artistName,
                    imageUrl: albumData.images[0]?.url
                }, { transaction });
            }

            await transaction.commit();
            res.json({ message: 'Favorites updated successfully' });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error updating favorite albums:', error);
        res.status(500).json({ error: 'Failed to update favorite albums' });
    }
});

export default router;
