import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for authentication on mount
        const checkAuth = () => {
            setLoading(true);
            
            // Check if token is expired
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
                // Clear expired tokens
                console.log('Token expired, clearing authentication data');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                setUser(null);
                setLoading(false);
                return;
            }
            
            // Check for auth in localStorage
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            if (userId && token) {
                // User is already logged in
                setUser({
                    id: userId,
                    name: localStorage.getItem('userName') || 'User',
                    profileImage: localStorage.getItem('userProfileImage')
                });
            } else {
                // Check URL parameters for auth response
                const params = new URLSearchParams(window.location.search);
                const newUserId = params.get('userId');
                const newToken = params.get('token');
                
                if (newUserId && newToken) {
                    // Set expiration (7 days from now)
                    const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
                    localStorage.setItem('tokenExpiry', expiryTime);
                    
                    // Store auth data
                    localStorage.setItem('userId', newUserId);
                    localStorage.setItem('token', newToken);
                    
                    // Fetch user details if needed
                    fetchUserDetails(newUserId, newToken);
                    
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
            
            setLoading(false);
        };
        
        const fetchUserDetails = async (userId, token) => {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    
                    // Store user data
                    localStorage.setItem('userName', userData.displayName);
                    localStorage.setItem('userProfileImage', userData.profileImageUrl);
                    
                    setUser({
                        id: userId,
                        name: userData.displayName,
                        profileImage: userData.profileImageUrl
                    });
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        
        checkAuth();
    }, []);
    
    // Logout function
    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userName');
        localStorage.removeItem('userProfileImage');
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);