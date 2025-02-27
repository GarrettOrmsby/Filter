import { FaSpotify } from 'react-icons/fa'; // Make sure to install react-icons

function SpotifyAuthButton() {
    const API_BASE_URL = 'http://localhost:3001';
    
    const handleSpotifyAuth = () => {
        // Redirect to backend auth route
        window.location.href = `${API_BASE_URL}/auth/spotify`;
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