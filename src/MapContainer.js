import React, { Component } from 'react';
import ReactDOM from 'react-dom'


export default class MapContainer extends Component {

  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  state = {
    locations: [
      { name: "Ensimag", location: {lat: 45.1931492, lng: 5.7674826999999596} },
      { name: "Atos", location: {lat: 45.1539228, lng: 5.7207387999999355} },
      { name: "Museum", location: {lat: 45.1949173, lng: 5.732278299999962} },
      { name: "Stadium", location: {lat: 45.1874353, lng: 5.740127799999982} },
      { name: "Mall", location: {lat: 45.158158, lng: 5.731906999999978} }
    ],
    query: '',
    markers: [],
    users: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    highlightedIcon: null,
    error: null
  }

  componentDidMount() {
    const url = 'https://randomuser.me/api/?results=5'
    fetch(url)
      .then(data => {
        if(data.ok) {
          return data.json()
        } else {
          this.setState({error: data.statusText})
          throw new Error(data.statusText)
        }
      })
      .then(data => {
        this.setState({users: data.results})
        this.loadMap()
        this.onclickLocation()
      })
    // Create a "highlighted location" marker color for when the user
    // clicks on the marker.
    this.setState({highlightedIcon: this.makeMarkerIcon('FFFF24')})

  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 45.188529, lng: 5.724523999999974},
        zoom: 12,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig);
      this.addMarkers();
    }


  }

  handleValueChange = (e) => {
    this.setState({query: e.target.value})
  }

  addMarkers = () => {
    const {users} = this.state
    const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds();

    this.state.locations.forEach( (location, ind) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name
      });

      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow, users[ind])
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow, user) => {
    // Check to make sure the infowindow is not already opened on this marker.
    const defaultIcon = marker.getIcon()
    const {markers, highlightedIcon} = this.state
    const {google} = this.props

    const service = new google.maps.places.PlacesService(this.map)
    const geocoder = new google.maps.Geocoder()

    if (infowindow.marker !== marker) {
      // change the color of previous marker
      if(infowindow.marker) {
        const ind = markers.findIndex(m => m.title === infowindow.marker.title)
        markers[ind].setIcon(defaultIcon)
      }
      marker.setIcon(highlightedIcon)
      infowindow.marker = marker;


      geocoder.geocode({'location': marker.position}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            service.getDetails({
              placeId: results[1].place_id
            }, (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                infowindow.setContent(`<h4>Location: <strong>${marker.title}</strong></h4>
                             <div>Latitude: ${marker.getPosition().lat()}</div>
                             <div>Longitude: ${marker.getPosition().lng()}</div>
                             <h3>User</h3>
                             <div>${user.name.first} ${user.name.last}</div>
                             <h4> Other details: </h4>
                             <div>${place.name}, ${place.formatted_address}</div>
                             <img src="${user.picture.medium}" alt="user living in ${marker.title}"/>`);
                infowindow.open(this.map, marker);
              }
            });

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.marker = null
        marker.setIcon(defaultIcon)
      });
    }
  }

  onclickLocation = () => {
    const {markers} = this.state
    const that = this
    const {infowindow} = this.state

    const displayInfowindow = (e) => {
      const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
      that.populateInfoWindow(markers[markerInd], infowindow, that.state.users[markerInd])
    }
    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if(e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })
    document.querySelector('.locations-list').addEventListener('keydown', function (e) {
      if(e.keyCode === 13 ){
        displayInfowindow(e)
      }
    })
  }

  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  render() {
    const { locations, query, markers, infowindow} = this.state
    if (query) {
      // get the index of elements that does not start with the query
      // and use that index with markers array to setMap to null
      locations.forEach((l,i) => {
        if(l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          if (infowindow.marker === markers[i]){
            // close the info window if marker removed
            infowindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l,i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      })
    }

    return (
      <div>
        {this.state.error ? (<div className="error">An error has occurred; please try later</div>):
          (<div className="container">
            <div className="sidebar text-input text-input-hidden">
              <input role="search" type='text' value={this.state.value} onChange={this.handleValueChange}/>
         <div>
                <ul className="locations-list">{
                  markers.filter(m => m.getVisible()).map((m, i) =>
                    (<li role="link" key={i} tabIndex="0">{m.title}</li>))
                }</ul>
              </div>
            </div>
            <div role="application" className="map" ref="map">
              loading map...
            </div>
      </div>)}
      </div>
    )
  }
}