// Get the base URLs from environment variables
const API_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

// Remove trailing slashes if they exist
const cleanUrl = (url) => url?.replace(/\/+$/, '');

// Export the cleaned URLs
export const API_BASE_URL = cleanUrl(API_URL);
export const AUTH_BASE_URL = cleanUrl(AUTH_URL);

// Debug configuration
if (import.meta.env.DEV) {
    console.log('API Configuration:', {
        apiBaseUrl: API_BASE_URL,
        authBaseUrl: AUTH_BASE_URL,
        environment: import.meta.env.MODE
    });
} 