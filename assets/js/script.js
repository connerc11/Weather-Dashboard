var cityLocations = JSON.parse(localStorage.getItem("cityLocation")) || [];
console.log(cityLocations)

var inputCityEl = document.querySelector("#city-name");
var previousSearchedEl = document.querySelector("#previous-searched");
var cityChoiceEl = document.querySelector("#selected-city");
var weeklyForecastEl = document.querySelector("#weekly-forecast");
var weatherForecast = document.querySelector("#weather");
var currentWeather = document.getElementById("#current-weather");
var card = $("<div>").addClass("card");
var cardBody = $("<div>").addClass("card-body");
var card1 = $("<div>").addClass("card");
var cardBody1 = $("<div>").addClass("card-body");
var card2 = $("<div>").addClass("card");
var cardBody2 = $("<div>").addClass("card-body");
var card3 = $("<div>").addClass("card");
var cardBody3 = $("<div>").addClass("card-body");
var card4 = $("<div>").addClass("card");
var cardBody4 = $("<div>").addClass("card-body");
var card5 = $("<div>").addClass("card");
var cardBody5 = $("<div>").addClass("card-body");



var apiKey = "d1b5b46c7ffa1a821d537bdfb121c6be";
var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';





var retreiveCityWeather = function (event) {
    event.preventDefault()
    $("#main-weather").empty()

    var storedInfo = inputCityEl.value;
    if (cityLocations.indexOf(storedInfo) === -1) {
        cityLocations.push(storedInfo);

    }
    localStorage.setItem("cityLocation", JSON.stringify(cityLocations))
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${storedInfo}&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.cod === "404" || data.cod === "400") {
                alert(data.message);
                return;
            }
            var lat = data.coord.lat
            var lon = data.coord.lon
            var cardTitle = $("<h4>").addClass("card-title").text(data.name)
            var cardTemp = $("<p>").addClass("card-text currentTemp").text("Temperature~" + data.main.temp + " °F");
            var cardHumidity = $("<p>").addClass("card-text currentHumid").text("Humidity~" + data.main.humidity + " %");
            var cardWind = $("<p>").addClass("card-text currentWind").text("Wind Speed~" + data.wind.speed + " MPH");

            $("#main-weather").append(card.append(cardBody.append(cardTitle, cardTemp, cardHumidity, cardWind)));
            secondFunction(lat, lon)
        })



};

var secondFunction = function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            var cardIndex = $("<p>").addClass("card-text currentIndex").text("UV~" + data.current.uvi)
            $("#main-weather").append(card.append(cardBody.append(cardIndex)));

            if (data.cardIndex <= 4) {
                data.current.uvi.classList = "great"
                console.log(data)
            } else if (data.current.uvi.classList > 4 && data.current.uvi.classList <= 9) {
                data.current.uvi = "moderate"
            } else if (data.current.uvi.classList > 9) {
                data.current.uvi = "severe"
            }


            
            for (var i = 1; i < 6; i++) {
                console.log(data);
                var dateEl = moment.unix(data.daily[i].dt).format("MMM Do")
                
                var cardTitle1 = $("<h4>").addClass("card-title1").text(data.daily[1].name)
                var cardTemp1 = $("<p>").addClass("card-text currentTemp1").text("Temperature~" + data.daily[1].temp.day + " °F");
                var cardHumidity1 = $("<p>").addClass("card-text currentHumid1").text("Humidity~" + data.daily[1].humidity + " %");
                var cardWind1 = $("<p>").addClass("card-text currentWind1").text("Wind Speed~" + data.daily[1].wind_speed + " MPH");
                $("#weather-city").append(card1.append(cardBody1.append(cardTitle1, cardTemp1, cardHumidity1, cardWind1)));
                
          //5
            }
        })
}


document.getElementById("city-btn").addEventListener("click", retreiveCityWeather);







