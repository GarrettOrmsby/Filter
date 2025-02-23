import { getAlbumById } from './spotifyService.js';

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

const albumCache = new Map();


async function getAlbumWithCache(albumId) {
    const cachedAlbum = albumCache.get(albumId);
    if (cachedAlbum) {
        const isExpired = Date.now() - cachedAlbum.timestamp > CACHE_DURATION;
        if (!isExpired) {
            console.log('Using cached album', cachedAlbum, albumCache);
            return cachedAlbum.data;
        }
    }

    const albumData = await getAlbumById(albumId);

    albumCache.set(albumId, {
        data: albumData,
        timestamp: Date.now()
    });

    console.log('API Album data', albumData, albumCache);
    return albumData;
}

export { getAlbumWithCache };

