import express, { application } from 'express';
import { useParams } from 'react-router-dom';
import cors from 'cors';
import dotenv from 'dotenv';
import { getTopArtistsWithCache } from './services/artistsCache.js';
import { getArtistsInfo, getArtistAlbums } from './services/spotifyService.js';
import { getNewReleasesWithCache } from './services/newReleases.js';
import { getAlbumWithCache } from './services/albumService.js';
import { searchArtist } from './services/spotifyService.js';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


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
