import { makeSpotifyRequest } from './spotifyService.js';

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

let cachedData = null;
let lastFetch = null;

function parseReleaseData(data) {
    return data.map(album => ({
        name: album.name,
        artist: album.artists[0].name,
        albumUrl: album.external_urls.spotify,
        images: {
            small: album.images[1].url,
            medium: album.images[0].url,
            large: album.images[2].url
        },
        releaseDate: album.release_date,
        genres: album.genres,
    }));
}

async function getNewReleasesWithCache() {
    if (cachedData && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
        console.log('using cached data');
        return cachedData;
    }

    try {
        const data =await getNewReleases();
        console.log('fetched new releases via API');

        cachedData = data;
        lastFetch = Date.now();

        return data;
    } catch (error) {
        console.error('Error fetching new releases:', error);
        throw error;
    }
}

async function getNewReleases() {
    const endpoint = 'browse/new-releases?limit=10';
    
    try {
        const response = await makeSpotifyRequest(endpoint);
        const items = response.albums.items;
        return parseReleaseData(items);
    } catch (error) {
        throw error;
    }
}

export { getNewReleases, getNewReleasesWithCache };