import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const token = urlParams.get('token');

        if (userId && token) {
            fetch(`http://localhost:3001/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(userData => {
                const user = {
                    id: userData.id,
                    name: userData.displayName,
                    email: userData.email,
                    profileImage: userData.profileImageUrl,
                    token: token
                };

                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));

                window.history.replaceState({}, document.title, '/');
            })
            .catch(err => {
                console.error('Error fetching user data:', err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}