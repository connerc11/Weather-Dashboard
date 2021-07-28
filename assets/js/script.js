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
            var uviResults = data.current.uvi
            var uvi = uviResults
            $("#main-weather").append(card.append(cardBody.append(cardIndex)));

            if (uvi < 4) {
                $('#uvi-badge').add('background-color', 'green');
            } else if (uvi > 4 && uvi <= 9) {
                $('#uvi-badge').add('background-color', 'yellow');
            } else if (uvi > 9) {
                $('#uvi-badge').add('background-color', 'red');
            }
            thirdFunction(lat, lon)


            
        //     for (var i = 1; i < 6; i++) {
        //         console.log(data);
        //         var dateEl = moment.unix(data.daily[i]).format("MMM Do")
                

        //         var cardTitle1 = $("<h4>").addClass("card-title1").text(data.daily[1].name)
        //         var cardTemp1 = $("<p>").addClass("card-text currentTemp1").text("Temperature~" + data.daily[1].temp.day + " °F");
        //         var cardHumidity1 = $("<p>").addClass("card-text currentHumid1").text("Humidity~" + data.daily[1].humidity + " %");
        //         var cardWind1 = $("<p>").addClass("card-text currentWind1").text("Wind Speed~" + data.daily[1].wind_speed + " MPH");
        //         $("#weather-city").append(card1.append(cardBody1.append(cardTitle1, cardTemp1, cardHumidity1, cardWind1)));
                
        //   //5
        //     }
        })
        
        
        var thirdFunction = function (lat, lon) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
                .then(function (response) {
                    return response.json()
                    })
                    .then(function (response) {
                        console.log(fetch)
                        console.log(response)
                   var day1 = moment(response.daily[1]).format("MMM Do")
                   console.log(moment(response.daily[1]).format("MMM Do"))
                   
                   $(".day1-data-date").html("<h5>" + day1 + "</h5>");
                   $(".day1-data-humidity").text("Humidity: " + response.daily[1].humidity + "%");
                   $(".day1-data-temp").text("Temperature : " + response.daily[1].temp + " °F");
                   $(".day1-data-wind").text("Wind : " + response.daily[1].wind_speed + " MPH");

                   var day2 = moment(response.daily[2]).format("MMM Do")
                   console.log(moment(response.daily[2]).format("MMM Do"))
                   
                   $(".day2-data-date").html("<h5>" + day2 + "</h5>");
                   $(".day2-data-humidity").text("Humidity: " + response.daily[2].humidity + "%");
                   $(".day2-data-temp").text("Temperature : " + response.daily[2].temp + " °F");
                   $(".day2-data-wind").text("Wind : " + response.daily[2].wind_speed + " MPH");

                   var day3 = moment(response.daily[3]).format("MMM Do")
                   console.log(moment(response.daily[3]).format("MMM Do"))
                   
                   $(".day3-data-date").html("<h5>" + day3 + "</h5>");
                   $(".day3-data-humidity").text("Humidity: " + response.daily[3].humidity + "%");
                   $(".day3-data-temp").text("Temperature : " + response.daily[3].temp + " °F");
                   $(".day3-data-wind").text("Wind : " + response.daily[3].wind_speed + " MPH");

                   var day4 = moment(response.daily[4]).format("MMM Do")
                   console.log(moment(response.daily[4]).format("MMM Do"))
                   
                   $(".day4-data-date").html("<h5>" + day4 + "</h5>");
                   $(".day4-data-humidity").text("Humidity: " + response.daily[4].humidity + "%");
                   $(".day4-data-temp").text("Temperature : " + response.daily[4].temp + " °F");
                   $(".day4-data-wind").text("Wind : " + response.daily[4].wind_speed + " MPH");

                   var day5 = moment(response.daily[5]).format("MMM Do")
                   console.log(moment(response.daily[5]).format("MMM Do"))
                   
                   $(".day5-data-date").html("<h5>" + day2 + "</h5>");
                   $(".day5-data-humidity").text("Humidity: " + response.daily[5].humidity + "%");
                   $(".day5-data-temp").text("Temperature : " + response.daily[5].temp + " °F");
                   $(".day5-data-wind").text("Wind : " + response.daily[5].wind_speed + " MPH");




                   
                    })

            

                
        }
}


document.getElementById("city-btn").addEventListener("click", retreiveCityWeather);







