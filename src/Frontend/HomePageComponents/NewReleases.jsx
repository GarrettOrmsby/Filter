import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

function NewReleases() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div key={release.id} className="flex flex-col items-center w-[180px]">
                        <div className="text-center mb-2 w-full">
                            <h3 className="text-sm font-bold truncate hover:text-clip hover:whitespace-normal">
                                {release.name}
                            </h3>
                            <p className="text-sm text-gray-400 truncate hover:text-clip hover:whitespace-normal">
                                {release.artist}
                            </p>
                        </div>
                        <div
                            style={{ backgroundImage: `url(${release.images.medium})`}}
                            className="
                                h-[150px] w-[150px] 
                                rounded-sm 
                                bg-cover bg-center
                            "
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewReleases;