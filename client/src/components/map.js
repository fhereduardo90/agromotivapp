import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const Map = withGoogleMap(({
    onMapLoad = () => {},
    onMapClick = () => {},
    onMarkerRightClick = () => {},
    markers = []
}) => (
  <GoogleMap
    ref={onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={onMapClick}
  >
    {markers.map((marker, index) => (
      <Marker
        {...marker}
        onRightClick={() => onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));

export default Map;