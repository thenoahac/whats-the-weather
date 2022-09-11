var apiKey = "ec4f51ab549c402396d72795f8b68224";
var City = document.getElementById('city-input');
var search = document.getElementById('search-button');
var currentWeather = document.getElementById('current-forecast');
var weatherForcast = document.getElementById('weekly-forcast');
var sHistory = document.querySelector(".recent-searches");
var momentNow = moment().format("MMM Do YY");
var date = moment();
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

var card = document.createElement('div')
var cardHeader = document.createElement('div')
var weatherIcon = document.createElement('img')
var weatherValues = document.createElement('ul')
var temp = document.createElement('li')
var wind = document.createElement('li')
var hum = document.createElement('li')
var uv = document.createElement('li')

search.onclick = function(event) {
    event.preventDefault();
    weatherSearch();
}

function weatherSearch() {
    sHistory.innerHTML = "";
    currentWeather.innerHTML = "";
    forcast.innerHTML = "";
    var city = City.value;
    fetchgeo(city);
}

function fetchgeo(city) {
    fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey + "&units=imperial"
    )
    .then((res) => res.json())
    .then((data) => {
        oneCall(data[0].lat, data[0].lon, data[0].name)
    })
    .catch((err) => alert("Location Doesn't Exist!"))
}

function oneCall(lat, lon, city) {
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey
    )
    .then((res) => res.json())
    .then((data) => {
        displayCurrentWeather(data.current, city)
        forcast(data.daily, city)
        saveSearch(city);
    })
}

function saveSearch(city) {
    cityHistory.push(city)
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory))
    showHistory(cityHistory, city)
}

function showHistory(history, city) {
    var historyList = document.createElement('ul')
    historyList.setAttribute('class', 'list-group', 'list-group-flush', 'text-left')
    sHistory.append(historyList);
    if (history.length > 10) {
        for (i=0;i<10;i++) {
            City.textContent = "";
            var oldCity = document.createElement('li');
            var cityBtn = document.createElement('button')
            oldCity.setAttribute('class', 'list-group-item')
            cityBtn.setAttribute('class', "old-city")
            cityBtn.setAttribute('class', "btn")
            cityBtn.setAttribute('type', "button")
            cityBtn.textContent = history[(history.length - i -1)]
            oldCity.append(cityBtn);
            historyList.append(oldCity)
            cityBtn.onclick = function(event) {
                event.preventDefault();
                var City = oldCity
                weatherSearch(City);
            }
        }
    } else {
        for (var i = 0; i<history.length; i++) {
            var oldCity = document.createElement('li');
            var cityBtn = document.createElement('button')
            oldCity.setAttribute('class', 'list-group-item')
            cityBtn.setAttribute('class', "old-city")
            cityBtn.setAttribute('class', "btn")
            cityBtn.setAttribute('type', "button")
            cityBtn.textContent = history[(history.length - i -1)]
            oldCity.append(cityBtn);
            historyList.append(oldCity)
        }
    }
}

function displayCurrentWeather(current, city){
    console.log(current, city);

    var card = document.createElement('div')
    var cardHeader = document.createElement('div')
    var weatherIcon = document.createElement('img')
    var weatherValues = document.createElement('ul')
    var temp = document.createElement('li')
    var wind = document.createElement('li')
    var hum = document.createElement('li')
    var uv = document.createElement('li')

    if (current.uvi <=4) {
        uv.setAttribute('class', "p-3", "mb-2", "bg-success", "text-white")
    } else if (current.uvi <=8) {
        uv.setAttribute('class', "p-3", "mb-2", "bg-warning", "text-dark")
    } else {
        uv.setAttribute('class', "p-3", "mb-2", "bg-danger", "text-white")
    }
    // Fill card data and append to page
    card.setAttribute('class', 'card')
    cardHeader.setAttribute('class', 'card-header')
    weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+ current.weather[0].icon +'@2x.png')
    cardHeader.textContent =  city + ' ' + date.format("MMM Do YY")
    cardHeader.append(weatherIcon)
    card.append(cardHeader)
    currentWeather.append(card)
    //set styling and content of list items
    weatherValues.setAttribute('class', 'list-group', 'list-group-flush', 'text-left')
    temp.setAttribute('class', 'list-group-item')
    wind.setAttribute('class', 'list-group-item')
    hum.setAttribute('class', 'list-group-item')
    uv.setAttribute('class', 'list-group-item')
    temp.textContent = 'temp: ' + current.temp + ' deg F'
    wind.textContent = 'wind: ' + current.wind_speed + ' MPH'
    hum.textContent = 'humidity: ' + current.humidity + '%'
    uv.textContent = 'UV index: ' + current.uvi

    weatherValues.append(temp)
    weatherValues.append(wind)
    weatherValues.append(hum)
    weatherValues.append(uv)

    card.append(weatherValues)
}

function forcast(daily, city) {
    for (var i=0; i<5; i++){
        date = moment();
        var dateForcast = date.add(i+1, 'days').format("MMM Do YY");
        var forcastCard = document.createElement('div')
        var forcastCardHeader = document.createElement('div')
        var forcastWeatherIcon = document.createElement('img')
        var ForcastWeatherValues = document.createElement('ul')
        var forcastTemp = document.createElement('li')
        var forcastWind = document.createElement('li')
        var forcastHum = document.createElement('li')
        var forcastUV = document.createElement('li')
        forcastCard.setAttribute('class', 'card', 'col')
        forcastCardHeader.setAttribute('class', 'card-header', 'col')
        forcastCardHeader.textContent =  city + ' ' + dateForcast
        forcastWeatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+ daily[i].weather[0].icon +'@2x.png')
        forcastCardHeader.append(forcastWeatherIcon)
        forcastCard.append(forcastCardHeader)
        weatherForcast.append(forcastCard)
        ForcastWeatherValues.setAttribute('class', 'list-group', 'list-group-flush', 'text-left')
        forcastTemp.setAttribute('class', 'list-group-item')
        forcastWind.setAttribute('class', 'list-group-item')
        forcastHum.setAttribute('class', 'list-group-item')
        forcastUV.setAttribute('class', 'list-group-item')
        forcastTemp.textContent = 'temp: ' + daily[i].temp.day + ' deg F'
        forcastWind.textContent = 'wind: ' + daily[i].wind_speed + ' MPH'
        forcastHum.textContent = 'humidity: ' + daily[i].humidity + '%'
        forcastUV.textContent = 'UV index: ' + daily[i].uvi
        ForcastWeatherValues.append(forcastTemp)
        ForcastWeatherValues.append(forcastWind)
        ForcastWeatherValues.append(forcastHum)
        ForcastWeatherValues.append(forcastUV)
        forcastCard.append(ForcastWeatherValues)
    }
}