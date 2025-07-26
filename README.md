
# Weather Dashboard 🌦️

![Vercel](https://img.shields.io/badge/Frontend-Vercel-blue?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-green?logo=render)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange?logo=OpenWeatherMap)

Modern, full-stack weather dashboard to check current weather, 5-day forecast, compare cities, and view search history. Built with a secure Node.js/Express backend and a beautiful static frontend.

---

## 🚀 Live Demo

- **Frontend:** [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)  
- **Backend API:** [https://weather-explorer-s27g.onrender.com](https://weather-explorer-s27g.onrender.com)

---

## ✨ Features

- Search for current weather and 5-day forecast by city
- Animated weather backgrounds and icons
- Hourly forecast carousel
- Compare weather between two cities
- View/search history and favorites
- Secure: API key is never exposed to the frontend


---

## 🛠️ Local Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/Weather-Dashboard-1.git
   cd Weather-Dashboard-1
   ```
2. **Backend setup:**
   - Go to the `private` folder:
     ```sh
     cd private
     npm install
     cp .env.example .env # Add your OpenWeatherMap API key
     ```
   - Start backend locally:
     ```sh
     npm start
     ```
3. **Frontend:**
   - Open `index.html` in your browser, or deploy to Vercel for production.
   - Make sure `BACKEND_URL` in `assets/js/script.js` points to your backend.

---

## 🌐 Deployment

- **Backend:** Deployed to Render. Set `OPENWEATHER_API_KEY` in Render dashboard. Root directory: `private`.
- **Frontend:** Deploy the root folder to Vercel. No API keys in frontend code.

---

## 🔒 Security

- The OpenWeatherMap API key is stored only on the backend (`.env`), never in frontend code or public repos.
- All weather data requests from the frontend go through the backend for security.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.


