import pool from '../server.js';

export const fetchFoodPlaces = async (req, res) => {
  try {
    const result = await pool.query("SELECT name, description, longitude, latitude FROM locations WHERE location_type = 'food'");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food places" });
  }
};