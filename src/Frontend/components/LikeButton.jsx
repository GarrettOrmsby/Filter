import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import heart from '../../assets/heart.png';
import heartoutline from '../../assets/heart-outline.png';
import { API_BASE_URL } from '../config';

function LikeButton({ reviewId, initialLikeCount = 0, initialUserLiked = false }) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [userLiked, setUserLiked] = useState(initialUserLiked);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    
    useEffect(() => {
        // Update state if props change (e.g., when navigating between reviews)
        setLikeCount(initialLikeCount);
        setUserLiked(initialUserLiked);
    }, [initialLikeCount, initialUserLiked, reviewId]);
    
    const handleLikeToggle = async () => {
        if (!user) {
            // If user is not logged in, prompt them to log in
            alert('Please sign in to like reviews');
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Optimistically update UI
            const newLikedState = !userLiked;
            setUserLiked(newLikedState);
            setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
            
            // Send request to server
            const response = await fetch(`${API_BASE_URL}/likes/toggle/${reviewId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // If request failed, revert the optimistic update
                setUserLiked(!newLikedState);
                setLikeCount(prevCount => !newLikedState ? prevCount + 1 : prevCount - 1);
                console.error('Error toggling like:', data.error);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert optimistic update on error
            setUserLiked(!userLiked);
            setLikeCount(prevCount => userLiked ? prevCount + 1 : prevCount - 1);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="like-button-container flex items-center gap-2">
            <button 
                onClick={handleLikeToggle}
                disabled={isLoading}
                className={`hover:scale-110 transition-transform ${isLoading ? 'opacity-50' : ''}`}
                aria-label={userLiked ? 'Unlike' : 'Like'}
            >
                <img 
                    src={userLiked ? heart : heartoutline}
                    alt="heart"
                    className="w-6 h-6"
                />
            </button>
            <span className="text-sm font-medium">{likeCount}</span>
        </div>
    );
}

export default LikeButton; 