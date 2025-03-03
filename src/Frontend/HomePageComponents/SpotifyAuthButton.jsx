import { FaSpotify } from 'react-icons/fa'; // Make sure to install react-icons
import { AUTH_BASE_URL } from '../config';

function SpotifyAuthButton() {
    const handleSpotifyAuth = () => {
        // Redirect to backend auth route
        window.location.href = `${AUTH_BASE_URL}/spotify`;
    };

    return (
        <button
            onClick={handleSpotifyAuth}
            className="
                flex items-center justify-center gap-2
                bg-[#1DB954] hover:bg-[#1ed760]
                text-white font-bold
                px-6 py-3 rounded-full
                transition-colors duration-200
            "
        >
            <FaSpotify className="text-xl" />
            <span>Continue with Spotify</span>
        </button>
    );
}

export default SpotifyAuthButton; 