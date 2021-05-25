require('leaflet/dist/images/marker-icon-2x.png')
require('leaflet/dist/images/marker-shadow.png')
require('leaflet/dist/images/marker-icon.png')
require("leaflet/dist/leaflet.css")
require("./style.css");
import L from 'leaflet'
const RealtimeIRL = require('@rtirl/api/lib/index.js')

var mapStyleId = 'mapbox/streets-v11'
var mapboxAccessToken = 'pk.eyJ1IjoiampqampqampqampqampqampqaiIsImEiOiJja290MThwMzIwNjNkMndwaHR5djlhYThqIn0.zULjRWtxmVmaWe-FDobI-A'
var streamSource = "twitch"
var twitch = window.Twitch.ext

twitch.onContext(function (context) {
  twitch.rig.log(context)
})

twitch.onAuthorized(
  function (auth) {
    console.log(RealtimeIRL)
    var parts = auth.token.split(".")
    var payload = JSON.parse(window.atob(parts[1]))
    var streamerId = payload.channel_id
    var map = L.map('map').setView([51.505, -0.09], 13)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: mapStyleId,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapboxAccessToken
    }).addTo(map)

    map.removeControl(map.zoomControl)
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable(); 
    map.dragging.disable()

    var marker = L.marker([0, 0]).addTo(map)
    RealtimeIRL.forStreamer(streamSource, streamerId).addLocationListener(location => panToLocation(map, marker, location))

  })

function panToLocation(map, marker, location) {
  var offlineDiv = document.getElementById('offline')
  var mapDiv = document.getElementById('map')

  if (location !== null) {
    console.log('online')
    console.log(location)
    offlineDiv.style.visibility = 'hidden'
    mapDiv.style.visibility = 'visible'
    map.panTo([location.latitude, location.longitude], {
      duration: 1.5
    })
    marker.setLatLng([location.latitude, location.longitude], { animate: true, duration: 1.5 })
  }
  else {
    console.log('offline')
    //Streamer is not pushing data to RealtimeIRL
    offlineDiv.style.visibility = 'visible'
    mapDiv.style.visibility = 'hidden'
  }
}

