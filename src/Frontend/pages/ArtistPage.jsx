import NavBar from "../HomePageComponents/NavBar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistHeading from "../ArtistPageComponents/ArtistHeading";


function ArtistPage() {
    const { id } = useParams();
    const [albums, setAlbums] = useState([]);
    const [artist, setArtist] = useState(null);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:3001/api';


    useEffect(() => {
        fetch(`${API_BASE_URL}/specific-artist-albums/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch albums');
                return response.json();
            })
            .then(data => {
                setAlbums(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [id]);

    return (
        <div>
            <NavBar />
            <ArtistHeading name={albums.name} />
        </div>
    );
}

export default ArtistPage;