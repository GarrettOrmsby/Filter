import { useState } from 'react';
import heart from '../../assets/heart.png';
import heartoutline from '../../assets/heart-outline.png';
import starrefilled from '../../assets/star-refilled.png';
import starhalf from '../../assets/star-half.png';

function ReviewSection({ album }) {
    const [isLiked, setIsLiked] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleStarHover = (starIndex, isHalfStar) => {
        setHoverRating(starIndex + (isHalfStar ? 0.5 : 1));
    };

    const handleStarClick = (starIndex, isHalfStar) => {
        setRating(starIndex + (isHalfStar ? 0.5 : 1));
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
                    <h2 className="section-heading text-sm text-darkTeal">{album.artists[0].name}</h2>
                </div>
                <div className="w-full h-[300px]">
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
                <button className="
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
                ">
                    Submit
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
                    <div className="flex items-center p-3 gap-4">
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