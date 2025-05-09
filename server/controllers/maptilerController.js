export const getMapTilerKey = (req, res) => {
  res.json({ apiKey: process.env.MAPTILER_API_KEY });
};
