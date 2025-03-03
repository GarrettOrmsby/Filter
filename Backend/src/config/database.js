// Backend/src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ 
    path: process.env.NODE_ENV === 'production' 
        ? path.join(__dirname, '../../.env.production')
        : path.join(__dirname, '../../.env')
});

console.log('Current environment:', process.env.NODE_ENV);
console.log('Using database:', process.env.NODE_ENV === 'production' ? 'Render Database' : 'Local Database');

let sequelize;

if (process.env.NODE_ENV === 'production') {
    console.log('Initializing production database connection...');
    // Production configuration using DATABASE_URL
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false // Disable logging in production
    });
} else {
    console.log('Initializing development database connection...');
    // Development configuration using individual variables
    sequelize = new Sequelize(
        process.env.DB_NAME || 'filterd',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'password',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: console.log,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // Log more connection details
        console.log('Connected to:', sequelize.config.host);
        console.log('Database name:', sequelize.config.database);
        if (!process.env.NODE_ENV === 'production') {
            console.log('Database user:', sequelize.config.username);
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

export default sequelize;