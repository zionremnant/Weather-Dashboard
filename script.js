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
// 5-day forecast
var fiveDayEl = $(".fiveDay");

function fiveDayForecast() {
  var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

  $.ajax({
    url: fiveDayURL,
    method: "GET",
  }).then(function (response) {
    var myWeather = [];
    var fiveDayArray = response.list;
    // obj
    $.each(fiveDayArray, function (index, value) {
      testObj = {
        date: value.dt_txt.split(" ")[0],
        time: value.dt_txt.split(" ")[1],
        feels_like: value.main.feels_like,
        humidity: value.main.humidity,
        temp: value.main.temp,
        icon: value.weather[0].icon,
      };
      if (value.dt_txt.split(" ")[1] === "12:00:00") {
        myWeather.push(testObj);
      }
    });
    // insert cards
    for (let i = 0; i < myWeather.length; i++) {
      var divCard = $("<div>");
      divCard.attr("style", "max-width: 200px;");
      divCard.attr("class", "card text-white bg-primary mb-3 card1");
      fiveDayEl.append(divCard);

      var divBody = $("<div>");
      divBody.attr("class", "card-body");
      divCard.append(divBody);

      var divHeader = $("<div>");
      divHeader.attr("class", "card-header");
      var m = moment(`${myWeather[i].date}`).format("MM-DD-YYYY");
      divHeader.text(m);
      divCard.append(divHeader);

      var divIcon = $("<img>");
      divIcon.attr("class", "icons");
      divIcon.attr(
        "src",
        `http://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`
      );
      divBody.append(divIcon);

      var pTemp = $("<p>").text(`Temperature: ${myWeather[i].temp}°F`);
      divBody.append(pTemp);
      var pHumid = $("<p>").text(`Humidity: ${myWeather[i].humidity}%`);
      divBody.append(pHumid);
      var pFeel = $("<p>").text(`Feels Like: ${myWeather[i].feels_like}°F`);
      divBody.append(pFeel);
    }
  });
}
function initLoad() {
  var searchHistoryStore = JSON.parse(localStorage.getItem("city"));
  if (searchHistoryStore !== null) {
    searchHistory = searchHistoryStore;
  }
  history();
  todayWeather();
}
initLoad();
