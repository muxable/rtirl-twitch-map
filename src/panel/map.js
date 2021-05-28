import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/leaflet.css'
import './map.css'

import L from 'leaflet/dist/leaflet'
import * as RealtimeIRL from '@rtirl/api/.'
import firebase from 'firebase/app'

const twitch = window.Twitch.ext

// Set up map
const map = createMap()
const marker = L.marker([0, 0]).addTo(map)

function createMap () {
  const myMap = L.map('map').setView([0, 0], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap)

  myMap.removeControl(myMap.zoomControl)
  myMap.scrollWheelZoom.disable()
  myMap.doubleClickZoom.disable()
  myMap.dragging.disable()

  return myMap
}

function panToLocation (location) {
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

function handleAuth (auth) {
  if (firebase) {
    firebase.database.INTERNAL.forceWebSockets()
  }
  const parts = auth.token.split('.')
  const payload = JSON.parse(window.atob(parts[1]))
  const streamerId = payload.channel_id
  RealtimeIRL.forStreamer('twitch', streamerId).addLocationListener(location => panToLocation(location))
}

// Twitch events
twitch.onAuthorized(handleAuth)
