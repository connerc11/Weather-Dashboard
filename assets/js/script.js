var cityLocations = JSON.parse(localStorage.getItem("cityLocation")) || [];
console.log(cityLocations)

var inputCityEl = document.querySelector("#city-name");
var previousSearchedEl = document.querySelector("#previous-searched");
var cityChoiceEl = document.querySelector("#selected-city");
var weeklyForecastEl = document.querySelector("#weekly-forecast");
var weatherForecast = document.querySelector("#weather");
var currentWeather = document.getElementById("#current-weather");

var apiKey = "d1b5b46c7ffa1a821d537bdfb121c6be";
var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';





var retreiveCityWeather = function (event) {
    event.preventDefault()
    $("#main-weather").empty()

    var storedInfo = inputCityEl.value;
    if( cityLocations.indexOf(storedInfo) === -1 ){
        cityLocations.push(storedInfo);

    }
    localStorage.setItem("cityLocation", JSON.stringify(cityLocations))
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${storedInfo}&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if(data.cod === "404" || data.cod === "400"){
                alert(data.message);
                return;
            }
            var lat = data.coord.lat
            var lon = data.coord.lon
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h4>").addClass("card-title").text(data.name);
            var cardTemp = $("<p>").addClass("card-text currentTemp").text("Temperature~" + data.main.temp + " °F");
            var cardHumidity =$("<p>").addClass("card-text currentHumid").text("Humidity~" + data.main.humidity + " %");
            var cardWind = $("<p>").addClass("card-text currentWind").text("Wind Speed~" + data.wind.speed + " MPH");
            var cardIndex = $("<p>").addClass("card-text currentIndex").text("UVI~" + data.uvi);
           $("#main-weather").append(card.append(cardBody.append(cardTitle, cardTemp, cardHumidity, cardWind, cardIndex)));
            secondFunction(lat, lon)
        })


};

var secondFunction = function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for(var i = 1; i < 6; i++){
                console.log(data.daily[i]);
                var dateEl = moment.unix(data.daily[i].dt).format("MMM Do")
                console.log(dateEl)
            }
        })
}


document.getElementById("city-btn").addEventListener("click", retreiveCityWeather);







