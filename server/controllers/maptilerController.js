export const getMapTilerKey = (req, res) => {
  console.log("MapTiler controller loaded");
  const key = process.env.MAPTILER_API_KEY;
  console.log("API Key:", key);
  res.json({ apiKey: key });
};
