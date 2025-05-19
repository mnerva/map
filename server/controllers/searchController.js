import pool from '../server.js';

export const fetchSearch = async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm || searchTerm.trim().length < 2) {
    return res.json([]);
  }

  try {
    const result = await pool.query(`
      SELECT name, description, longitude, latitude 
      FROM locations 
      WHERE LOWER(name) LIKE LOWER($1)
       ORDER BY name ASC
       LIMIT 10`,
      [`${searchTerm}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching search:", error);
    res.status(500).json({ error: "Failed to fetch search" });
  }
};