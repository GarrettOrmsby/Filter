import { useParams } from 'react-router-dom';
import NavBar from '../HomePageComponents/NavBar';
import AlbumImageAndCounts from '../ReviewPageComponents/AlbumImageAndCounts';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

function ReviewPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/album/${id}`)
            .then(response => response.json())
            .then(data => {
                setAlbum(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!album) return <div>Album not found</div>;

    return (
        <div>
            <NavBar />
            <AlbumImageAndCounts album={album} />
        </div>
    );
}

export default ReviewPage;
