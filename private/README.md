# Weather Dashboard Backend

This is a Node.js Express backend server for the Weather Dashboard project. It securely stores the OpenWeatherMap API key in a `.env` file and proxies weather requests from the frontend.

## Features
- Proxies current weather and forecast requests
- Keeps API key secret (not exposed to frontend)
- CORS enabled for local development

## Usage
1. Copy `.env.example` to `.env` and add your OpenWeatherMap API key.
2. Run `npm install` to install dependencies.
3. Start the server: `node server.js`
4. The server runs on `http://localhost:3001` by default.

## Endpoints
- `/api/weather?city=CityName` — Get current weather
- `/api/forecast?city=CityName` — Get 5-day forecast

## Security
- Do not expose your API key in frontend code. Always use this backend as a proxy.
