import { createContext, useState, useEffect, useContext } from 'react';
import { fetchUserProfile } from '../services/api';

// Create the context
export const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize state from localStorage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        // Check URL parameters for user data
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const token = params.get('token');

        console.log('Auth Debug:', { userId, token, hasExistingUser: !!user });

        if (userId && token) {
            // Fetch user data from your backend
            fetchUserProfile(userId)
                .then(userData => {
                    console.log('Fetched user data:', userData);
                    const userObj = {
                        id: parseInt(userId),
                        name: userData.displayName,
                        profileImage: userData.profileImageUrl,
                        token
                    };
                    setUser(userObj);
                    // Save to localStorage
                    localStorage.setItem('user', JSON.stringify(userObj));
                    // Clear URL parameters
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    // Handle error (maybe redirect to login or show error message)
                });
        }
    }, []);

    const logout = () => {
        setUser(null);
        // Clear localStorage
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);