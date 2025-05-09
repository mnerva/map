import pool from '../server.js';

export const fetchCities = async (req, res) => {
  console.log("i am in the controller")
  try {
    const result = await pool.query("SELECT name, longitude, latitude FROM locations WHERE location_type = 'city'");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};
