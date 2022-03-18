var key = "68cc41e37ba870c81cf19b09d5d0a89b";
var city = "Los Angeles";

//current time/date
var date = moment().format("dddd, MMMM Do YYYY");
var dateTime = moment().format("YYYY-MM-DD HH:MM:SS");

// search history
var searchHistory = [];
$(".search").on("click", function(event){
    event.preventDefault();
    city = $(this).parent(".btnPar").siblings(".textVal").value().trim();
    if(city===""){
        return;
    }
    searchHistory.push(city);
    localStorage.setItem("city", JSON.stringify(searchHistory));
    fiveDay.empty();
    history();
});
// search history buttons
var 