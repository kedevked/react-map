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
    users: []
  }

  componentDidMount() {
    const url = 'https://randomuser.me/api/?results=5'
    fetch(url)
      .then(data => data.json())
      .then(data => {
        this.setState({users: data.results})
        this.loadMap()
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
    const {google} = this.props;
    this.state.locations.forEach( (location, ind) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name
      });

      // display an infowindow with some user pictures
      const infowindow = new google.maps.InfoWindow({
        content: `<h4>${users[ind].name.first} ${users[ind].name.last}</h4> 
                   <img src="${users[ind].picture.medium}"/>`
      });

      //using a closure for i to close the infowindow if clicked an even number of times
      marker.addListener('click', (function() {
        let i =0;
        return function() {
          i++;
          if(i%2 !== 0) {
            infowindow.open(marker, marker);
          }
          else {
            infowindow.close()
          }
        }
      })());
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
    })
  }

  render() {
    const { locations, query, markers} = this.state
    if (query) {
      // get the index of elements that does not start with the query
      // and use that index with markers array to setMap to null
      locations.forEach((l,i) => {
        if(l.name.startsWith(query)) {
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

    document.querySelector('.location').addEventListener('click', function (e) {
      if(e.target && e.target.nodeName == "LI") {
        console.log(e.target.id + " was clicked");
        // get the index of the child and
        //new google.maps.event.trigger( marker, 'click' );
      }
    })

    return (
      <div className="container">
        <div className="text-input">
          <input role="search" type='text' value={this.state.value} onChange={this.handleValueChange}/>
          <ul className="location">{
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