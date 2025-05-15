import pool from '../server.js';

export const fetchCities = async (req, res) => {
  try {
    const result = await pool.query("SELECT name, description, longitude, latitude FROM locations WHERE location_type = 'city'");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};
