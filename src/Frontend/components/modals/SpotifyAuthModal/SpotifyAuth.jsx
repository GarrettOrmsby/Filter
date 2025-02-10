import ModalOverlay from '../shared/ModalOverlay';
import SpotifyAuthButton from '../../../HomePageComponents/SpotifyAuthButton';

function SpotifyAuthModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="bg-[#201b2b] p-8 rounded-lg w-[400px]">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Welcome to Filter
                </h2>
                
                <div className="space-y-6">
                    <p className="text-center text-gray-300">
                        Connect your Spotify account to get started
                    </p>
                    
                    <div className="flex justify-center">
                        <SpotifyAuthButton />
                    </div>
                    
                    <div className="text-center text-sm text-gray-400">
                        <p>By continuing, you agree to Filter's</p>
                        <div className="flex justify-center gap-2">
                            <a href="/terms" className="hover:text-white">Terms of Service</a>
                            <span>and</span>
                            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </ModalOverlay>
    );
}

export default SpotifyAuthModal; 