import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function ArtistCard() {
    const [artists, setArtists] = useState([]);

    const navigate = useNavigate();

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/top-artists-full`)
            .then(response => response.json())
            .then(data => {
                setArtists(data);
            })
            .catch(error => {
                console.error('Error fetching top artists:', error);
            });
    }, []);


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
                        onClick={() => handleArtistClick(artist.id)}
                        className="
                            relative            
                            h-[450px] w-[450px]       
                            rounded-sm         
                            overflow-hidden      
                            bg-cover bg-center
                            shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                            hover:shadow-[0_8px_24px_rgba(0,0,0,1)]
                            transition-shadow
                            duration-300
                            cursor-pointer
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
                            group
                            shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.8)]
                            transition-shadow
                            duration-300
                            cursor-pointer
                        "
                        onClick={() => handleArtistClick(artist.id)}
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