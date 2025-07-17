console.log('Script loaded: script.js');
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



const APIKey = "0ab31758ba7256fe2d1bebcb97953927";


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
            console.log('Current weather iconCode:', response.data.weather[0].icon);
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
                        console.log('Forecast iconCode:', response.data.list[forecastIndex].weather[0].icon);
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
    // Use animated GIFs for weather icons, fallback to OpenWeatherMap icon
    let iconUrl = '';
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            iconUrl = 'https://assets.codepen.io/5647096/sunny.gif';
            break;
        case 'clouds':
            iconUrl = 'https://assets.codepen.io/5647096/cloudy.gif';
            break;
        case 'rain':
        case 'drizzle':
            iconUrl = 'https://assets.codepen.io/5647096/rainy.gif';
            break;
        case 'thunderstorm':
            iconUrl = 'https://assets.codepen.io/5647096/thunder.gif';
            break;
        case 'snow':
            iconUrl = 'https://assets.codepen.io/5647096/snowy.gif';
            break;
        case 'mist':
        case 'fog':
            iconUrl = 'https://assets.codepen.io/5647096/foggy.gif';
            break;
        default:
            iconUrl = '';
    }
    let fallbackUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/PNG/128/na.png';
    imgEl.onerror = function() { imgEl.src = fallbackUrl; };
    imgEl.src = iconUrl || fallbackUrl;
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
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})

// Clear History button
clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

function tempC(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white searched-city-item");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}


renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
} else {
    // Show general weather for a default city on first load
    getWeather('Arlington, Virginia');
}

}

window.addEventListener('DOMContentLoaded', function() {
    initPage();
});