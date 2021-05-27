import './config.css'

const twitch = window.Twitch.ext

twitch.onContext(function (context) {
  if (context && context.theme) {
    const textDiv = document.getElementById('config')
    if (context.theme === 'dark') {
      textDiv.className = 'dark'
    } else {
      textDiv.className = 'light'
    }
  }
})
