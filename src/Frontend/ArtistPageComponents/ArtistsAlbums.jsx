import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArtistsAlbums({ albums }) {
    const [sortType, setSortType] = useState('name-asc');
    
    const sortedAlbums = albums?.albums ? [...albums.albums].sort((a, b) => {
        switch (sortType) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'tracks-asc':
                return a.totalTracks - b.totalTracks;
            case 'tracks-desc':
                return b.totalTracks - a.totalTracks;
            default:
                return 0;
        }
    }) : [];

    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
    };

    return (
        <div className="space-y-6">
            {/* Filter Strip */}
            <div className="bg-lighterGray p-4 rounded-sm flex items-center gap-4">
                <span className="text-paragraphColor">Sort by:</span>
                <select 
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="bg-transparent text-paragraphColor border border-paragraphColor rounded-sm px-2 py-1"
                >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="tracks-asc">Tracks (Low-High)</option>
                    <option value="tracks-desc">Tracks (High-Low)</option>
                </select>
            </div>

            {/* Albums Grid */}
            <div className="grid grid-cols-4 gap-6">
                {sortedAlbums.map(album => (
                    <div 
                        key={album.id} 
                        className="flex flex-col gap-2 cursor-pointer"
                        onClick={() => handleAlbumClick(album.id)}
                    >
                        <div 
                            className="
                                aspect-square 
                                bg-cover bg-center 
                                rounded-sm 
                                shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                                hover:outline hover:outline-3 hover:outline-darkTeal
                                hover:outline-offset-[-2px]
                                transition-all
                                duration-300
                                ease-in-out
                                cursor-pointer"
                            style={{ backgroundImage: `url(${album.images[0].url})` }}
                        />
                        <p className="text-paragraphColor text-sm truncate">
                            {album.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArtistsAlbums;
