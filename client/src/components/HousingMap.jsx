import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '100%'
};

const center = {
  lat: 42.2565,
  lng: -72.5753
};

const HousingMap = ({ dorms }) => {
  const [selectedDorm, setSelectedDorm] = React.useState(null);

  return (
    <LoadScript googleMapsApiKey="AIzaSyANF9-IapRORSLpt1JzHLEzkJzYD23oklE">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        {dorms.map(dorm => (
          <Marker
            key={dorm._id}
            position={{
              lat: dorm.location.coordinates[0],
              lng: dorm.location.coordinates[1]
            }}
            onClick={() => {
              setSelectedDorm(dorm);
            }}
          />
        ))}

        {selectedDorm && (
          <InfoWindow
            position={{
              lat: selectedDorm.location.coordinates[0],
              lng: selectedDorm.location.coordinates[1]
            }}
            onCloseClick={() => {
              setSelectedDorm(null);
            }}
          >
            <div>
              <h2>{selectedDorm.name}</h2>
              <p>{selectedDorm.description}</p>
              <a href={`/dorm/${selectedDorm._id}`}>View Details</a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default HousingMap;