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
                    <div key={artist.name}>
                        <h2 className="section-heading"></h2>
                    
                        <div 
                            className="artist-container grid grid-cols-12 gap-4"
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
                                        rounded-full
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
                                        className="album-card w-[150px] relative"
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