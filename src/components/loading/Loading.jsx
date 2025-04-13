// src/components/loading/Loading.jsx
import React from 'react';
import './Loading.scss';
import { FaPlane, FaHotel, FaCar, FaGlobe, FaMapMarkerAlt, FaCompass, FaSuitcase } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="loading-container">


            <div className="loading-world">
                <div className="globe">
                    <FaGlobe className="globe-icon" />
                    <div className="orbit">
                        <div className="plane-container">
                            <FaPlane className="plane" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="loading-icons">
                <div className="icon-wrapper">
                    <FaHotel className="icon hotel" />
                </div>
                <div className="icon-wrapper">
                    <FaCar className="icon car" />
                </div>
                <div className="icon-wrapper">
                    <FaMapMarkerAlt className="icon marker" />
                </div>
                <div className="icon-wrapper">
                    <FaCompass className="icon compass" />
                </div>
                <div className="icon-wrapper">
                    <FaSuitcase className="icon suitcase" />
                </div>
            </div>

            <div className="loading-text">
                <h3>Préparation de votre Aventure</h3>
                <div className="dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>

            <div className="loading-progress">
                <div className="progress-bar"></div>
            </div>
        </div>
    );
};

export default Loading;
