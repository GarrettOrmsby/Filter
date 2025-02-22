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
    console.log(album);
    return (
        <div className="min-h-screen relative">
            <div className="absolute top-0 left-0 right-0 max-w-5xl mx-auto h-[675px]">
                <HeaderImage artistImage={artistImage} />
            </div>

            <div className="relative z-10">
                <nav>
                    <NavBar />
                </nav>

                <main className="pt-[675px]">
                    <div className="max-w-6xl min-w-6xlmx-auto px-4">
                        <div className="grid grid-cols-[300px_1fr] gap-4">
                            <div className="space-y-6">
                                <AlbumImageAndCounts album={album} />
                            </div>
                            <div>
                                <ReviewSection album={album} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ReviewPage;
