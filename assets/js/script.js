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
            var cardIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
            var cardTemp = $("<p>").addClass("card-text currentTemp").text("Temperature~" + data.main.temp + " °F");
            var cardHumidity = $("<p>").addClass("card-text currentHumid").text("Humidity~" + data.main.humidity + " %");
            var cardWind = $("<p>").addClass("card-text currentWind").text("Wind Speed~" + data.wind.speed + " MPH");

            $("#main-weather").append(card.append(cardBody.append(cardTitle, cardIcon, cardTemp, cardHumidity, cardWind)));
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
            var uviResults = data.current.uvi
            var uvi = uviResults
            $("#main-weather").append(card.append(cardBody.append(cardIndex)));

            if (uvi < 4) {
                $('.currentIndex').attr('style', 'background-color:green; color:white');
            } else if (uvi > 4 && uvi <= 9) {
                $('.currentIndex').attr('style', 'background-color:yellow; color:black');
            } else if (uvi > 9) {
                $('.currentIndex').attr('style', 'background-color:red; color:white');
            }
            thirdFunction(lat, lon)


        })


    var thirdFunction = function (lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                console.log(fetch)
                console.log(response)
                var day1 = moment(response.list[1].dt_txt).format("MMM Do")
                console.log(moment(response.list[1].dt_txt).format("MMM Do"))

                $(".day1-data-date").html("<h5>" + day1 + "</h5>");
                $(".day1-data-icon").html("<img src=https://openweathermap.org/img/w/" + response.list[1].weather[0].icon + ".png>")
                $(".day1-data-humidity").text("Humidity: " + response.list[1].main.humidity + "%");
                $(".day1-data-temp").text("Temperature : " + response.list[1].main.temp + " °F");
                $(".day1-data-wind").text("Wind : " + response.list[1].wind.speed + " MPH");

                var day2 = moment(response.list[9].dt_txt).format("MMM Do")
                console.log(moment(response.list[9].dt_txt).format("MMM Do"))

                $(".day2-data-date").html("<h5>" + day2 + "</h5>");
                $(".day2-data-icon").html("<img src=https://openweathermap.org/img/w/" + response.list[9].weather[0].icon + ".png>")
                $(".day2-data-humidity").text("Humidity: " + response.list[9].main.humidity + "%");
                $(".day2-data-temp").text("Temperature : " + response.list[9].main.temp + " °F");
                $(".day2-data-wind").text("Wind : " + response.list[9].wind.speed + " MPH");

                var day3 = moment(response.list[17].dt_txt).format("MMM Do")
                console.log(moment(response.list[17].dt_txt).format("MMM Do"))

                $(".day3-data-date").html("<h5>" + day3 + "</h5>");
                $(".day3-data-icon").html("<img src=https://openweathermap.org/img/w/" + response.list[17].weather[0].icon + ".png>")
                $(".day3-data-humidity").text("Humidity: " + response.list[17].main.humidity + "%");
                $(".day3-data-temp").text("Temperature : " + response.list[17].main.temp + " °F");
                $(".day3-data-wind").text("Wind : " + response.list[17].wind.speed + " MPH");

                var day4 = moment(response.list[25].dt_txt).format("MMM Do")
                console.log(moment(response.list[25].dt_txt).format("MMM Do"))

                $(".day4-data-date").html("<h5>" + day4 + "</h5>");
                $(".day4-data-icon").html("<img src=https://openweathermap.org/img/w/" + response.list[25].weather[0].icon + ".png>")
                $(".day4-data-humidity").text("Humidity: " + response.list[25].main.humidity + "%");
                $(".day4-data-temp").text("Temperature : " + response.list[25].main.temp + " °F");
                $(".day4-data-wind").text("Wind : " + response.list[25].wind.speed + " MPH");

                var day5 = moment(response.list[33].dt_txt).format("MMM Do")
                console.log(moment(response.list[33].dt_txt).format("MMM Do"))

                $(".day5-data-date").html("<h5>" + day5 + "</h5>");
                $(".day5-data-icon").html("<img src=https://openweathermap.org/img/w/" + response.list[25].weather[0].icon + ".png>")
                $(".day5-data-humidity").text("Humidity: " + response.list[33].main.humidity + "%");
                $(".day5-data-temp").text("Temperature : " + response.list[33].main.temp + " °F");
                $(".day5-data-wind").text("Wind : " + response.list[33].wind.speed + " MPH");





            })




    }
}


document.getElementById("city-btn").addEventListener("click", retreiveCityWeather);







