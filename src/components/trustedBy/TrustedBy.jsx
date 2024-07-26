import React from "react";
import { FaGlobe, FaUsers, FaStar, FaMoneyBillWave } from 'react-icons/fa';
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <h2>Keep Exploring 🔍 </h2>
        <div className="stats">
          <div className="stat-item">
            <FaGlobe className="stat-icon" />
            <span className="stat-number">+70</span>
            <span className="stat-label">Countries</span>
          </div>
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <span className="stat-number">+5000</span>
            <span className="stat-label">Guides</span>
          </div>
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <span className="stat-number">Top Rated</span>
            <span className="stat-label">Guides</span>
          </div>
          <div className="stat-item">
            <FaMoneyBillWave className="stat-icon" />
            <span className="stat-number">Affordable</span>
            <span className="stat-label">Prices</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
