import { useState } from 'react';
import filters from '../../assets/filter(2).png';
import reviews from '../../assets/menu-3.png';
import likes from '../../assets/heart.png';

function AlbumImageAndCounts({ album }) {
    if (!album) return <div>Loading album...</div>;
    
    const handleTrackClick = (spotifyUrl) => {
        window.open(spotifyUrl, '_blank');
    };

    // Access tracks directly since we transformed it in spotifyService
    const tracks = album.tracks;
    const trackList = tracks.map((track, index) => (
        <div 
            key={track.trackNumber} 
            className={`
                track-list-item
                p-2
                hover:bg-gray-100
                cursor-pointer
                ${index !== tracks.length - 1 ? 'border-b border-gray-200' : ''}
            `}
            onClick={() => handleTrackClick(track.spotifyUrl)}>
            <p className="text-sm text-gray-400">{track.trackName}</p>
        </div>
    ));

    return (
        <div className="flex flex-col gap-4 max-w-[250px]">
            <div className="album-image-container">
                <div 
                    key={album.id}
                    style={{ backgroundImage: `url(${album.images[0].url})` }}
                    className="
                        relative
                        w-[250px] h-[250px]
                        overflow-hidden
                        bg-cover bg-center
                        shadow-lg
                    "
                />
            </div>
            <div className="album-counters flex gap-4 mx-auto h-fit">
                <div className="album-filters flex gap-1">
                    <img src={filters} alt="filters" className="w-6 h-6" />
                    <p className="text-sm text-gray-400">66k</p>
                </div>
                <div className="album-likes flex gap-1">
                    <img src={likes} alt="likes" className="w-6 h-6" />
                    <p className="text-sm text-gray-400">200k</p>
                </div>
                <div className="album-reviews flex gap-1">
                    <img src={reviews} alt="reviews" className="w-6 h-6" />
                    <p className="text-sm text-gray-400">100k</p>
                </div>
            </div>
            <div className="
                track-list
                border border-gray-200
                rounded-md
                overflow-hidden
            ">
                {trackList}
            </div>
        </div>
    )
};

export default AlbumImageAndCounts;
