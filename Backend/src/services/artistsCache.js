import { getTopArtists } from './lastfmTopArtists.js';

// Cache constants
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// Cache variables
let cachedData = null;
let lastFetch = null;

async function getTopArtistsWithCache() {
    // Check if cache is valid
    if (cachedData && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
        if (cachedData && lastFetch) {
            const timeLeft = CACHE_DURATION - (Date.now() - lastFetch);
            console.log({
                cachedData,
                lastFetch,
                currentTime: Date.now(),
                timeLeft: timeLeft / 1000 / 60, // minutes left
                shouldUseCached: timeLeft > 0
            });
        }
        console.log(`Returning cached, time left: ${Date.now() - lastFetch}`);
        return cachedData;
    }

    // Fetch new data
    try {
        const data = await getTopArtists();
        cachedData = data;
        lastFetch = Date.now();
        return data;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}

export { getTopArtistsWithCache };