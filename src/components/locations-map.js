/*global google*/

import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/places/SearchBox';

export default withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={props.zoom}
    defaultCenter={props.center}
    onClick={props.onMapClick}>
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
        inputPlaceholder="Search for locations to add"
        inputStyle={props.inputStyle}
      />
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));