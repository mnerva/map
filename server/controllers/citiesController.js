import pool from '../server.js';

export const fetchCities = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, description, longitude, latitude, ST_AsGeoJSON(geom)::json AS polygon FROM locations WHERE location_type = 'city'");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};
