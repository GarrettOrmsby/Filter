import { API_BASE_URL, AUTH_BASE_URL } from '../config';

// Cache implementation
const cache = new Map();

const CACHE_DURATIONS = {
    TOP_ARTISTS: 7 * 24 * 60 * 60 * 1000,  // 1 week
    NEW_RELEASES: 24 * 60 * 60 * 1000,     // 1 day
    ARTIST_ALBUMS: 7 * 24 * 60 * 60 * 1000 // 1 week
};

const getFromCache = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const { data, timestamp, duration } = cached;
    if (Date.now() - timestamp > duration) {
        cache.delete(key);
        return null;
    }
    
    console.log(`Cache hit for ${key}`);
    return data;
};

const setCache = (key, data, duration) => {
    console.log(`Caching data for ${key}`);
    cache.set(key, {
        data,
        timestamp: Date.now(),
        duration
    });
};

// Auth related API calls (no caching)
export const fetchUserProfile = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
};

// Reviews related API calls (no caching - dynamic data)
export const fetchTopReviews = async (userId) => {
    const headers = userId ? { 'user-id': userId } : {};
    const response = await fetch(`${API_BASE_URL}/reviews/top`, { headers });
    if (!response.ok) throw new Error('Failed to fetch top reviews');
    return response.json();
};

export const fetchRecentReviews = async (userId) => {
    const headers = userId ? { 'user-id': userId } : {};
    const response = await fetch(`${API_BASE_URL}/reviews/recent?limit=5`, { headers });
    if (!response.ok) throw new Error('Failed to fetch recent reviews');
    return response.json();
};

// Artists related API calls (with caching)
export const fetchTopArtists = async () => {
    const cacheKey = 'top-artists';
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${API_BASE_URL}/top-artists-full`);
    if (!response.ok) throw new Error('Failed to fetch top artists');
    
    const data = await response.json();
    setCache(cacheKey, data, CACHE_DURATIONS.TOP_ARTISTS);
    return data;
};

export const fetchArtistAlbums = async (artistId) => {
    const cacheKey = `artist-albums-${artistId}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${API_BASE_URL}/specific-artist-albums/${artistId}`);
    if (!response.ok) throw new Error('Failed to fetch artist albums');
    
    const data = await response.json();
    setCache(cacheKey, data, CACHE_DURATIONS.ARTIST_ALBUMS);
    return data;
};

// Albums related API calls (with caching)
export const fetchNewReleases = async () => {
    const cacheKey = 'new-releases';
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${API_BASE_URL}/new-releases`);
    if (!response.ok) throw new Error('Failed to fetch new releases');
    
    const data = await response.json();
    setCache(cacheKey, data, CACHE_DURATIONS.NEW_RELEASES);
    return data;
};

export const fetchAlbumDetails = async (albumId) => {
    const cacheKey = `album-${albumId}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${API_BASE_URL}/album/${albumId}`);
    if (!response.ok) throw new Error('Failed to fetch album details');
    
    const data = await response.json();
    setCache(cacheKey, data, CACHE_DURATIONS.ARTIST_ALBUMS); // Using same duration as artist albums
    return data;
};

// Search related API calls (no caching - dynamic data)
export const searchSpotify = async (query) => {
    const response = await fetch(`${API_BASE_URL}/search/${query}`);
    if (!response.ok) throw new Error('Failed to search');
    return response.json();
};

// Auth endpoints (no caching)
export const getSpotifyAuthUrl = () => `${AUTH_BASE_URL}/spotify`; 