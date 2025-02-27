import express from 'express';
import fetch from 'node-fetch';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config()
const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production'
    ? process.env.SPOTIFY_REDIRECT_URI_PROD
    : 'http://localhost:3001/auth/spotify/callback';
const FRONTEND_URI = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URI_PROD
    : 'http://localhost:5173';

router.get('/spotify', (req, res) => {
    const scope = 'user-read-private user-read-email user-top-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,

        }).toString()
    );
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
            return res.redirect(`${FRONTEND_URI}/auth-error`);
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
        
        res.redirect(`${FRONTEND_URI}?userId=${user.id}&token=${access_token}`);
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect(`${FRONTEND_URI}/auth-error`);
    }
});

export default router;
