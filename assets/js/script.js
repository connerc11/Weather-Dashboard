// Place APIKey at the top-level scope so all functions can access it
const APIKey = "0ab31758ba7256fe2d1bebcb97953927";

function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];



function getWeather(cityName) {
    // Execute a current weather get request from open weather api
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    axios.get(queryURL)
        .then(function (response) {
            todayweatherEl.classList.remove("d-none");

            // Parse response to display current weather
            const currentDate = new Date(response.data.dt * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";

            // Weather background and animation
            setWeatherBackground(response.data.weather[0].main);

            // Animated weather icon
            setAnimatedWeatherIcon(response.data.weather[0].main, currentPicEl, response.data.weather[0].icon);

            // Feels like
            const feelsLikeEl = document.getElementById("feels-like");
            feelsLikeEl.innerHTML = "Feels like: " + tempC(response.data.main.feels_like) + " &#176F";

            // Sunrise/Sunset
            const sunriseEl = document.getElementById("sunrise");
            const sunsetEl = document.getElementById("sunset");
            const sunrise = new Date(response.data.sys.sunrise * 1000);
            const sunset = new Date(response.data.sys.sunset * 1000);
            sunriseEl.innerHTML = "Sunrise: " + sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            sunsetEl.innerHTML = "Sunset: " + sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            currentTempEl.innerHTML = "Temperature: " + tempC(response.data.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

            // Get UV Index
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    if (response.data[0].value < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    UVIndex.innerHTML = response.data[0].value;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVIndex);
                });

            // Get 5 day forecast for this city
            let cityID = response.data.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            axios.get(forecastQueryURL)
                .then(function (response) {
                    fivedayEl.classList.remove("d-none");
                    const forecastEls = document.querySelectorAll(".forecast");
                    for (i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);

                        // Animated icon for forecast
                        const forecastWeatherEl = document.createElement("img");
                        setAnimatedWeatherIcon(response.data.list[forecastIndex].weather[0].main, forecastWeatherEl, response.data.list[forecastIndex].weather[0].icon);
                        forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        forecastEls[i].append(forecastWeatherEl);
                        const forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + tempC(response.data.list[forecastIndex].main.temp) + " &#176F";
                        forecastEls[i].append(forecastTempEl);
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                })
        });
// Set animated weather icon based on weather condition
function setAnimatedWeatherIcon(condition, imgEl, iconCode) {
    let fallbackUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/PNG/128/na.png';
    imgEl.src = fallbackUrl;
    imgEl.classList.add('animated-weather');
}

// Set weather-themed background and animation
function setWeatherBackground(condition) {
    const bg = document.getElementById('weather-bg-animation');
    let gradient = '';
    let animation = '';
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            gradient = 'linear-gradient(120deg, #fceabb 0%, #f8b500 100%)';
            animation = 'sunny';
            break;
        case 'clouds':
            gradient = 'linear-gradient(120deg, #d7d2cc 0%, #304352 100%)';
            animation = 'clouds';
            break;
        case 'rain':
        case 'drizzle':
            gradient = 'linear-gradient(120deg, #4e54c8 0%, #8f94fb 100%)';
            animation = 'rain';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(120deg, #232526 0%, #414345 100%)';
            animation = 'thunderstorm';
            break;
        case 'snow':
            gradient = 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
            animation = 'snow';
            break;
        case 'mist':
        case 'fog':
            gradient = 'linear-gradient(120deg, #cfd9df 0%, #e2ebf0 100%)';
            animation = 'fog';
            break;
        default:
            gradient = 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
            animation = '';
    }
    document.body.style.background = gradient;
    // Remove previous animation
    bg.innerHTML = '';
    // Add simple SVG or CSS animation for demo (expand as needed)
    if (animation === 'rain') {
        bg.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:0;">
            <svg width="100%" height="100%">
                <g>
                    <rect x="10%" y="10%" width="2" height="30" fill="#8f94fb" opacity="0.5">
                        <animate attributeName="y" values="10%;90%;10%" dur="1s" repeatCount="indefinite" />
                    </rect>
                    <rect x="30%" y="20%" width="2" height="30" fill="#8f94fb" opacity="0.5">
                        <animate attributeName="y" values="20%;95%;20%" dur="1.2s" repeatCount="indefinite" />
                    </rect>
                    <rect x="60%" y="15%" width="2" height="30" fill="#8f94fb" opacity="0.5">
                        <animate attributeName="y" values="15%;92%;15%" dur="0.9s" repeatCount="indefinite" />
                    </rect>
                </g>
            </svg>
        </div>`;
    } else if (animation === 'clouds') {
        bg.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:0;">
            <svg width="100%" height="100%">
                <ellipse cx="20%" cy="20%" rx="60" ry="30" fill="#fff" opacity="0.4">
                    <animate attributeName="cx" values="20%;80%;20%" dur="12s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="60%" cy="30%" rx="80" ry="40" fill="#fff" opacity="0.3">
                    <animate attributeName="cx" values="60%;10%;60%" dur="18s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        </div>`;
    } else if (animation === 'sunny') {
        bg.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:0;">
            <svg width="100%" height="100%">
                <circle cx="90" cy="90" r="40" fill="#ffe066" opacity="0.7">
                    <animate attributeName="r" values="40;50;40" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>
        </div>`;
    } else if (animation === 'snow') {
        bg.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:0;">
            <svg width="100%" height="100%">
                <circle cx="20%" cy="10%" r="6" fill="#fff" opacity="0.7">
                    <animate attributeName="cy" values="10%;90%;10%" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="60%" cy="20%" r="5" fill="#fff" opacity="0.6">
                    <animate attributeName="cy" values="20%;95%;20%" dur="5s" repeatCount="indefinite" />
                </circle>
            </svg>
        </div>`;
    } else if (animation === 'fog') {
        bg.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:0;">
            <svg width="100%" height="100%">
                <rect x="0" y="60%" width="100%" height="40" fill="#fff" opacity="0.2">
                    <animate attributeName="y" values="60%;65%;60%" dur="6s" repeatCount="indefinite" />
                </rect>
            </svg>
        </div>`;
    }
}
}

// Get history from local storage if any
searchEl.addEventListener("click", function () {
    const searchTerm = cityEl.value;
    if (!searchTerm.trim()) {
        showSearchMessage('Please enter a city name.', true);
        return;
    }
    showSearchMessage('Searching for "' + searchTerm + '"...');
    axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + APIKey)
        .then(function (response) {
            getWeather(searchTerm);
            searchHistory.push(searchTerm);
            localStorage.setItem("search", JSON.stringify(searchHistory));
            renderSearchHistory();
            cityEl.value = "";
            showSearchMessage('Weather for "' + searchTerm + '" loaded!', false);
        })
        .catch(function (error) {
            showSearchMessage('City not found. Please try again.', true);
        });
})

// Clear History button
clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

function showSearchMessage(msg, isError = false) {
    let msgEl = document.getElementById('user-message');
    if (!msgEl) return;
    msgEl.innerText = msg;
    msgEl.classList.remove('error', 'success');
    msgEl.classList.add(isError ? 'error' : 'success');
    msgEl.style.opacity = 1;
    setTimeout(() => { msgEl.style.opacity = 0; }, 2000);
}

function tempC(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

function renderSearchHistory() {
    historyEl.innerHTML = "";
    searchHistory.forEach((city, idx) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.marginBottom = "0.5rem";
        // Card style for search history items
        wrapper.style.border = "1.5px solid #e0e0e0";
        wrapper.style.background = "rgba(255,255,255,0.25)";
        wrapper.style.backdropFilter = "blur(4px)";
        wrapper.style.borderRadius = "12px";
        wrapper.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";

        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white searched-city-item");
        historyItem.setAttribute("value", city);
        historyItem.style.flex = "1";
        historyItem.style.background = "rgba(255,255,255,0.7)";
        historyItem.style.border = "none";
        historyItem.style.fontWeight = "bold";
        historyItem.style.fontSize = "1rem";
        historyItem.style.letterSpacing = "0.5px";
        historyItem.style.color = "#222";
        historyItem.style.cursor = "pointer";
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "<span style='font-size:1.2rem;font-weight:bold;'>X</span>";
        deleteBtn.setAttribute("class", "delete-city-btn");
        deleteBtn.style.marginLeft = "8px";
        deleteBtn.style.background = "#fa709a";
        deleteBtn.style.color = "#fff";
        deleteBtn.style.border = "3px solid #222";
        deleteBtn.style.borderRadius = "50%";
        deleteBtn.style.width = "36px";
        deleteBtn.style.height = "36px";
        deleteBtn.style.fontSize = "1.2rem";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.display = "flex";
        deleteBtn.style.alignItems = "center";
        deleteBtn.style.justifyContent = "center";
        deleteBtn.style.zIndex = "10";
        deleteBtn.title = "Delete this city";
        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            searchHistory.splice(idx, 1);
            localStorage.setItem("search", JSON.stringify(searchHistory));
            renderSearchHistory();
        });

        wrapper.appendChild(historyItem);
        wrapper.appendChild(deleteBtn);
        historyEl.appendChild(wrapper);
    });
}

// --- Hourly Forecast Carousel ---
function renderHourlyForecast(hourlyData) {
    const carousel = document.getElementById('hourly-forecast-carousel');
    if (!carousel) return;
    if (!hourlyData || hourlyData.length === 0) {
        carousel.style.display = 'none';
        return;
    }
    carousel.innerHTML = '';
    hourlyData.forEach(hour => {
        const item = document.createElement('div');
        item.className = 'hourly-forecast-item';
        item.innerHTML = `
            <div class="hourly-forecast-time">${hour.time}</div>
            <img class="hourly-forecast-icon" src="${hour.icon}" alt="${hour.desc}">
            <div class="hourly-forecast-temp">${hour.temp}&#176;F</div>
        `;
        carousel.appendChild(item);
    });
    carousel.style.display = 'flex';
}

// --- Animated Weather Effects Overlay ---
function setWeatherEffectsOverlay(condition) {
    const overlay = document.getElementById('weather-effects-overlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    if (!condition) return;
    const cond = condition.toLowerCase();
    if (cond === 'rain' || cond === 'drizzle') {
        // Simple animated rain effect
        overlay.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:10;pointer-events:none;">
            <svg width="100%" height="100%">
                <g>
                    <rect x="12%" y="10%" width="2" height="30" fill="#8f94fb" opacity="0.4">
                        <animate attributeName="y" values="10%;90%;10%" dur="0.8s" repeatCount="indefinite" />
                    </rect>
                    <rect x="32%" y="20%" width="2" height="30" fill="#8f94fb" opacity="0.4">
                        <animate attributeName="y" values="20%;95%;20%" dur="1.1s" repeatCount="indefinite" />
                    </rect>
                    <rect x="62%" y="15%" width="2" height="30" fill="#8f94fb" opacity="0.4">
                        <animate attributeName="y" values="15%;92%;15%" dur="0.7s" repeatCount="indefinite" />
                    </rect>
                </g>
            </svg>
        </div>`;
    } else if (cond === 'snow') {
        // Simple animated snow effect
        overlay.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:10;pointer-events:none;">
            <svg width="100%" height="100%">
                <circle cx="18%" cy="10%" r="6" fill="#fff" opacity="0.7">
                    <animate attributeName="cy" values="10%;90%;10%" dur="3.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="55%" cy="20%" r="5" fill="#fff" opacity="0.6">
                    <animate attributeName="cy" values="20%;95%;20%" dur="4.2s" repeatCount="indefinite" />
                </circle>
            </svg>
        </div>`;
    } else if (cond === 'thunderstorm') {
        // Simple animated lightning effect
        overlay.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:10;pointer-events:none;">
            <svg width="100%" height="100%">
                <polyline points="50,10 55,30 45,30 50,50" fill="none" stroke="#fffbe6" stroke-width="4">
                    <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" />
                </polyline>
            </svg>
        </div>`;
    } else if (cond === 'fog' || cond === 'mist') {
        // Simple animated fog effect
        overlay.innerHTML = `<div style="position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:10;pointer-events:none;">
            <svg width="100%" height="100%">
                <rect x="0" y="70%" width="100%" height="40" fill="#fff" opacity="0.13">
                    <animate attributeName="y" values="70%;75%;70%" dur="5s" repeatCount="indefinite" />
                </rect>
            </svg>
        </div>`;
    }
}

// --- Patch getWeather to fetch and render hourly forecast, and trigger overlay ---
const origGetWeather = getWeather;
getWeather = function(cityName) {
    origGetWeather(cityName);
    // Fetch hourly forecast from OpenWeatherMap 5-day/3-hour API
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${APIKey}`;
    axios.get(queryURL).then(function(response) {
        const list = response.data.list;
        const now = new Date();
        const hourly = [];
        for (let i = 0; i < 8; i++) { // Next 24 hours (3-hour intervals)
            const entry = list[i];
            const dt = new Date(entry.dt * 1000);
            hourly.push({
                time: dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                temp: tempC(entry.main.temp),
                icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`,
                desc: entry.weather[0].description
            });
        }
        renderHourlyForecast(hourly);
    });
    // Also set animated overlay based on current weather
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${APIKey}`).then(function(response) {
        setWeatherEffectsOverlay(response.data.weather[0].main);
    });
};

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
} else {
    // Show general weather for a default city on first load
    getWeather('Arlington, Virginia');
}

}

// --- Tab Navigation Logic ---
window.showTab = function(tab) {
    document.getElementById('page-dashboard').style.display = (tab === 'dashboard') ? '' : 'none';
    document.getElementById('page-compare').style.display = (tab === 'compare') ? '' : 'none';
    document.getElementById('page-favorites').style.display = (tab === 'favorites') ? '' : 'none';
    document.getElementById('tab-dashboard').classList.toggle('active', tab === 'dashboard');
    document.getElementById('tab-compare').classList.toggle('active', tab === 'compare');
    document.getElementById('tab-favorites').classList.toggle('active', tab === 'favorites');
};

// --- Compare Page Logic (stub) ---
document.addEventListener('DOMContentLoaded', function() {
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            const city1 = document.getElementById('compare-city-1').value.trim();
            const city2 = document.getElementById('compare-city-2').value.trim();
            const results = document.getElementById('compare-results');
            if (!city1 || !city2) {
                results.innerHTML = `<div class='alert alert-danger'>Please enter both cities to compare.</div>`;
                return;
            }
            results.innerHTML = '<div>Loading...</div>';
            Promise.all([
                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city1)}&appid=${APIKey}`),
                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city2)}&appid=${APIKey}`)
            ]).then(([res1, res2]) => {
                const data1 = res1.data;
                const data2 = res2.data;
                function tempF(K) { return Math.floor((K - 273.15) * 1.8 + 32); }
                const fields = [
                    { label: 'Temperature', key: 'temp', format: v => tempF(v) + '°F' },
                    { label: 'Feels Like', key: 'feels_like', format: v => tempF(v) + '°F' },
                    { label: 'Humidity', key: 'humidity', format: v => v + '%' },
                    { label: 'Wind Speed', key: 'wind', format: v => v.speed + ' MPH' },
                    { label: 'Weather', key: 'weather', format: v => v[0].main }
                ];
                function card(city, data) {
                    return `<div class='card glass-card p-3 m-2' style='min-width:220px;'>
                        <h5>${city}</h5>
                        <img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' alt='' style='width:48px;height:48px;'>
                        <ul class='list-unstyled mt-2 mb-0'>
                            <li><b>Temperature:</b> ${tempF(data.main.temp)}°F</li>
                            <li><b>Feels Like:</b> ${tempF(data.main.feels_like)}°F</li>
                            <li><b>Humidity:</b> ${data.main.humidity}%</li>
                            <li><b>Wind:</b> ${data.wind.speed} MPH</li>
                            <li><b>Weather:</b> ${data.weather[0].main}</li>
                        </ul>
                    </div>`;
                }
                // Highlight differences
                function diffStyle(val1, val2, isNum) {
                    if (val1 === val2) return '';
                    if (isNum && val1 > val2) return 'color:#43e97b;font-weight:bold;';
                    if (isNum && val1 < val2) return 'color:#fa709a;font-weight:bold;';
                    return 'text-decoration:underline;';
                }
                let diffTable = `<div class='row justify-content-center'><div class='col-md-5'>
                    <div class='d-flex flex-row justify-content-center'>${card(city1, data1)}${card(city2, data2)}</div>
                    <div class='glass-card p-3 mt-3'>
                        <h6 class='mb-2'>Key Differences</h6>
                        <table class='table table-sm mb-0'><tbody>`;
                fields.forEach(f => {
                    let v1 = f.key === 'wind' ? data1.wind : (f.key === 'weather' ? data1.weather : data1.main[f.key]);
                    let v2 = f.key === 'wind' ? data2.wind : (f.key === 'weather' ? data2.weather : data2.main[f.key]);
                    let isNum = typeof (f.key === 'wind' ? v1.speed : v1) === 'number';
                    let disp1 = f.format(v1);
                    let disp2 = f.format(v2);
                    diffTable += `<tr><td>${f.label}</td><td style='${diffStyle(v1, v2, isNum)}'>${disp1}</td><td style='${diffStyle(v2, v1, isNum)}'>${disp2}</td></tr>`;
                });
                diffTable += `</tbody></table></div></div></div>`;
                results.innerHTML = diffTable;
            }).catch(() => {
                results.innerHTML = `<div class='alert alert-danger'>Could not fetch weather for one or both cities. Please check spelling and try again.</div>`;
            });
        });
    }
    // --- History Page Logic ---
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            const city = document.getElementById('history-city').value.trim();
            const date = document.getElementById('history-date').value;
            const results = document.getElementById('history-results');
            results.innerHTML = '<div>Loading...</div>';
            if (!city || !date) {
                results.innerHTML = `<div class='alert alert-danger'>Please enter both a city and a date.</div>`;
                return;
            }
            // Calculate UNIX timestamp for selected date at noon UTC
            const selectedDate = new Date(date);
            const now = new Date();
            const daysAgo = Math.floor((now - selectedDate) / (1000 * 60 * 60 * 24));
            if (daysAgo < 0) {
                results.innerHTML = `<div class='alert alert-warning'>Cannot show weather for future dates. Please select a past date.</div>`;
                return;
            }
            if (daysAgo > 5) {
                results.innerHTML = `<div class='alert alert-warning'>Sorry, free historical weather data is only available for the last 5 days.</div>`;
                return;
            }
            // Step 1: Get city coordinates
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${APIKey}`)
                .then(function(res) {
                    const { lat, lon } = res.data.coord;
                    // Step 2: Get historical weather for that date (at noon)
                    const dt = Math.floor(selectedDate.setUTCHours(12,0,0,0) / 1000);
                    return axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${APIKey}`);
                })
                .then(function(res) {
                    const data = res.data;
                    // Find the hour closest to noon
                    let hourData = data.hourly && data.hourly.length ? data.hourly[Math.floor(data.hourly.length/2)] : null;
                    if (!hourData) {
                        results.innerHTML = `<div class='alert alert-warning'>No data found for this date.</div>`;
                        return;
                    }
                    function tempF(K) { return Math.floor((K - 273.15) * 1.8 + 32); }
                    results.innerHTML = `
                        <div class='card glass-card p-3'>
                            <h5>${city} on ${date}</h5>
                            <img src='https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png' alt='' style='width:48px;height:48px;'>
                            <ul class='list-unstyled mt-2 mb-0'>
                                <li><b>Temperature:</b> ${tempF(hourData.temp)}°F</li>
                                <li><b>Feels Like:</b> ${tempF(hourData.feels_like)}°F</li>
                                <li><b>Humidity:</b> ${hourData.humidity}%</li>
                                <li><b>Wind:</b> ${hourData.wind_speed} MPH</li>
                                <li><b>Weather:</b> ${hourData.weather[0].main}</li>
                            </ul>
                        </div>
                    `;
                })
                .catch(function() {
                    results.innerHTML = `<div class='alert alert-danger'>Could not fetch historical weather for this city and date. (Note: Only the last 5 days are available for free.)</div>`;
                });
        });
    }
});

window.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// --- Favorites Page Logic ---
function getWeatherFact(city, weather) {
    // Simple fun facts based on weather type
    const facts = {
        Clear: `Did you know? The sun is about 93 million miles from Earth!`,
        Clouds: `Clouds are made of tiny water droplets or ice crystals that float in the air.`,
        Rain: `Raindrops can fall at speeds of about 22 miles per hour!`,
        Snow: `No two snowflakes are exactly alike!`,
        Thunderstorm: `Lightning can heat the air to 5x hotter than the sun's surface!`,
        Mist: `Fog is just a cloud that touches the ground!`,
        Drizzle: `Drizzle is made of very small, light rain drops.`
    };
    return facts[weather] || `Weather is amazing!`;
}

function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const list = document.getElementById('favorites-list');
    const facts = document.getElementById('favorite-facts');
    list.innerHTML = '';
    facts.innerHTML = '';
    if (!favorites.length) {
        list.innerHTML = `<div class='alert alert-info'>No favorite cities yet. Add one above!</div>`;
        return;
    }
    favorites.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary m-1';
        btn.innerText = city;
        btn.onclick = function() {
            facts.innerHTML = 'Loading...';
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${APIKey}`)
                .then(res => {
                    const weather = res.data.weather[0].main;
                    const fact = getWeatherFact(city, weather);
                    facts.innerHTML = `<div class='card glass-card p-3 mt-2'><h5>${city}</h5><p><b>Current Weather:</b> ${weather}</p><p>${fact}</p></div>`;
                })
                .catch(() => {
                    facts.innerHTML = `<div class='alert alert-danger'>Could not fetch weather for ${city}.</div>`;
                });
        };
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-danger ml-2';
        removeBtn.innerHTML = 'Remove';
        removeBtn.onclick = function(e) {
            e.stopPropagation();
            const newFavs = favorites.filter(f => f !== city);
            localStorage.setItem('favorites', JSON.stringify(newFavs));
            renderFavorites();
            facts.innerHTML = '';
        };
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex align-items-center mb-2';
        wrapper.appendChild(btn);
        wrapper.appendChild(removeBtn);
        list.appendChild(wrapper);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add-favorite-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const input = document.getElementById('favorite-city');
            const city = input.value.trim();
            if (!city) return;
            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (!favorites.includes(city)) {
                favorites.push(city);
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
            input.value = '';
            renderFavorites();
        });
    }
    renderFavorites();
});