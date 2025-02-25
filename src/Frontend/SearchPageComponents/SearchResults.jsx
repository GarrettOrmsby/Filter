import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchResults({ results }) {
    const [activeTab, setActiveTab] = useState('albums');
    const navigate = useNavigate();

    if (!results) return <div>Loading...</div>;

    // Filter out artists with less than 10,000 followers
    const filteredArtists = results.artists?.items.filter(artist => 
        artist.followers.total >= 10000
    ) || [];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-700">
                <button 
                    className={`pb-2 px-4 ${activeTab === 'albums' ? 'border-b-2 border-darkTeal text-white' : 'text-paragraphColor'}`}
                    onClick={() => setActiveTab('albums')}
                >
                    Albums
                </button>
                <button 
                    className={`pb-2 px-4 ${activeTab === 'artists' ? 'border-b-2 border-darkTeal text-white' : 'text-paragraphColor'}`}
                    onClick={() => setActiveTab('artists')}
                >
                    Artists
                </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-6">
                {activeTab === 'albums' ? (
                    results.albums?.items.map(album => (
                        <div 
                            key={album.id}
                            className="flex gap-6 items-center p-4 hover:bg-lighterGray cursor-pointer"
                            onClick={() => navigate(`/album/${album.id}`)}
                        >
                            <img 
                                src={album.images[1]?.url} 
                                alt={album.name}
                                className="w-24 h-24 object-cover shadow-lg"
                            />
                            <div>
                                <h3 className="text-white text-lg font-medium mb-1">{album.name}</h3>
                                <p className="text-paragraphColor text-base mb-1">{album.artists[0].name}</p>
                                <p className="text-paragraphColor text-base">{new Date(album.release_date).getFullYear()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    filteredArtists.map(artist => (
                        <div 
                            key={artist.id}
                            className="flex gap-6 items-center p-4 hover:bg-lighterGray cursor-pointer"
                            onClick={() => navigate(`/artist/${artist.id}`)}
                        >
                            <img 
                                src={artist.images[1]?.url} 
                                alt={artist.name}
                                className="w-24 h-24 object-cover rounded-full shadow-lg"
                            />
                            <div>
                                <h3 className="text-white text-lg font-medium mb-1">{artist.name}</h3>
                                <p className="text-paragraphColor text-base mb-1">
                                    {artist.followers.total.toLocaleString()} followers
                                </p>
                                {artist.genres?.length > 0 && (
                                    <p className="text-paragraphColor text-base">
                                        {artist.genres.slice(0, 3).join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchResults; 