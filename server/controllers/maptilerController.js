export const getMapTilerKey = (req, res) => {
  if (req.headers.authorization !== process.env.SECRET_TOKEN) {
    return res.status(403).send('Forbidden');
  }
  res.json({ apiKey: process.env.MAPTILER_API_KEY });
};
