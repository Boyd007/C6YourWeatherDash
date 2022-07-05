let inputSearches = document.getElementById("search-input");
let searchButton = document.querySelector("#search-button");

let date = new Date().toDateString();
let todaysDateInput = document.getElementById("todays-date");
let fiveDayDateInput = document.getElementsByClassName("five-day-dates");

let prevButtons = document.getElementsByClassName("prev-city");

let weatherApiKey = "d30fc6a0795d1166c0d07737c5a18bd0";

todaysDateInput.textContent = date;

$(function () {
  var citiesSearch = [
    "Abbotsford",
    "Boston",
    "Calgary",
    "Edmonton",
    "New York",
    "Salt Lake City",
    "Toronto",
    "Vancouver",
    "Dartmouth",
    "Queensland",
    "Ottawa",
    "Las Vegas",
    "Los Angeles",
  ];
  $("#search-input").autocomplete({
    source: citiesSearch,
  });
});

searchButton.addEventListener("click", (e) => {
  let searchInput = document.getElementById("search-input").value;
  e.preventDefault();

  let geoApiUrl = `https://api.geoapify.com/v1/geocode/search?city=${searchInput}&apiKey=ff9cc9a808974488a9620e7d4a7dd4d2`;

  fetch(geoApiUrl, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let latitude = data.features[0].geometry.coordinates[1];
      let longitude = data.features[0].geometry.coordinates[0];

      let cityName = data.features[0].properties.city;
      let cityNameEl = document.getElementById("todays-city");
      cityNameEl.textContent = cityName;

      let weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${weatherApiKey}`;

      fetch(weatherApiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var currCityWeather = document.getElementById("city-weather");
          var dailyCityWeather = document.getElementById("daily-forecast");
          currCityWeather.setAttribute("style", "opacity:1;");
          dailyCityWeather.setAttribute("style", "opacity:1;");

          for (let i = 0; i < fiveDayDateInput.length; i++) {
            fiveDayDateInput[i].textContent = moment
              .unix(data.daily[i].dt)
              .format("dddd");
          }

          let currIcon = data.current.weather[0].icon;
          let currIconEl = document.getElementById("todays-icon");
          let iconImg = document.createElement("img");
          iconImg.src = `https://openweathermap.org/img/wn/${currIcon}@4x.png`;
          iconImg.setAttribute("style", "max-width:40px;");
          currIconEl.innerHTML = "";
          currIconEl.appendChild(iconImg);
          let currTemp = data.current.temp;
          let currTempEl = document.getElementById("todays-temp");
          currTempEl.textContent = currTemp;
          let currWind = data.current.wind_speed;
          let currWindEl = document.getElementById("todays-wind");
          currWindEl.textContent = currWind;
          let currHumid = data.current.humidity;
          let currHumidEl = document.getElementById("todays-humid");
          currHumidEl.textContent = currHumid;
          let currUvi = data.current.uvi;
          let currUviEl = document.getElementById("todays-uvi");
          currUviEl.textContent = currUvi;

          if (currUvi < 2.0) {
            currUviEl.classList.remove("uvi-caution", "uvi-danger");
            currUviEl.classList.add("uvi-safe");
          } else if (currUvi >= 2.01 && currUvi <= 6.0) {
            currUviEl.classList.remove("uvi-safe", "uvi-danger");
            currUviEl.classList.add("uvi-caution");
          } else if (currUvi > 6.01) {
            currUviEl.classList.remove("uvi-caution", "uvi-safe");
            currUviEl.classList.add("uvi-danger");
          }

          let dailyIconEl = document.querySelectorAll(".five-day-icon");
          for (var i = 0; i < dailyIconEl.length; i++) {
            let dailyIcon = data.daily[i].weather[0].icon;
            let dailyIconImg = document.createElement("img");
            dailyIconImg.src = `https://openweathermap.org/img/wn/${dailyIcon}@4x.png`;
            dailyIconImg.setAttribute("style", "max-width:40px;");
            dailyIconEl[i].innerHTML = "";
            dailyIconEl[i].appendChild(dailyIconImg);
          }
          let dailyTempEl = document.querySelectorAll(".five-day-temp");
          for (var i = 0; i < dailyTempEl.length; i++) {
            let dailyTemp = data.daily[i].temp.day;
            dailyTempEl[i].textContent = dailyTemp;
          }
          let dailyWindEl = document.querySelectorAll(".five-day-wind");
          for (var i = 0; i < dailyWindEl.length; i++) {
            let dailyWind = data.daily[i].wind_speed;
            dailyWindEl[i].textContent = dailyWind;
          }
          let dailyHumidEl = document.querySelectorAll(".five-day-humid");
          for (var i = 0; i < dailyHumidEl.length; i++) {
            let dailyHumid = data.daily[i].humidity;
            dailyHumidEl[i].textContent = dailyHumid;
          }

          let arrayValue = JSON.parse(localStorage.getItem("last-city")) || [];

          arrayValue.push(searchInput);
          localStorage.setItem("last-city", JSON.stringify(arrayValue));

          for (let i = 0; i < arrayValue.length; i++) {
            prevButtons[i].classList.remove("hide");
            prevButtons[i].textContent = arrayValue[i];
          }
        });
    });
});

let arrayValue = JSON.parse(localStorage.getItem("last-city")) || [];

for (let i = 0; i < arrayValue.length; i++) {
  prevButtons[i].classList.remove("hide");
  prevButtons[i].textContent = arrayValue[i];
}
