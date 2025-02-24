import NavBar from "../HomePageComponents/NavBar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistHeading from "../ArtistPageComponents/ArtistHeading";
import contentBg from "../../assets/content-bg.4284ab72.png"
import ArtistsAlbums from "../ArtistPageComponents/ArtistsAlbums";


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

    console.log(albums);
    
    return (
        <div className="min-h-screen relative">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main className="min-h-screen mx-auto px-4" 
                style={{
                    background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                    width: '100vw',
                    height: '100vh'
                }}>
                    <div className="main-content max-w-5xl mx-auto px-4 space-y-8">
                        <div className="mx-auto px-4 space-y-8">
                            <ArtistHeading name={albums.name} />
                        </div>
                        <div className="albums-and-filters">
                            <ArtistsAlbums albums={albums} />
                        </div>
                    </div>
            </main>        
        </div>
    );
}

export default ArtistPage;