// Here i use my own api id from the weather forecast from open weather map
const apiKey = '8d6f1409e147fa9c860d6f378198ef10';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

// Here I am getting references from the Document Object Models
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const currentLocationButton = document.getElementById('currentLocationButton');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastDisplay = document.getElementById('forecastCards');
const recentSearchDropdown = document.getElementById('recentSearchDropdown');

// Event listeners for buttons
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
    storeRecentSearch(city);
  } else {
    alert('Please enter a city name!');
  }
});

currentLocationButton.addEventListener('click', () => {
  getCurrentLocationWeather();
});

// Here I used Function to fetch weather by city name
function getWeatherByCity(city) {
  const url = `${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        updateWeatherUI(data);
      } else {
        alert('City not found!');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Here I Used Function to fetch weather for the current location
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const url = `${baseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(response => response.json())
        .then(data => updateWeatherUI(data))
        .catch(error => console.error('Error fetching data:', error));
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

//Here I Used Function to update the weather data in the UI
function updateWeatherUI(data) {
  const { name, main, weather, wind } = data;
  document.getElementById('locationName').textContent = name;
  document.getElementById('temperature').textContent = `Temperature: ${main.temp} °C`;
  document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${wind.speed} m/s`;
  document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
  document.getElementById('description').textContent = weather[0].description;
}

// Here it Stores recent searches in localStorage
function storeRecentSearch(city) {
  let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearchDropdown();
  }
}

// Here it will shoe the recent searches dropdown in the application
function updateRecentSearchDropdown() {
  let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recentSearchDropdown.innerHTML = '<option value="" disabled selected>Select a recent city</option>';
  recentSearches.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    recentSearchDropdown.appendChild(option);
  });
}

// It loads the recent searches in the application
window.onload = function () {
  updateRecentSearchDropdown();
};
