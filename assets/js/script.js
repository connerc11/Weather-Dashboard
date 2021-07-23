var cityLocations = [];

var searchHeadingEl = document.querySelector("#search-city");
var inputCityEl = document.querySelector("#city-name");
var previousSearchedEl = document.querySelector("#previous-searched");
var cityChoiceEl = document.querySelector("#selected-city");
var weeklyForecastEl = document.querySelector("#weekly-forecast");
var weatherForecast = document.querySelector("#weather");
var currentWeather = document.getElementById("#current-weather");

var apiKey = "d1b5b46c7ffa1a821d537bdfb121c6be";


var carryOut = function(event){
 event.preventDefault();
 var cityWeather = inputCityEl.value.trim();
 if(cityWeather){
 retreiveCityWeather(cityWeather);
 inputCityEl.value="";
 }else{
     alert("enter a valid city");
 
 }
 rememberSearch();
 console.log(cityLocations)
}

var rememberSearch = function(){
localStorage.setItem("cityLocations", JSON.stringify(cityLocations));
};



var retreiveCityWeather = function(cityWeather){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=d1b5b46c7ffa1a821d537bdfb121c6be')
    .then(function(response){
        return response.json().then(function(data){
            console.log(data)
            showWeather(city, data);
        });
    });
};

var showWeather = function(){

}







