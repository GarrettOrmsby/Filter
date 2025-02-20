import { useState, useEffect } from 'react';


function AlbumReview({ album }) {
    

    return (
        <div className="album-info-container">
            <div className="album-items flex flex-col gap-4">
                <AlbumImageAndCounts album={album} />
                <AlbumDetails album={album} />
            </div>
        </div>
    )
};

export default AlbumInfo;

        
