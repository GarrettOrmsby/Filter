import { useState } from 'react';
import filters from '../../assets/filter(2).png';
import reviews from '../../assets/menu-3.png';
import likes from '../../assets/heart.png';

function AlbumImageAndCounts({ album }) {
    if (!album) return <div>Loading album...</div>;
    
    const handleTrackClick = (spotifyUrl) => {
        window.open(spotifyUrl, '_blank');
    };

    const tracks = album.tracks;
    const trackList = tracks.map((track, index) => (
        <div 
            key={track.trackNumber} 
            className={`
                track-list-item
                p-2
                cursor-pointer
                ${index !== tracks.length - 1 ? 'border-b border-gray-100' : ''}
            `}
            onClick={() => handleTrackClick(track.spotifyUrl)}>
            <p className="text-sm text-paragraphColor hover:text-darkTeal transition-colors">
                {track.trackName}
            </p>
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
                        shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                        hover:shadow-[0_8px_24px_rgba(0,0,0,0.8)]
                        transition-shadow
                        duration-300
                        cursor-pointer
                        rounded-sm
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
                rounded-sm
                overflow-hidden
            ">
                <div className="bg-gray-400 p-2 border-b border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                    <p className="text-sm font-semibold text-gray-800">Track List</p>
                </div>
                {trackList}
            </div>
        </div>
    )
};

export default AlbumImageAndCounts;
