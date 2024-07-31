import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

const InteractiveMap = ({ locations }) => {
  // Default center of the map
  const defaultCenter = [51.505, -0.09];

  // Check if locations data exists and has valid items
  const validLocations = locations.filter(location =>
    location && location.latitude && location.longitude
  );

  return (
    <div className="map-container">
      <MapContainer center={validLocations.length > 0 ? [validLocations[0].latitude, validLocations[0].longitude] : defaultCenter} zoom={13} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {validLocations.map((location) => (
          <Marker key={location._id} position={[location.latitude, location.longitude]}>
            <Popup>
              <h3>{location.title}</h3>
              <p>{location.description}</p>
              <Link to={`/gig/${location._id}`}>View Details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
