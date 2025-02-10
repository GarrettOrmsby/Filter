import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

async function getTopArtists() {
    const apiKey = process.env.VITE_LASTFM_API_KEY;
    
    try {
        const response = await fetch(
            `${BASE_URL}?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=5`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const artists = data.artists.artist.map(artist => ({
            name: artist.name,
            listeners: artist.listeners,
            url: artist.url
        }));
        
        return artists;
        
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}

export { getTopArtists };