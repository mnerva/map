import pool from '../server.js';

export const fetchNature = async (req, res) => {
  try {
    const result = await pool.query("SELECT name, description, longitude, latitude FROM locations WHERE location_type = 'nature'");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching nature:", error);
    res.status(500).json({ error: "Failed to fetch nature" });
  }
};
