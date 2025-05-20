export const getMapTilerKey = (req, res) => {
  console.log("MapTiler controller loaded");
  res.json({ apiKey: process.env.MAPTILER_API_KEY });
};
