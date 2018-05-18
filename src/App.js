import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import MapContainer from './MapContainer'

class App extends Component {
  render() {
    return (
      <div>
        <h1 className="heading"> Google Maps API + React </h1>
          <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBqeCAur3WuwLz9vaZyfuVA4WzfqSFjmiM'
})(App)