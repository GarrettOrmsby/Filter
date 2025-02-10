let accessToken = null;
let tokenExpiration = null;

async function getAccessToken() {
    if (accessToken && tokenExpiration > Date.now()) {
        console.log('Using cached token');
        return accessToken;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });
        
        const data = await response.json();
        
        // Store token and expiration
        accessToken = data.access_token;
        tokenExpiration = Date.now() + (data.expires_in * 1000); // Convert to milliseconds

        return accessToken;

    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw error;
    }
}

async function makeSpotifyRequest(endpoint, options = {}) {
    try {
        const token = await getAccessToken();

        const baseUrl = 'https://api.spotify.com/v1';
        const url = `${baseUrl}/${endpoint}`;

        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            ...options
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error making Spotify request:', error);
        throw error;
    }
}

function handleSpotifyError(error) {
    // Common Spotify API errors
    if (error.response) {
        switch (error.response.status) {
            case 401:
                return new Error('Spotify token expired or invalid');
            case 404:
                return new Error('Resource not found on Spotify');
            case 429:
                return new Error('Rate limit exceeded');
            default:
                return new Error(`Spotify error: ${error.message}`);
        }
    }
    return error;
}

async function searchArtist(artistName) {
    try {
        console.log('Searching for artist:', encodeURIComponent(artistName));
        const response = await makeSpotifyRequest(
            `search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`
        );
        return response.artists.items[0];
    } catch (error) {
        throw handleSpotifyError(error);
    }
}

async function getArtistsInfo(artistNames) {
    try {
        // Map each artist name to a search promise
        const artistPromises = artistNames.map(name => 
            searchArtist(name)
        );

        // Wait for all searches to complete
        const artists = await Promise.all(artistPromises);
        
        // Format the results
        return artists.map(artist => ({
            name: artist.name,
            genres: artist.genres,
            images: artist.images,
            popularity: artist.popularity,
            id: artist.id
        }));

    } catch (error) {
        throw handleSpotifyError(error);
    }
}

async function getArtistAlbums(artistNames) {
    try {
        const cachedSpotifyArtists = getCachedSpotifyArtists();
        const allArtistAlbums = [];

        for (const artistName of artistNames) {
            // Find artist in cache
            const cachedArtist = cachedSpotifyArtists.find(
                artist => artist.name.toLowerCase() === artistName.toLowerCase()
            );

            if (cachedArtist) {
                // Use cached Spotify ID
                const albumsResponse = await makeSpotifyRequest(
                    `artists/${cachedArtist.id}/albums`,
                    {
                        include_groups: 'album,single',
                        limit: 50,
                        market: 'US'
                    }
                );

                allArtistAlbums.push({
                    artistName,
                    artistInfo: cachedArtist, // Include cached artist info
                    albums: albumsResponse.items.map(album => ({
                        id: album.id,
                        name: album.name,
                        releaseDate: album.release_date,
                        totalTracks: album.total_tracks,
                        images: {
                            small: album.images[2]?.url,
                            medium: album.images[1]?.url,
                            large: album.images[0]?.url
                        },
                        type: album.album_type,
                        spotifyUrl: album.external_urls.spotify
                    }))
                });
            }
        }

        return allArtistAlbums;
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
}

export { 
    getAccessToken, 
    makeSpotifyRequest, 
    searchArtist, 
    getArtistsInfo,
    getArtistAlbums
};