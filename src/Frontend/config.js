// Get the base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Remove trailing slashes if they exist
const cleanUrl = API_URL.replace(/\/+$/, '');

// Export the cleaned URLs
export const API_BASE_URL = cleanUrl;
export const AUTH_BASE_URL = cleanUrl.replace('/api', '/auth'); 