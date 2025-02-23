import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = 'http://localhost:3001/api';

function TopArtistAlbums() {
    const [artistsAndAlbums, setArtistsAndAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
    }

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/artist-albums`)
            .then(response => response.json())
            .then(data => {
                setArtistsAndAlbums(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching artists and albums:', error);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="albums-artists-container grid grid-rows-5 gap-8">
                {loading ? (
                    <p>Loading...</p>
                ) : artistsAndAlbums.map(artist =>
                    <div key={artist.name}>
                        <h2 className="section-heading">{artist.name}</h2>
                    
                        <div 
                            className="artist-container grid grid-cols-12 gap-4"
                        >
                            
                            <div className="artist-info col-span-5">
                                <div 
                                    key={artist.id} 
                                    style={{ backgroundImage: `url(${artist.images[0].url})`}}
                                    className="
                                        relative
                                        h-[300px] w-[300px]
                                        rounded-full
                                        overflow-hidden
                                        bg-cover bg-center
                                        shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                                        hover:shadow-[0_8px_24px_rgba(0,0,0,0.8)]
                                        transition-shadow
                                        duration-300
                                        cursor-pointer
                                    "
                                    onClick={() => handleArtistClick(artist.id)}
                                />
                            </div>
                            <div className="artist-albums col-span-7 grid grid-cols-2 gap-4">
                                {artist.albums.slice(0,4).map(album => (
                                    <div 
                                        key={album.id} 
                                        className="album-card w-[150px] relative"
                                        onClick={() => handleAlbumClick(album.id)}
                                    >
                                        <h4 className="
                                            text-sm font-bold 
                                            w-full
                                            truncate 
                                            hover:whitespace-normal
                                            hover:text-clip
                                            transition-all
                                            duration-200
                                            relative z-10
                                            pb-[5px]
                                        ">
                                            {album.name}
                                        </h4>
                                        <div
                                            style={{ backgroundImage: `url(${album.images[0].url})` }}
                                            className="
                                                relative
                                                h-[150px] w-[150px]
                                                rounded-sm
                                                overflow-hidden
                                                shadow-lg
                                                bg-cover bg-center
                                                group 
                                                hover:outline hover:outline-3 hover:outline-darkTeal
                                                hover:outline-offset-[-2px]
                                                transition-all
                                                duration-300
                                                ease-in-out
                                                cursor-pointer
                                            "
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
    
}

export default TopArtistAlbums;