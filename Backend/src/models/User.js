// Backend/src/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the User model
const User = sequelize.define('User', {
  // Unique identifier for the user
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Spotify user ID
  spotifyId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  // User's display name from Spotify
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // User's email from Spotify
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // URL to the user's profile image
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Spotify access token (for API calls)
  accessToken: {
    type: DataTypes.TEXT, // TEXT type for longer tokens
    allowNull: true
  },
  
  // Spotify refresh token (to get new access tokens)
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // When the access token expires
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  // Additional model options
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: 'users' // Explicitly set table name
});

// Function to sync the model with the database
export const syncUserModel = async () => {
  try {
    await User.sync({ alter: true });
    console.log('User model synchronized with database');
  } catch (error) {
    console.error('Error synchronizing User model:', error);
  }
};

export default User;