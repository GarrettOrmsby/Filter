import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderImage from '../HomePageComponents/HeaderImage';
import AlbumImageAndCounts from '../ReviewPageComponents/AlbumImageAndCounts';
import ReviewSection from '../ReviewPageComponents/ReviewSection';
import NavBar from '../HomePageComponents/NavBar';

function ReviewPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [artistImage, setArtistImage] = useState(null);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:3001/api';

    useEffect(() => {
        if (!id) return;

        fetch(`${API_BASE_URL}/album/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch album');
                return response.json();
            })
            .then(albumData => {
                setAlbum(albumData);
                
                const artistName = albumData.artists[0].name;
                return fetch(`${API_BASE_URL}/search-artist/${encodeURIComponent(artistName)}`);
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch artist');
                return response.json();
            })
            .then(artistData => {
                const artistImage = artistData.images[0]?.url;
                setArtistImage(artistImage);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            });
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!album || !artistImage) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#201b2b]">
            {/* Fixed position NavBar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </nav>

            {/* Header Image Section */}
            <div className="h-[675px] relative">
                <HeaderImage artistImage={artistImage} />
            </div>

            {/* Main Content */}
            <div className="
                max-w-7xl 
                mx-auto 
                px-4 
                sm:px-6 
                lg:px-8
                py-8
                relative
                -mt-0
            ">
                <div className="grid grid-cols-[350px_1fr] gap-4">
                    <div className="space-y-6">
                        <AlbumImageAndCounts album={album} />
                    </div>
                    <div>
                        <ReviewSection album={album} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
