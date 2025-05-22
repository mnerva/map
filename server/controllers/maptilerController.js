export const getMapTilerKey = (req, res) => {
  const key = process.env.MAPTILER_API_KEY;
  res.json({ apiKey: key });
};
