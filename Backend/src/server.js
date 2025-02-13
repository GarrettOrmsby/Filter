import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getTopArtistsWithCache } from './services/artistsCache.js';
import { getArtistsInfo, getArtistAlbums } from './services/spotifyService.js';
import { getNewReleasesWithCache } from './services/newReleases.js';

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
