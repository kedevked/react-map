import React, { Component } from 'react';
import ReactDOM from 'react-dom'


export default class MapContainer extends Component {

  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  state = {
    locations: [
      { name: "New York County SC", location: {lat: 40.7143033, lng: -74.0036919} },
      { name: "Queens County SC", location: {lat: 40.7046946, lng: -73.8091145} },
      { name: "Kings County SC", location: {lat: 40.6940226, lng: -73.9890967} },
      { name: "Richmond County SC", location: {lat: 40.6412336, lng: -74.0768597} },
      { name: "Bronx SC", location: {lat: 40.8262388, lng: -73.9235238} }
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
        center: {lat: 40.7485722, lng: -74.0068633},
        zoom: 11,
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
    })
  }

  populateInfoWindow = (marker, infowindow, user) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent(`<h3>${marker.title}</h3><h4>${user.name.first} ${user.name.last} lives there</h4> 
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
    console.log('this', this)
    // const {google} = this.props
    const that = this
    const {infowindow} = this.state
    console.log(infowindow)
    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if(e.target && e.target.nodeName === "LI") {
        const ind = [...this.childNodes].findIndex(it => it.innerText === e.target.innerText)
        console.log("ind", ind)
        that.populateInfoWindow(markers[ind], infowindow, that.state.users[ind])
      }
    })
  }

  render() {
    const { locations, query, markers} = this.state
    if (query) {
      // get the index of elements that does not start with the query
      // and use that index with markers array to setMap to null
      locations.forEach((l,i) => {
        if(l.name.toLowerCase().startsWith(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
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
        <div className="text-input">
          <input role="search" type='text' value={this.state.value} onChange={this.handleValueChange}/>
          <ul className="locations-list">{
            markers.filter(m => m.getVisible()).map((m, i) =>
            (<li key={i}>{locations[i].name}</li>))
          }</ul>
        </div>
        <div className="map" ref="map">
          loading map...
        </div>
      </div>
    )
  }
}