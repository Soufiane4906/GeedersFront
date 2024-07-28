// src/components/Loading.jsx
import React from 'react';
import { FaPlane, FaHotel, FaCar, FaGlobe } from 'react-icons/fa'; // Example travel icons
import './Loading.scss'; // Import the SCSS file for styling
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-icons">
        <FaPlane className="icon" />
        <FaHotel className="icon" />
        <FaCar className="icon" />
        <FaGlobe className="icon" />
      </div>
      <FaSpinner className="spinner" />

      <p>Loading...</p>
    </div>
  );
};

export default Loading;
