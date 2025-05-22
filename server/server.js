import dotenv from 'dotenv';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import pkg from "pg";
import maptilerRoutes from './routes/maptilerRoutes.js';
import locationsRoutes from './routes/citiesRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import natureRoutes from './routes/natureRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const { Pool } = pkg;
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const port = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Use routes
app.use('/map-tiler', maptilerRoutes);
app.use('/cities', locationsRoutes);
app.use('/food', foodRoutes);
app.use('/books', booksRoutes);
app.use('/nature', natureRoutes);
app.use('/search', searchRoutes)

process.on('uncaughtException', function (err) {
  console.log(err);
}); 

process.on('unhandledRejection', function (reason, promise) {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// Test the connection to the database
pool.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

export default pool;