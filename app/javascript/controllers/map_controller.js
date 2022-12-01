import { Controller } from '@hotwired/stimulus'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

export default class extends Controller {
  static values = {
    apiKey: String,
    points: Object,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    navigator.geolocation.getCurrentPosition((position)=>{
      this.userLocation = [position.coords.longitude, position.coords.latitude]
    })

      // an arbitrary start will always be the same
      // only the end or destination will change
      // const start = [-122.662323, 45.523751];

      // this is where the code for the next step will go

        // add turn instructions here at the end

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v12",
      center: this.userLocation
    })

    this.#addMarkersToMap()
    this.#fitMapToMarkers()


    const directions = new MapboxDirections({
      accessToken: this.apiKeyValue,
      interctive: false,
      unit: 'metric',
      profile: 'mapbox/walking',
      controls: {
        input: false,
        instructions: false
      }
    });

    this.map.on('load', () => {
      directions.setOrigin([-46.6877941, -23.5530298])

      // this.pointsValue.waypoints.forEach((waypoint) => {
      //   directions.addWaypoint(waypoint.position, [waypoint.lng, waypoint.lat])
      // })

      directions.setDestination([-46.6892309, -23.5517186])


      // this.map.addLayer({
      //   id: 'route',
      //   type: 'line',
      //   source: 'route',
      //   layout: {
      //     'line-join': 'round',
      //     'line-cap': 'round'
      //   },
      //   paint: {
      //     'line-color': '#3887be',
      //     'line-width': 5,
      //     'line-opacity': 0.75
      //   }
      // });


      // this is where the code from the next step will go
    });

    // this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl }))

    this.map.addControl(directions, 'top-left');
  };

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window)
      const customMarker = document.createElement("div")
      customMarker.className = "marker"
      customMarker.style.backgroundImage = `url('${marker.image_url}')`
      customMarker.style.backgroundSize = "contain"
      customMarker.style.width = "60px"
      customMarker.style.height = "60px"

    new mapboxgl.Marker(customMarker)
      .setLngLat([ marker.lng, marker.lat ])
      .setPopup(popup)
      .addTo(this.map)
    })
   }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }

};
