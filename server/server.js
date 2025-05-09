import dotenv from 'dotenv';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import pkg from "pg";
import maptilerRoutes from './routes/maptilerRoutes.js';
// import locationsRouter from './routes/locationsRoutes';

const { Pool } = pkg;
dotenv.config();

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
// app.use('/api/locations', locationsRouter);
app.use('/map-tiler', maptilerRoutes);

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/map-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).send("Database connection failed");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
