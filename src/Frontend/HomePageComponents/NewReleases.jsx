import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function NewReleases() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/new-releases`)
            .then(response => response.json())
            .then(data => {
                setReleases(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching new releases:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {loading ? (
                    <p>Loading...</p>
                ) : releases?.map(release => (
                    <div key={release.id} 
                        className="flex flex-col items-center w-[180px]"
                        onClick={() => handleAlbumClick(release.id)}
                    >
                        <div className="text-center mb-2 w-full">
                            <h3 className="text-md font-[700]  text-paragraphColor truncate hover:text-clip hover:whitespace-normal">
                                {release.name}
                            </h3>
                            <p className="text-sm text-darkTeal truncate hover:text-clip hover:whitespace-normal">
                                {release.artist}
                            </p>
                        </div>
                        <div
                            style={{ backgroundImage: `url(${release.images.medium})`}}
                            className="
                                h-[150px] w-[150px] 
                                rounded-sm 
                                bg-cover bg-center
                                hover:outline hover:outline-3 hover:outline-darkTeal
                                hover:outline-offset-[-2px]
                                transition-all
                                duration-300
                                ease-in-out
                                cursor-pointer
                            "
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewReleases;