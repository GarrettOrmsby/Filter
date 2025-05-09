import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { useAuth } from "../context/AuthContext";
import LikeButton from "../components/LikeButton";
import { API_BASE_URL } from '../config';

function RecentlyReviewed() {
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        console.log('Fetching recent reviews...');
        // Fetch recent reviews from the API
        fetch(`${API_BASE_URL}/reviews/recent?limit=5`, {
            headers: {
                // Include user ID if available for personalized like status
                ...(user && { 'user-id': user.id })
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || 'Failed to fetch reviews');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Recent reviews:', data);
                // Debug the structure of the first review
                if (data.length > 0) {
                    console.log('First review structure:', JSON.stringify(data[0], null, 2));
                    console.log('User property exists:', !!data[0].User);
                    console.log('User property keys:', data[0].User ? Object.keys(data[0].User) : 'N/A');
                }
                setRecentReviews(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching recent reviews:", error);
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
    
    // Format the date to a readable format
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
            <h2 className="section-heading">Recently Reviewed Albums</h2>
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <p>Loading recent reviews...</p>
                ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                ) : recentReviews.length === 0 ? (
                    <p>No reviews found. Be the first to review an album!</p>
                ) : (
                    recentReviews.map(review => (
                        <div key={review.id} className="flex gap-4">
                            <img 
                                src={review.albumImageUrl}
                                alt={review.albumName}
                                className="
                                    w-32 h-32 
                                    object-cover 
                                    rounded-sm
                                    hover:outline hover:outline-3 hover:outline-darkTeal
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
                                <h3 className="font-bold">{review.albumName}</h3>
                                <div className="text-sm">
                                    <div className="flex items-center gap-4 mb-2">
                                        <p className="font-semibold">
                                            Rating: {formatRating(review.rating)}/5
                                        </p>
                                        <LikeButton 
                                            reviewId={review.id} 
                                            initialLikeCount={review.likeCount || 0}
                                            initialUserLiked={review.userLiked || false}
                                        />
                                    </div>
                                    <p className="text-paragraphColor mt-2">
                                        {review.reviewText.length > 200 
                                            ? `${review.reviewText.substring(0, 200)}...` 
                                            : review.reviewText}
                                    </p>
                                    <p className="mt-2 text-gray-500">
                                        Reviewed by{' '}
                                        <span 
                                            className="text-darkTeal cursor-pointer hover:underline"
                                            onClick={() => handleUserClick(review.User?.id || review.userId)}
                                        >
                                            {review.User?.displayName || 'Anonymous User'}
                                        </span>{' '}
                                        on {formatDate(review.createdAt)}
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