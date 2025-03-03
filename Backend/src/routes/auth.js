import express from 'express';
import fetch from 'node-fetch';
import User from '../models/User.js';
import dotenv from 'dotenv';
import querystring from 'querystring';
import { createUser, findOrCreateUser } from '../services/userService.js';

// Load environment variables
dotenv.config();

const router = express.Router();

// Validate required environment variables
const requiredEnvVars = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'NODE_ENV'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
    }
}

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Use environment variables for URLs
const FRONTEND_URL = process.env.FRONTEND_URI || 'http://localhost:5173';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3001/auth/spotify/callback';

router.get('/spotify', (req, res) => {
    // Add CSP headers
    res.setHeader('Content-Security-Policy', "default-src 'self' https://accounts.spotify.com");
    
    // Validate configuration
    if (!CLIENT_ID) {
        console.error('Missing Spotify Client ID');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Auth Debug Info:', {
        environment: process.env.NODE_ENV,
        redirectUri: REDIRECT_URI,
        frontendUrl: FRONTEND_URL,
        clientIdExists: !!CLIENT_ID
    });

    const scope = 'user-read-private user-read-email user-top-read';
    
    const authQueryParams = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI
    });

    console.log('Auth URL:', `https://accounts.spotify.com/authorize?${authQueryParams}`);
    
    res.redirect('https://accounts.spotify.com/authorize?' + authQueryParams);
});

router.get('/spotify/callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }).toString()
        });
        
        const data = await response.json();
        
        if (data.error) {
            return res.redirect(`${FRONTEND_URL}/auth-error`);
        }
        
        const { access_token, refresh_token, expires_in } = data;
        
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + access_token }
        });
        
        const userData = await userResponse.json();
        
        const [user, created] = await User.findOrCreate({
            where: { spotifyId: userData.id },
            defaults: {
                displayName: userData.display_name,
                email: userData.email,
                profileImageUrl: userData.images[0]?.url || null,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiry: new Date(Date.now() + expires_in * 1000)
            }
        });
        
        if (!created) {
            await user.update({
                displayName: userData.display_name,
                email: userData.email,
                profileImageUrl: userData.images[0]?.url || null,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiry: new Date(Date.now() + expires_in * 1000)
            });
        }
        
        res.redirect(`${FRONTEND_URL}?userId=${user.id}&token=${access_token}`);
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect(`${FRONTEND_URL}/auth-error`);
    }
});

export default router;
