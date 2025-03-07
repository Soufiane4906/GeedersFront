import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";
import { Link } from "react-router-dom";
const SpecialOfferSection = () => {
  return (
    <section className="space position-relative" style={{ backgroundImage: 'url("assets/img/bg/offer-bg.jpg")' }}>
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
            <div className="title-area white-title mb-md-0">
              <span className="sec-subtitle">Go & Discover</span>
              <h2 className="sec-title h1">Unlock Exclusive Travel Deals</h2>
              <p className="sec-text">
                Explore unique destinations with Blablatrip and enjoy special offers on unforgettable experiences. Plan your journey effortlessly and travel smarter
              </p>
              <Link to="/contact" className="vs-btn style2">View More</Link>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
            <div className="img-box1">
              <img className="img-1-1" src="assets/img/shape/offer-1-1.png" alt="Offer image" />
              <div className="img-1-2 d-none d-xxl-block">
                {/* <img src="assets/img/shape/bag.png" alt="image" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOfferSection;
