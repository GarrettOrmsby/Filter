import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function UserReviews({ userId }) {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const reviewsPerPage = 10;

    useEffect(() => {
        fetchReviews();
    }, [userId, page]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/reviews/user/${userId}?page=${page}&limit=${reviewsPerPage}`
            );
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data.reviews);
            setTotalPages(Math.ceil(data.total / reviewsPerPage));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="section-heading">Reviews</h2>
            
            <div className="grid grid-cols-1 gap-6">
                {reviews.map(review => (
                    <div 
                        key={review.id}
                        className="flex gap-4 bg-white/5 p-4 rounded-md"
                    >
                        <img 
                            src={review.albumImageUrl}
                            alt={review.albumName}
                            className="w-24 h-24 object-cover rounded-md cursor-pointer"
                            onClick={() => navigate(`/album/${review.albumId}`)}
                        />
                        <div>
                            <h3 className="font-bold">{review.albumName}</h3>
                            <p className="text-sm text-paragraphColor">{review.reviewText}</p>
                            <div className="mt-2 text-sm">
                                Rating: {review.rating}/5
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                            page === i + 1 
                                ? 'bg-darkTeal text-white' 
                                : 'bg-white/10 hover:bg-white/20'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default UserReviews;
