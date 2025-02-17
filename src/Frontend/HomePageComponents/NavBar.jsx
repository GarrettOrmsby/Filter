import { Link } from "react-router-dom";
import { useState } from 'react';
import SearchBar from './SearchBar';
import SpotifyAuthModal from '../components/modals/SpotifyAuthModal/SpotifyAuth';
import '../../../src/index.css';


function NavBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

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
                        <a 
                            onClick={() => handleOpenModal('spotify')} 

                            style={{ cursor: 'pointer' }}
                        >
                            <span>Sign in with Spotify</span>
                        </a>
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
