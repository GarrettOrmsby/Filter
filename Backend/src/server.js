import express, { application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getTopArtistsWithCache } from './services/artistsCache.js';
import { getArtistsInfo, getArtistAlbums } from './services/spotifyService.js';
import { getNewReleasesWithCache } from './services/newReleases.js';
import { getAlbumWithCache } from './services/albumService.js';
import { searchArtist } from './services/spotifyService.js';
import { spotifySearch } from './services/searchService.js';
import sequelize from './config/database.js';
import User, { syncUserModel } from './models/User.js';
import Review, { syncReviewModel } from './models/Review.js';
import Like, { syncLikeModel } from './models/Like.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import likeRoutes from './routes/likes.js';
import userRoutes from './routes/users.js';
import { syncFavoriteAlbumModel } from './models/FavoriteAlbum.js';

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');

        await syncUserModel();
        await syncReviewModel();
        await syncLikeModel();
        await syncFavoriteAlbumModel();

        console.log('Database initialization complete.');

    } catch (error) {
        console.error('Database initialization error:', error)
    }
}

initializeDatabase();

dotenv.config();

const app = express();

// Update CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:4173',  // Vite preview
        'https://filtered-8y56.onrender.com'  // Your production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id']
}));
app.use(express.json());

// Add a test route
app.get('/', (req, res) => {
    res.json({ message: 'Filterd API is running' });
});

app.use('/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

app.get('/api/top-artists-full', async (req, res) => {
    try {
        const lastfmArtists = await getTopArtistsWithCache();
        const topFiveNames = lastfmArtists
            .slice(0, 5)
            .map(artist => artist.name);

        const spotifyData = await getArtistsInfo(topFiveNames);

        const combinedData = spotifyData.map((spotifyArtist, index) => ({
            ...lastfmArtists[index],
            ...spotifyArtist
        }));

        res.json(combinedData);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch artists info',
            details: error.message
        });
    }
});

app.get('/api/new-releases', async (req, res) => {
    try {
        const newReleases = await getNewReleasesWithCache();
        console.log('Releases fetched:', newReleases);
        res.json(newReleases);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch new releases',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/api/artist-albums', async (req, res) => {
    try {
        const lastfmArtists = await getTopArtistsWithCache();
        const topFiveNames = lastfmArtists
            .slice(0, 5)
            .map(artist => artist.name);

        const spotifyAlbums = await getArtistAlbums(topFiveNames);
        console.log('Albums fetched:', spotifyAlbums);
        res.json(spotifyAlbums);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch artist albums',
            details: error.message
        });
    }
});

app.get('/api/album/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received request for album:', id);
        
        const album = await getAlbumWithCache(id);
        console.log('Album data retrieved:', album ? 'success' : 'null');
        
        if (!album) {
            console.log('Album not found');
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json(album);
    } catch (error) {
        console.error('Error in /api/album/:id:', error);
        res.status(500).json({ 
            error: 'Failed to fetch album',
            details: error.message 
        });
    }
});

app.get('/api/artist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received request for artist:', id);

        const artist = await getArtistsInfo(id);
        console.log('Artist data retrieved:', artist ? 'success' : 'null');

        if (!artist) {
            console.log('Artist not found');
            return res.status(404).json({ error: 'Artist not found' });
        }

        res.json(artist);
    } catch (error) {
        console.error('Error in /api/artist/:id:', error);
        res.status(500).json({
            error: 'Failed to fetch artist',
            details: error.message
        });
    }
});

app.get('/api/search-artist/:name', async (req, res) => {
    try {
        const { name } = req.params;
        console.log('Searching for artist:', name);

        const artist = await searchArtist(name);
        console.log('Artist data retrieved:', artist ? 'success' : 'null');

        if (!artist) {
            console.log('Artist not found');
            return res.status(404).json({ error: 'Artist not found' });
        }

        res.json(artist);
    } catch (error) {
        console.error('Error in /api/search-artist/:name:', error);
        res.status(500).json({
            error: 'Failed to search artist',
            details: error.message
        });
    }
});

app.get('/api/specific-artist-albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received request for artist:', id);

        
        const artist = await getArtistAlbums(id);
        console.log('Artist data retrieved:', artist ? 'success' : 'null');

        if (!artist) {
            console.log('Artist not found');
            return res.status(404).json({ error: 'Artist not found' });
        }

        res.json(artist);
    } catch (error) {
        console.error('Error in /api/specific-artist-albums/:id:', error);
        res.status(500).json({
            error: 'Failed to fetch artist albums',
            details: error.message
        });
    }
});

app.get('/api/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        console.log('Searching spotify:', query);

        const results = await spotifySearch(query);
        console.log('Search Results: ', results);

        if (!results) {
            console.log('Search Failed');
            return res.status(404).json({ error: 'Search Failed'});
        }

        res.json(results);

    }  catch (error) {
        console.error('Error i /api/search/:query', error);
        res.status(500).json({
            error: 'Failed to search',
            details: error.message
        });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Don't send sensitive information
        res.json({
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            profileImageUrl: user.profileImageUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

