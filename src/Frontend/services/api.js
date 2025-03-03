import { API_BASE_URL, AUTH_BASE_URL } from '../config';

// Auth related API calls
export const fetchUserProfile = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
};

// Reviews related API calls
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

// Artists related API calls
export const fetchTopArtists = async () => {
    const response = await fetch(`${API_BASE_URL}/top-artists-full`);
    if (!response.ok) throw new Error('Failed to fetch top artists');
    return response.json();
};

export const fetchArtistAlbums = async (artistId) => {
    const response = await fetch(`${API_BASE_URL}/specific-artist-albums/${artistId}`);
    if (!response.ok) throw new Error('Failed to fetch artist albums');
    return response.json();
};

// Albums related API calls
export const fetchNewReleases = async () => {
    const response = await fetch(`${API_BASE_URL}/new-releases`);
    if (!response.ok) throw new Error('Failed to fetch new releases');
    return response.json();
};

export const fetchAlbumDetails = async (albumId) => {
    const response = await fetch(`${API_BASE_URL}/album/${albumId}`);
    if (!response.ok) throw new Error('Failed to fetch album details');
    return response.json();
};

// Search related API calls
export const searchSpotify = async (query) => {
    const response = await fetch(`${API_BASE_URL}/search/${query}`);
    if (!response.ok) throw new Error('Failed to search');
    return response.json();
};

// Auth endpoints
export const getSpotifyAuthUrl = () => `${AUTH_BASE_URL}/spotify`; 