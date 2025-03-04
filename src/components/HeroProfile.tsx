import React from "react";
import "./../style.scss";
import { Link } from 'react-router-dom';

const HeroProfile = () => {
  return (
    <div
      className="breadcumb-wrapper"
      style={{
        backgroundImage: "url('assets/img/breadcumb/breadcumb-bg.jpg')",
      }}
    >
      <div className="container z-index-common">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">Get Started</h1>
          <div className="breadcumb-menu-wrap">
            <ul className="breadcumb-menu">
              <li>
                <Link to="/" className="text-white">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
