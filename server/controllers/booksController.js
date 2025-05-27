import pool from '../server.js';

export const fetchBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT name, description, longitude, latitude FROM locations WHERE location_type = 'books'");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};