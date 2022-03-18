var key = "68cc41e37ba870c81cf19b09d5d0a89b";
var city = "Los Angeles";

//current time/date
var date = moment().format("dddd, MMMM Do YYYY");
var dateTime = moment().format("YYYY-MM-DD HH:MM:SS");

// search history
var searchHistory = [];
$(".search").on("click", function (event) {
  event.preventDefault();
  city = $(this).parent(".btnPar").siblings(".textVal").value().trim();
  if (city === "") {
    return;
  }
  searchHistory.push(city);
  localStorage.setItem("city", JSON.stringify(searchHistory));
  fiveDay.empty();
  history();
});
// search history buttons
var historyEl = $(".searchHistory");
function history() {
  historyEl.empty();

  for (let i = 0; i < searchHistory.length; i++) {
    var btnEl = $("<button>").text(`${searchHistory[i]}`);
    var rowEl = $("<row>");

    rowEl.addClass("row historyRowBtn");
    btnEl.addClass("btn btn-outline-secondary historyBtn");
    btnEl.attr("type", "button");

    historyEl.prepend(rowEl);
    rowEl.append(btnEl);
  }
  if (!city) {
    return;
  }
  // start searching btn
  $(".historyBtn").on("click", function (event) {
    event.preventDefault();
    city = $(this).text();
    fiveDayEl.empty();
    todayWeather();
  });
}
// today card body (weather data, 5-day forecast)
var cardTodayCity = $(".cardBodyToday");
function todayWeather() {
  var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}lat=57&lon=-2.15&appid=${key}&units=imperial`;

  $(cardTodayBody).empty();

  $.ajax({
    url: currentURL,
    method: "GET",
  }).then(function (response) {
    $(".cardTodaydate").text(date);
    $(".cardTodayCity").text(response.name);

    // icon
    $(".icons").attr(
      "src",
      `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    );
    // humidity
    var pHumid = $("<p>").text(`Humidity: ${response.main.humidity}%`);
    cardTodayBody.append(pHumid);
    // feels like
    var pTemp = $("<p>").text(`Feels like: ${response.main.feels_like}°F`);
    cardTodayBody.append(pTemp);
    // wind speed
    var pWind = $("<p>").text(`Wind speed: ${response.main.wind_speed}mph`);
    cardTodayBody.append(pWind);
    // temp
    var pEl = $("<p>").text(`Temperature: ${response.main.temp}°F`);
    cardTodayBody.append(pEl);
    // latitude & longitude
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    console.log(latitude);
    console.log(longitude);

    var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${key}`;

    $.ajax({
      url: uviURL,
      method: "GET",
    }).then(function (response) {
      var uviSpan = $("<span>").text(response.current.uvi);
      var pUvi = $("<p>").text("UV Index:");
      var uvi = response.current.uvi;
      pUvi.append(uviSpan);
      cardTodayBody.append(pUvi);
      //uv index
      if (uvi >= 0 && uvi <= 2) {
        uviSpan.attr("class", "green");
      } else if (uvi > 2 && uvi <= 5) {
        uviSpan.attr("class", "yellow");
      } else if (uvi > 5 && uvi <= 7) {
        uviSpan.attr("class", "orange");
      } else if (uvi > 7 && uvi <= 10) {
        uviSpan.attr("class", "red");
      } else {
        uviSpan.attr("class", "purple");
      }
    });
  });
  fiveDay();
}
var fiveDayEl = $(".fiveDay");

function fiveDayForecast(){
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=57&lon=-2.15&appid=
}