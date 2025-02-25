
import { makeSpotifyRequest, handleSpotifyError } from "./spotifyService.js";

async function spotifySearch(query) {
    try {
        const response = await makeSpotifyRequest(
            `search?q=${encodeURIComponent(query)}&type=album%2Cartist&market=US&limit=30`
        );
        return response;
    } catch (error) {
        throw handleSpotifyError(error);
    }

}

export { spotifySearch }