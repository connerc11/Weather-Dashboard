require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


// Proxy for current weather, UV, and forecast (combined for frontend)
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    // 1. Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
    const currentRes = await axios.get(currentUrl);
    const current = currentRes.data;

    // 2. Get UV index (use One Call API if available)
    let uv = { value: null };
    if (current.coord && current.coord.lat && current.coord.lon) {
      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${current.coord.lat}&lon=${current.coord.lon}&appid=${API_KEY}`;
      try {
        const uvRes = await axios.get(uvUrl);
        uv = { value: uvRes.data.value };
      } catch (e) {
        uv = { value: null };
      }
    }

    // 3. Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
    const forecastRes = await axios.get(forecastUrl);
    const forecast = forecastRes.data;

    // 4. Respond with all data
    res.json({ current, uv, forecast });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather/forecast/uv' });
  }
});

// Proxy for forecast
app.get('/api/forecast', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Weather proxy server running on port ${PORT}`);
});
