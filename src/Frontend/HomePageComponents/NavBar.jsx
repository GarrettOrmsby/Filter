import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SpotifyAuthModal from '../components/modals/SpotifyAuthModal/SpotifyAuth';
import '../../../src/index.css';
import { useAuth } from '../context/AuthContext';


function NavBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        // Trigger animation on component mount
        setIsVisible(true);
    }, []);

    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <header>
            <nav className={`
                transform transition-transform duration-500 ease-out
                ${isVisible ? 'translate-y-0' : '-translate-y-full'}
            `}>
                <ul className="
                flex flex-row 
                gap-6
                items-center
                p-4
                uppercase
                leading-normal
                ">
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
                                <Link 
                                    to={`/user/${user.id}`}
                                    className="hover:text-darkTeal transition-colors"
                                >
                                    <span>{user.name}</span>
                                </Link>
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
