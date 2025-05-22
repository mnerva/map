export const getMapTilerKey = (req, res) => {
  console.log("MapTiler controller loaded");
  console.log("API Key:", process.env.MAPTILER_API_KEY);
  res.json({ apiKey: process.env.MAPTILER_API_KEY });
};
