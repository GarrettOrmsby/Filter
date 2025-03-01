import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

// Define the Review model
const Review = sequelize.define('Review', {
  // Unique identifier for the review
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Foreign key to User model
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  // Spotify album ID the review is for
  albumId: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Album name (for easier querying without Spotify API)
  albumName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Album image URL (for displaying without Spotify API)
  albumImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Review content
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // Rating (e.g., 1-5 stars)
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.5,
      max: 5
    }
  },

  // Automatically managed by Sequelize
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  // Automatically managed by Sequelize
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  // Additional model options
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: 'reviews' // Explicitly set table name
});

// Define the relationship between User and Review
Review.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

// Function to sync the model with the database
export const syncReviewModel = async () => {
  try {
    await Review.sync({ alter: true });
    console.log('Review model synchronized with database');
  } catch (error) {
    console.error('Error synchronizing Review model:', error);
  }
};

export default Review;