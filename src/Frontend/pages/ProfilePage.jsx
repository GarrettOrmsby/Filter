import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../HomePageComponents/NavBar';
import contentBg from '../../assets/content-bg.4284ab72.png';
import { useAuth } from '../context/AuthContext';
import UserReviews from '../ProfilePageComponents/UserReviews';
import FavoriteAlbums from '../ProfilePageComponents/FavoriteAlbums';
import ProfileHeader from '../ProfilePageComponents/ProfileHeader';
import { fetchUserProfile } from '../services/api';

function ProfilePage() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const isOwnProfile = currentUser && currentUser.id.toString() === userId?.toString();
    
    console.log('ProfilePage Debug:', {
        userId,
        currentUser,
        isOwnProfile,
        profileData
    });

    useEffect(() => {
        if (userId) {
            fetchUserProfile(userId)
                .then(data => {
                    setProfileData(data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [userId]);

    if (loading) return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main style={{
                background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                width: '100vw'
            }} className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pt-8">
                    Loading...
                </div>
            </main>
        </div>
    );

    if (error) return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main style={{
                background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                width: '100vw'
            }} className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pt-8">
                    Error: {error}
                </div>
            </main>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main style={{
                    background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                    width: '100vw'
                }}
                className="min-h-screen"
            >
                <div className="max-w-5xl mx-auto px-4 space-y-8 pt-8">
                    <ProfileHeader 
                        user={profileData}
                        reviewCount={profileData?.reviewCount || 0}
                    />
                    
                    <FavoriteAlbums 
                        userId={userId} 
                        isOwnProfile={isOwnProfile}
                    />
                    
                    <UserReviews userId={userId} />
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;
