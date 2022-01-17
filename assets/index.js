//when page starts these functions are run//
function initPage() {
    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("tempurature");
    const currentTempEl = document.getElementById("tempurature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("Wind");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
};

//API Key for openweathermap API when search button is clicked//
const APIKey = "3b36363a87aa055858570c551b3fb196";

//Using a saved city name to retrieve current weather conditions where results come from open weather map API//
function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    axios.get(queryURL)
        .then(function (response) {
            console.log(response);

            const currentDate = newDate(response.data.dt * 1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getFullMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.data.name + "(" + month + "/" + day + "/" + year + ")";
            let weatherPic = response.data.weather[0].icon;
            currentPicEl.setAttribute("src", "https://dataweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicel.setAttribute("alt", response.data.weather[0].description);
            currentTempEl.innerHTML = "Tempurature: " + k2f(response.data.main.temp) + "&#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed " + response.data.wind.speed + "MPH";
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    UVIndex.setAttribute("class", "badge badge-danger")
                    UVIndex.innerHTML = response.data[0].value;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVIndex);
                });

            //A 5 day forecast will be requested from open weather API using a saved city name//
            let cityID = response.data.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            axios.get(foecastQueryURL)
                .then(function (response) {

                    //Parse "response" to display 5 day forecast underneath current weather conditions//
                    console.log(response);
                    const forecastEls = document.querySelectorAll(".forecast");
                    for (i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastMonth.getYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mb-0 forecst-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);
                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherElement.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0], icon + "@2x.png");
                        forecastWeatherElement.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        forecastEls[i].append(forecastWeatherEl);
                        const forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + "#176F";
                        forecastEls[i].append(forecastTempEl);
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                })
        });
}

searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();

})

clearEl.addEventListener("click", function () {
    searchHistory = [];
    getWeather(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})


//converting Kelvin temperature to Fahrenheit//
function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);

}

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", "true");
        historyItem.setAttribute("value", serachHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}
initPage();