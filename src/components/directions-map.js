/* global google */
import React, { Component} from "react";

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";

const DirectionsMapHelper = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={props.center}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default class DirectionsMap extends Component {
  state = {
    directions: null,
  }

  componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.props.origin,
      destination: this.props.destination,
      travelMode: google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  render() {
    return (
      <DirectionsMapHelper
        containerElement={
          <div style={{ height: '400px' }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        center={this.props.origin}
        directions={this.state.directions}
        zoom={this.props.zoom}
      />
    );
  }
}