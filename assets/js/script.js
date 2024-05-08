//Dependencies
const form = document.querySelector("form");
const apiKey = "cb37cc7caf84c8b235be1e55107a2817";

//Functions
function fetchCurrentWeather(cityName) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  ).then((response) => response.json());
}

function fetchForecastData(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  ).then((response) => response.json());
}
function weatherCard(weather, isFirstCard) {

  const temperature = weather.temp;
  //temp conversion from kelvin to fahrenheit
  const realTemp = ((temperature - 273.15) * 9) / 5 + 32;
  
    const weatherSymbols = {
      "clear sky": "☀️",
      "few clouds": "🌤️",
      "scattered clouds": "⛅",
      "broken clouds": "☁️",
      "overcast clouds": "☁️",
      mist: "🌫️",
      fog: "🌫️",
      "light rain": "🌧️",
      "moderate rain": "🌧️",
      "heavy intensity rain": "🌧️",
    };
  
    const weatherSymbol = weatherSymbols[weather.clouds.toLowerCase()] || "☁️";
  
    const cityName = isFirstCard
      ? weather.city.charAt(0).toUpperCase() + weather.city.slice(1)
      : "";
  
    const cardContent = `
        <div class="weather-card ${isFirstCard ? "first-card" : ""}">
            <h4>${cityName}</h4>
            <p>Date: ${weather.date}</p>
            <p>${weatherSymbol}</p>
            <p>Temp: ${realTemp.toFixed(2)}°F</p>
            <p>Wind Speed: ${weather.windSpeed} mph</p>
            <p>Humidity: ${weather.humidity}%</p>
        </div>
    `;
  
    return cardContent;
  }

  form.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(event) {
    event.preventDefault();
    const cityInput = document.getElementById("cityInput").value;
    let cityName = cityInput;
  
    fetchCurrentWeather(cityName)
      .then((data) => {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        return fetchForecastData(latitude, longitude);
      })
      .then((weatherData) => {
        const weatherDashboardData = processWeatherData(cityName, weatherData);
        displayWeatherCard(weatherDashboardData);
        storeWeatherData(weatherDashboardData);
        createWeatherButton(weatherDashboardData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }


  function displayWeatherCard(weatherData) {
    const todayWeather = weatherData[0];
    const forecastWeather = weatherData.slice(1);
  
    const currentCard = weatherCard(todayWeather, true);
    const forecastCard = forecastWeather.map((weather) =>
      weatherCard(weather, false)
    );
  
    const todayWeatherElement = document.getElementById("todayWeather");
    const forecastWeatherElement = document.getElementById("forecastWeather");
  
    if (todayWeatherElement && forecastWeatherElement) {
      todayWeatherElement.innerHTML = currentCard;
      forecastWeatherElement.innerHTML = forecastCard.join("");
    } else {
      console.error("Error");
    }
  }
  
  
  
  function processWeatherData(cityName, weatherData) {
    const todayWeather = {
      city: cityName,
      date: new Date().toLocaleDateString(),
      clouds: weatherData.list[0].weather[0].description,
      temp: weatherData.list[0].main.temp,
      windSpeed: weatherData.list[0].wind.speed,
      humidity: weatherData.list[0].main.humidity,
    };
  
    const forecast = [];
    for (let i = 1; i <= 5; i++) {
      const forecastData = {
        city: cityName,
        date: new Date(weatherData.list[i * 4].dt * 1000).toLocaleDateString(),
        clouds: weatherData.list[i * 4].weather[0].description,
        temp: weatherData.list[i * 4].main.temp,
        windSpeed: weatherData.list[i * 4].wind.speed,
        humidity: weatherData.list[i * 4].main.humidity,
      };
      forecast.push(forecastData);
    }
  
    return [todayWeather, ...forecast];
  }
  
  function storeWeatherData(weatherData) {
    localStorage.setItem("weatherDashboardData", JSON.stringify(weatherData));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const storedWeatherData = localStorage.getItem("weatherDashboardData");
    if (storedWeatherData) {
      const weatherData = JSON.parse(storedWeatherData);
      displayWeatherCard(weatherData);
    }
  });
  
  function createWeatherButton(weatherData) {
    var button = document.createElement("button");
    button.textContent = weatherData[0].city;
    button.classList.add("city-button");
  
    button.addEventListener("click", function () {
      displayWeatherCard(weatherData);
    });
  
    var searchHistoryArea = document.getElementById("searchHistory");
    searchHistoryArea.appendChild(button);
  }


