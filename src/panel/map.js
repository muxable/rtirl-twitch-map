import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/leaflet.css'
import './map.css'

import L from 'leaflet/dist/leaflet'
import * as RealtimeIRL from '@rtirl/api/.'
import firebase from 'firebase/app'

const twitch = window.Twitch.ext

twitch.onAuthorized(
  function (auth) {
    if (firebase) {
      firebase.database.INTERNAL.forceWebSockets()
    }
    const parts = auth.token.split('.')
    const payload = JSON.parse(window.atob(parts[1]))
    const streamerId = payload.channel_id
    const map = L.map('map').setView([0, 0], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    map.removeControl(map.zoomControl)
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable()
    map.dragging.disable()

    const marker = L.marker([0, 0]).addTo(map)
    RealtimeIRL.forStreamer('twitch', streamerId).addLocationListener(location => panToLocation(map, marker, location))
  })

function panToLocation (map, marker, location) {
  const offlineDiv = document.getElementById('offline')
  const mapDiv = document.getElementById('map')

  if (location !== null) {
    offlineDiv.style.visibility = 'hidden'
    mapDiv.style.visibility = 'visible'
    map.panTo([location.latitude, location.longitude], {
      duration: 1.5
    })
    marker.setLatLng([location.latitude, location.longitude], { animate: true, duration: 1.5 })
  } else {
    // Streamer is not pushing data to RealtimeIRL
    offlineDiv.style.visibility = 'visible'
    mapDiv.style.visibility = 'hidden'
  }
}
