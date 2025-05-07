const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3008;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API route to get API key
app.get('/api/maptiler-key', (req, res) => {
  res.json({ apiKey: process.env.MAPTILER_API_KEY });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
