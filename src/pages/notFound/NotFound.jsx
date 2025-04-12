// src/pages/notFound/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">
                    <div className="container">
                        <img src="/img/404-illustration.svg" alt="Page non trouvée"/>
                    </div>
                </div>

                <div className="actions">
                    <Link to="/" className="action-button home">
                        <FaHome />Back To Home
                    </Link>
                    <Link to="/contact" className="action-button contact">
                        <FaArrowLeft /> Contact Us
                    </Link>
                </div>

                <div className="search-suggestion">
                    <p>Ou essayez de rechercher une expérience :</p>
                    <div className="search-box">
                        <FaSearch />
                        <input type="text" placeholder="Rechercher des expériences..." />
                        <button>Rechercher</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
