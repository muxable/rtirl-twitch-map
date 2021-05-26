require("./config.css");

var twitch = window.Twitch.ext

twitch.onContext(function (context) {
  if (context && context.theme) {
    var textDiv = document.getElementById('config')
    if (context.theme === "dark") {
      textDiv.className = "dark"
    }
    else {
      textDiv.className = "light"
    }
  }
})