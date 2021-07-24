var cityLocations = [];

var inputCityEl = document.querySelector("#city-name");
var previousSearchedEl = document.querySelector("#previous-searched");
var cityChoiceEl = document.querySelector("#selected-city");
var weeklyForecastEl = document.querySelector("#weekly-forecast");
var weatherForecast = document.querySelector("#weather");
var currentWeather = document.getElementById("#current-weather");

var apiKey = "d1b5b46c7ffa1a821d537bdfb121c6be";
var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';





var retreiveCityWeather = function(event){
    event.preventDefault()
    
    var storedInfo = inputCityEl.value
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${storedInfo}&appid=${apiKey}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var lat = data.coord.lat
       var lon = data.coord.lon

       secondFunction(lat, lon)
   })

   
};

var secondFunction = function(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data)
    })
}


document.getElementById("city-btn").addEventListener("click", retreiveCityWeather);







