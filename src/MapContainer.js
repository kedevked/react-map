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
    infowindow: new this.props.google.maps.InfoWindow()
  }

  componentDidMount() {
    const url = 'https://randomuser.me/api/?results=5'
    fetch(url)
      .then(data => data.json())
      .then(data => {
        this.setState({users: data.results})
        this.loadMap()
        this.onclickLocation()
      })


  }

 /* componentDidUpdate() {
    this.loadMap(); // call loadMap function to load the google map
  }
*/
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
        this.populateInfoWindow(marker, infowindow, users[ind]);
      });
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow, user) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent(`<h3>${marker.title}</h3><h4>${user.name.first} ${user.name.last} likes it</h4> 
                   <img src="${user.picture.medium}"/>`);
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  onclickLocation = () => {
    const {markers} = this.state
    const that = this
    const {infowindow} = this.state

    const displayInfowindow = (e) => {
      const parentNode = document.querySelector('.locations-list')
      const ind = [...parentNode.childNodes].findIndex(it => it.innerText === e.target.innerText)
      that.populateInfoWindow(markers[ind], infowindow, that.state.users[ind])
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

  render() {
    const { locations, query, markers, infowindow} = this.state
    if (query) {
      // get the index of elements that does not start with the query
      // and use that index with markers array to setMap to null
      locations.forEach((l,i) => {
        if(l.name.toLowerCase().startsWith(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          console.log('infowindow', infowindow.marker)
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
      <div className="container">
        <div className="sidebar text-input text-input-hidden">
          <input role="search" type='text' value={this.state.value} onChange={this.handleValueChange}/>
          <ul className="locations-list">{
            markers.filter(m => m.getVisible()).map((m, i) =>
            (<li key={i} tabIndex="0">{locations[i].name}</li>))
          }</ul>
        </div>
        <div role="application" className="map" ref="map">
          loading map...
        </div>
      </div>
    )
  }
}