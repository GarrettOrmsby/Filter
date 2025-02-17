import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

function TopArtistAlbums() {
    const [artistsAndAlbums, setArtistsAndAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div>
                        <h2 className="section-heading"></h2>
                    
                        <div 
                            key={artist.name} 
                            className="artist-container grid grid-cols-12"
                        >
                            
                            <div className="artist-info col-span-5">
                                <h3 className="text-lg font-bold">
                                    {artist.name}
                                </h3>
                                <div 
                                    key={artist.id} 
                                    style={{ backgroundImage: `url(${artist.images[0].url})`}}
                                    className="
                                        relative
                                        h-[300px] w-[300px]
                                        rounded-sm
                                        overflow-hidden
                                        bg-cover bg-center
                                        shadow-lg
                                    "
                                />
                            </div>
                            <div className="artist-albums col-span-7 grid grid-cols-2 gap-4">
                                {artist.albums.slice(0,4).map(album => (
                                    <div 
                                        key={album.id} 
                                        className="album-card"
                                    >
                                        <h4 className="text-sm font-bold">{album.name}</h4>
                                        <div
                                            style={{ backgroundImage: `url(${album.images[0].url})`
                                        }}
                                        className="
                                            relative
                                            h-[150px] w-[150px]
                                            rounded-sm
                                            overflow-hidden
                                            shadow-lg
                                            bg-cover bg-center
                                            group 
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