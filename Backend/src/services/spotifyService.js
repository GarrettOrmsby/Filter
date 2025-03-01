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

let artistInfoCache = {
    data: null,
    timestamp: null,
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

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

async function getArtistAlbums(artistInput) {
    try {
        // Handle single artist ID
        if (typeof artistInput === 'string') {
            const artist = await makeSpotifyRequest(`artists/${artistInput}`);
            const albumsResponse = await makeSpotifyRequest(
                `artists/${artistInput}/albums?include_groups=album&market=US&limit=50`
            );

            return {
                name: artist.name,
                images: artist.images,
                id: artist.id,
                albums: albumsResponse.items.map(album => ({
                    id: album.id,
                    name: album.name,
                    releaseDate: album.release_date,
                    totalTracks: album.total_tracks,
                    images: album.images,
                    type: album.album_type,
                    spotifyUrl: album.external_urls.spotify,
                }))
            };
        }

        // Handle array of artist names
        let artistsInfo;
        if (artistInfoCache.data &&
            artistInfoCache.timestamp &&
            (Date.now() - artistInfoCache.timestamp < CACHE_DURATION)) {
            console.log('Using cached artist info');
            artistsInfo = artistInfoCache.data;
        } else {
            artistsInfo = await getArtistsInfo(artistInput);
            artistInfoCache = {
                data: artistsInfo,
                timestamp: Date.now()
            };
        }
        console.log('yoyo: ',artistInfoCache);

        const artistsAlbums = await Promise.all(artistsInfo.map(async artist => {
            const albumsResponse = await makeSpotifyRequest(
                `artists/${artist.id}/albums?include_groups=album&market=US&limit=10`
            );

            return {
                name: artist.name,
                images: artist.images,
                id: artist.id,
                albums: albumsResponse.items.map(album => ({
                    id: album.id,
                    name: album.name,
                    releaseDate: album.release_date,
                    totalTracks: album.total_tracks,
                    images: album.images,
                    type: album.album_type,
                    spotifyUrl: album.external_urls.spotify,
                }))
            };
        }));

        return artistsAlbums;

    } catch (error) {
        console.error('Error getting artist albums:', error);
        throw handleSpotifyError(error);
    }
}

async function getAlbumById(albumId) {
    try {
        const albumResponse = await makeSpotifyRequest(`albums/${albumId}?market=US`);
        console.log('Spotify API Response:', albumResponse); // Debug log

        // Check if we have the required data
        if (!albumResponse?.artists?.[0]) {
            throw new Error('Album artist data not found');
        }

        return {
            artistName: albumResponse.artists[0].name,
            albumId: albumResponse.id,
            artists: albumResponse.artists,
            albumName: albumResponse.name,
            releaseDate: albumResponse.release_date,
            totalTracks: albumResponse.total_tracks,
            images: albumResponse.images || [],
            spotifyUrl: albumResponse.external_urls?.spotify,
            tracks: albumResponse.tracks.items.map(track => ({
                trackName: track.name,
                trackNumber: track.track_number,
                duration: track.duration_ms,
                spotifyUrl: track.external_urls?.spotify
            }))
        }
    } catch (error) {
        console.error('Error in getAlbumById:', error);
        throw handleSpotifyError(error);
    }
}

export { 
    getAccessToken, 
    makeSpotifyRequest, 
    searchArtist, 
    getArtistsInfo,
    getArtistAlbums,
    handleSpotifyError,
    getAlbumById
};