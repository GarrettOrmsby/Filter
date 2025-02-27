import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import SearchBar from './SearchBar';
import SpotifyAuthModal from '../components/modals/SpotifyAuthModal/SpotifyAuth';
import '../../../src/index.css';
import { useAuth } from '../context/AuthContext';


function NavBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const { user, logout } = useAuth();

    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <header>
            <nav>
                <ul className="
                flex flex-row 
                gap-6
                items-center
                p-4
                uppercase
                leading-normal">
                    <li className="navitem">
                        <Link to="/">
                            <span>Home Placeholder</span>
                        </Link>
                    </li>
                    <li className="navitem">
                        {user ? (
                            <div className="flex items-center gap-2">
                                {user.profileImage && (
                                    <img 
                                        src={user.profileImage} 
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full" 
                                    />
                                )}
                                <span>{user.name}</span>
                                <button 
                                    onClick={logout} 
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <a 
                                onClick={() => handleOpenModal('spotify')} 
                                style={{ cursor: 'pointer' }}
                            >
                                <span>Sign in with Spotify</span>
                            </a>
                        )}
                    </li>
                    <li className="navitem albums-page">
                        <Link to="/albums">
                            <span>Albums</span>
                        </Link>
                    </li>
                    <li className="navitem collections-page">
                        <Link to="/Filters">
                            <span>Filters</span>
                        </Link>
                    </li>
                    <li className="navitem stats-page">
                        <Link to="/Playlists">
                            <span>Playlists</span>
                        </Link>
                    </li>
                    <li className="navitem search-bar">
                        <SearchBar />
                    </li>
                    
                </ul>
            </nav>
            {isModalOpen && modalType === 'spotify' && (
                <SpotifyAuthModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </header>
            

    )
}

export default NavBar;
