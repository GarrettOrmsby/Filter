import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heart from '../../assets/heart.png';
import heartoutline from '../../assets/heart-outline.png';
import starrefilled from '../../assets/star-refilled.png';
import starhalf from '../../assets/star-half.png';


function ReviewSection({ album }) {
    const [isLiked, setIsLiked] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleStarHover = (starIndex, isHalfStar) => {
        setHoverRating(starIndex + (isHalfStar ? 0.5 : 1));
    };

    const handleStarClick = (starIndex, isHalfStar) => {
        setRating(starIndex + (isHalfStar ? 0.5 : 1));
    };

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        // Reset messages
        setError('');
        setSuccess('');
        
        // Validation checks
        if (!user) {
            setError('Please sign in to submit a review');
            return;
        }
        
        if (rating < 0.5) {
            setError('Please provide a rating (at least half a star)');
            return;
        }
        
        if (!reviewText.trim()) {
            setError('Please write a review');
            return;
        }
        
        // Debug album object
        console.log('Album object:', album);
        
        // Determine the correct album ID and name based on the album object structure
        const albumId = album.albumId;
        const albumName = album.albumName;
        
        if (!albumId || !albumName) {
            console.error('Missing album information:', { albumId, albumName, album });
            setError('Missing album information. Please try again.');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const reviewData = {
                albumId: albumId,
                albumName: albumName,
                albumImageUrl: album.images[0].url,
                rating: Number(rating),
                reviewText: reviewText
            };
            
            console.log('Submitting review data:', reviewData);
            console.log('User ID:', user.id);
            
            const response = await fetch('http://localhost:3001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(reviewData)
            });
            
            const responseData = await response.json();
            console.log('Response:', response.status, responseData);
            
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to submit review');
            }
            
            // Success!
            setSuccess('Your review has been submitted!');
            setReviewText('');
            setRating(0);
            
        } catch (error) {
            setError(error.message);
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        const activeRating = hoverRating || rating;

        for (let i = 0; i < 5; i++) {
            const isActiveHalf = activeRating > i && activeRating < i + 1;
            const isActiveFull = activeRating >= i + 1;

            stars.push(
                <div key={i} className="relative w-6 h-6 cursor-pointer">
                    <div 
                        className="absolute left-0 w-1/2 h-full z-10"
                        onMouseEnter={() => handleStarHover(i, true)}
                        onClick={() => handleStarClick(i, true)}
                    />
                    <div 
                        className="absolute right-0 w-1/2 h-full z-10"
                        onMouseEnter={() => handleStarHover(i, false)}
                        onClick={() => handleStarClick(i, false)}
                    />
                    <img 
                        src={
                            isActiveFull 
                                ? starrefilled
                                : isActiveHalf 
                                    ? starhalf 
                                    : starrefilled // You might want a different image for empty star
                        }
                        alt="star"
                        className={`w-6 h-6 ${!isActiveFull && !isActiveHalf ? 'opacity-30' : ''}`}
                    />
                </div>
            );
        }
        return stars;
    };

    return (
        <div className="review-section grid grid-cols-[2fr_1fr] gap-8">
            <div className="review-box flex flex-col gap-4">
                <div className="title-section flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-headingColor">{album.albumName}</h1>
                    <h2 className="
                        section-heading 
                        text-sm 
                        text-darkTeal
                        cursor-pointer
                        hover:underline
                        hover:text-darkTeal/80
                        transition-colors
                        duration-300
                        "
                        onClick={() => handleArtistClick(album.artists[0].id)}>
                            {album.artists[0].name}
                    </h2>
                </div>
                <div className="w-full h-[250px]">
                    <textarea 
                        placeholder="Write a review" 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="
                            w-full
                            h-full
                            p-4
                            border
                            border-gray-200
                            rounded-md
                            resize-none
                            overflow-y-auto
                            focus:outline-none
                            focus:ring-1
                            focus:ring-black
                        "
                    />
                </div>
                
                {error && (
                    <div className="text-red-500 text-sm ml-4">{error}</div>
                )}
                
                {success && (
                    <div className="text-green-500 text-sm ml-4">{success}</div>
                )}
                
                <button 
                    className="
                        w-fit
                        bg-lightTeal
                        bg-gradient-to-r from-lightTeal to-darkTeal
                        text-backgroundColor
                        px-4
                        py-2
                        text-sm
                        rounded-md
                        hover:bg-darkTeal
                        transition-colors
                        ml-4
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                    onClick={handleReviewSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            <div className="rate/create-buttons flex flex-col gap-4 max-w-[200px]">
                <div className="
                    rate-star-like-container
                    border border-gray-200
                    rounded-md
                    overflow-hidden
                    divide-y divide-gray-200
                ">
                    <div className="flex items-center p-3 gap-4 bg-gray-400">
                        <div className="like-button">
                            <button 
                                onClick={() => setIsLiked(!isLiked)}
                                className="hover:scale-110 transition-transform"
                            >
                                <img 
                                    src={isLiked ? heart : heartoutline}
                                    alt="heart"
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>
                        <div 
                            className="rate-star-container flex gap-1"
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            {renderStars()}
                        </div>
                    </div>
                    <div className="create-diary-entry-container p-3 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm">Create Diary Entry</p>
                    </div>
                    <div className="add-to-filter-container p-3 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm">Add to Filter</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewSection;