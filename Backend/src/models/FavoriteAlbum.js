import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const FavoriteAlbum = sequelize.define('FavoriteAlbum', {
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
    albumId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    timestamps: true,
    tableName: 'favorite_albums'
});

FavoriteAlbum.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(FavoriteAlbum, { foreignKey: 'userId' });

export const syncFavoriteAlbumModel = async () => {
    try {
        await FavoriteAlbum.sync({ alter: true });
        console.log('FavoriteAlbum model synchronized with database');
    } catch (error) {
        console.error('Error synchronizing FavoriteAlbum model:', error);
    }
};

export default FavoriteAlbum;
