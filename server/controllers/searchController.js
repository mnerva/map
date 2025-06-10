import pool from '../server.js';

export const fetchSearch = async (req, res) => {
  const searchTerm = req.query.q;

  // Basic validation: check existence, length, and allowed characters
  if (
    !searchTerm ||
    searchTerm.trim().length < 2 ||
    !/^[a-zA-Z\s]+$/.test(searchTerm)
  ) {
    return res.json([]);
  }

  // Sanitize: trim and limit length
  searchTerm = searchTerm.trim().substring(0, 50);

  try {
    const result = await pool.query(`
      SELECT name, description, longitude, latitude 
      FROM locations 
      WHERE LOWER(name) LIKE LOWER($1)
       ORDER BY name ASC
       LIMIT 10`,
      [`%${searchTerm}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch search" });
  }
};