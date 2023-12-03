document.addEventListener('DOMContentLoaded', function () {
  var weatherSearchForm = document.querySelector('#weather-search');
  var cityInput = document.querySelector('#city');
  var cityNameSpan = document.querySelector('#city-name');
  var searchHistoryList = document.querySelector('#search-history');
  var temperatureUnit = 'fahrenheit'; 

  function getWeather(city) {
    var apiKey = '8d398b7c4a425f52eb6b47abb23c01cf'; 
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(function (data) {
            cityNameSpan.textContent = city;

            var weatherResultsContainer = document.querySelector('#weather-results');
            weatherResultsContainer.innerHTML = null;

            var temperature = data.main.temp;
            var weatherDescription = data.weather[0].description;
            var humidity = data.main.humidity;

            var temperatureEl = document.createElement('p');
            temperatureEl.textContent = `Temperature: ${convertTemperature(temperature)} ${getTemperatureUnitSymbol()}`;

            var weatherDescriptionEl = document.createElement('p');
            weatherDescriptionEl.textContent = `Weather: ${weatherDescription}`;

            var humidityEl = document.createElement('p');
            humidityEl.textContent = `Humidity: ${humidity}%`;

            weatherResultsContainer.append(temperatureEl, weatherDescriptionEl, humidityEl);
    
            addToSearchHistory(city);
        })
        .catch(function (error) {
          console.error('Error fetching weather data:', error);
          cityNameSpan.textContent = 'Error';
          document.getElementById('weather-results').innerHTML = `<p>${error.message}</p>`;
      }); 

      }  
      
      function convertTemperature(kelvin) {
        if (temperatureUnit === 'celsius') {
            return (kelvin - 273.15).toFixed(2);
        } else if (temperatureUnit === 'fahrenheit') {
            return ((kelvin - 273.15) * (9/5) + 32).toFixed(2);
        }
      }   
      
      function getTemperatureUnitSymbol() {
        return (temperatureUnit === 'celsius') ? '°C' : '°F';
    }

    function changeTemperatureUnit(unit) {
      temperatureUnit = unit;
      renderWeather(); 
  }

  function addToSearchHistory(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      if (searchHistory.length > 5) {
          searchHistory.shift(); 
      }

      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

      renderSearchHistory();
  }
}


 function renderSearchHistory() {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistoryList.innerHTML = null;
  for (var city of searchHistory) {
      var listItem = document.createElement('li');
      listItem.textContent = city;
      listItem.classList.add('list-group-item');
      listItem.addEventListener('click', function () {
          getWeather(this.textContent);
      });
      searchHistoryList.appendChild(listItem);
  }
}
function renderWeather() {
  var cityName = cityNameSpan.textContent;
  if (cityName !== 'Error' && cityName !== '') {
      getWeather(cityName);
  }
}

 
  weatherSearchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var city = cityInput.value;
    getWeather(city);
});


renderSearchHistory();

});  