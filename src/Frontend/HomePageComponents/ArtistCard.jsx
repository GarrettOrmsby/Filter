import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

function ArtistCard() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/top-artists-full`)
            .then(response => response.json())
            .then(data => {
                setArtists(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching top artists:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    // Separate top 2 artists and remaining 3
    const topTwo = artists.slice(0, 2);
    const remainingThree = artists.slice(2, 5);

    return (
        <div className="max-w-6xl mx-auto px-8">
            {/* Top row with larger square cards */}
            <div className="flex justify-center gap-4 mb-8">
                {topTwo.map(artist => (
                    <div 
                        key={artist.id}
                        style={{ backgroundImage: `url(${artist.images[0].url})` }}
                        className="
                            relative            
                            h-[450px] w-[450px]       
                            rounded-sm         
                            overflow-hidden      
                            bg-cover bg-center
                            shadow-lg
                        "
                    >
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h2 className="text-2xl font-bold text-headingColor">{artist.name}</h2>
                            <p className="text-paragraphColor">Popularity: {artist.popularity}</p>
                            <p className="text-paragraphColor">Listeners: {Number(artist.listeners).toLocaleString()}</p>

                        </div>
                    </div>

                ))}
            </div>

            {/* Bottom row with smaller circular cards */}
            <div className="flex justify-between px-12">
                {remainingThree.map(artist => (
                    <div 
                        key={artist.id}
                        style={{ backgroundImage: `url(${artist.images[0].url})` }}
                        className="
                            relative            
                            h-40 w-40        
                            rounded-full         
                            overflow-hidden      
                            bg-cover bg-center
                            shadow-lg
                            group

                        "
                    >
                        <div className="
                            absolute inset-0 
                            bg-black/60 
                            opacity-0 
                            group-hover:opacity-100 
                            transition-opacity
                            flex flex-col 
                            justify-center 
                            items-center
                            text-center
                        ">
                            <h2 className="text-lg font-bold text-white">{artist.name}</h2>
                            <p className="text-sm text-gray-200">Popularity: {artist.popularity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArtistCard;