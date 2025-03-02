import Review  from "./Review.js";
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Like = sequelize.define('Like', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reviews',
            key: 'id'
        }
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }


}, {
    timestamps: true,
    tableName: 'likes',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'reviewId'],
            name: 'likes_user_review_unique'
        }
    ]
});

Like.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Like, { foreignKey: 'userId' });

// Establish relationship with Review model
Like.belongsTo(Review, { foreignKey: 'reviewId' });
Review.hasMany(Like, { foreignKey: 'reviewId' });

export const syncLikeModel = async () => {
    try {
        await Like.sync({ alter: true });
        console.log('Like model synchronized with database');
    } catch (error) {
        console.error('Error synching Like model: ', error);
    }
};

export default Like;