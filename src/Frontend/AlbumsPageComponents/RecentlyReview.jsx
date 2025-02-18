import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3001/api";

// Placeholder reviews
const PLACEHOLDER_REVIEWS = [
    {
        rating: 8.5,
        text: "A groundbreaking album that pushes boundaries while maintaining accessibility. The production is crisp and the songwriting is mature.",
        reviewer: "MusicFan123",
        date: "2024-03-15"
    },
    {
        rating: 7.8,
        text: "Solid effort with memorable hooks. While not revolutionary, it shows artistic growth and confident execution.",
        reviewer: "SoundExplorer",
        date: "2024-03-14"
    },
    {
        rating: 9.2,
        text: "An instant classic. Every track feels essential, and the sonic palette is consistently impressive.",
        reviewer: "BeatCritic",
        date: "2024-03-13"
    },
    {
        rating: 8.0,
        text: "Fresh and energetic with moments of brilliance. The experimental elements work surprisingly well.",
        reviewer: "MelodyHunter",
        date: "2024-03-12"
    }
];

function RecentlyReviewed() {
    const [recentAlbums, setRecentAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/new-releases`)
            .then(response => response.json())
            .then(data => {
                const albumsWithReviews = data.slice(0, 4).map((album, index) => ({
                    ...album,
                    review: PLACEHOLDER_REVIEWS[index]
                }));
                console.log('Albums with reviews:', albumsWithReviews);
                setRecentAlbums(albumsWithReviews);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching recently reviewed albums:", error);
                setLoading(false);
            });
    }, []);


    // Current Object example:
    return (
        <div>
            <h2 className="section-heading">Recently Reviewed Albums</h2>
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    recentAlbums.map(album => (
                        <div key={album.name} className="flex gap-4">
                            <img 
                                src={album.images.medium}
                                alt={album.name}
                                className="w-32 h-32 object-cover rounded-sm"
                            />
                            <div>
                                <h3 className="font-bold">{album.name}</h3>
                                <p className="text-sm text-gray-600">{album.artist}</p>
                                <div className="text-sm">
                                    <p className="font-semibold">
                                        Rating: {album.review.rating}/10
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        {album.review.text}
                                    </p>
                                    <p className="mt-2 text-gray-500">
                                        Reviewed by {album.review.reviewer} on {album.review.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecentlyReviewed;