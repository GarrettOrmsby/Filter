/* import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

function TopArtistAlbums() {
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
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

    useEffect(() => {
    }, []);

    if (loading) return <p>Loading...</p>;

    return (

    )
} */