import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import { fetchTopReviews } from '../services/api';

function PopularReviews() {
    const [popularReviews, setPopularReviews] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        console.log('Fetching top reviews...');
        fetchTopReviews(user?.id)
            .then(data => {
                console.log('Top reviews:', data);
                setPopularReviews(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching top reviews:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [user]);

    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
    }

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
            return dateString;
        }
    }
    
    // Format the rating to display with one decimal place
    const formatRating = (rating) => {
        return parseFloat(rating).toFixed(1);
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-6">
                {loading ? (
                    <p className="col-span-2">Loading popular reviews...</p>
                ) : error ? (
                    <p className="col-span-2 text-red-500">Error: {error}</p>
                ) : popularReviews.length === 0 ? (
                    <p className="col-span-2">No popular reviews found this week.</p>
                ) : (
                    popularReviews.map(review => (
                        <div key={review.id} className="flex flex-col h-full bg-white/5 p-4 rounded-md shadow-md">
                            <div className="flex gap-4 mb-3">
                                <img 
                                    src={review.albumImageUrl}
                                    alt={review.albumName}
                                    className="
                                        w-24 h-24 
                                        object-cover 
                                        rounded-sm
                                        hover:outline hover:outline-2 hover:outline-darkTeal
                                        hover:outline-offset-[-2px]
                                        transition-all
                                        duration-300
                                        ease-in-out
                                        cursor-pointer
                                        shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                                    "
                                    onClick={() => handleAlbumClick(review.albumId)}
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{review.albumName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs font-semibold">
                                            Rating: {formatRating(review.rating)}/5
                                        </p>
                                        <LikeButton 
                                            reviewId={review.id} 
                                            initialLikeCount={review.likeCount || 0}
                                            initialUserLiked={review.userLiked || false}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-paragraphColor mt-2 flex-grow">
                                {review.reviewText.length > 120 
                                    ? `${review.reviewText.substring(0, 120)}...` 
                                    : review.reviewText}
                            </p>
                            
                            <div className="mt-3 text-xs text-gray-500">
                                Reviewed by{' '}
                                <span 
                                    className="text-darkTeal cursor-pointer hover:underline"
                                    onClick={() => handleUserClick(review.User?.id || review.userId)}
                                >
                                    {review.User?.displayName || 'Anonymous User'}
                                </span>{' '}
                                on {formatDate(review.createdAt)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PopularReviews;
