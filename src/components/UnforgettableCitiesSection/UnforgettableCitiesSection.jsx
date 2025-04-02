import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";

import React from "react";

const UnforgettableCitiesSection = () => {
  return (
    <section
      className="space space-extra-bottom bg-light shape-mockup-wrap"
      style={{ backgroundImage: 'url("assets/img/shape/Bg.png")' }}
    >
      <div
        className="shape-mockup d-none d-xl-block spin z-index-negative"
        style={{ top: "-20%", right: "-8%" }}
      >
        <img src="assets/img/shape/circle1.png" alt="circle" />
      </div>
      <div
        className="shape-mockup d-none d-xl-block z-index-negative"
        style={{ bottom: "13%", left: "0%" }}
      >
        <img src="assets/img/shape/walk.png" alt="circle" />
      </div>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5 col-md-8">
            <div className="title-area">
              <span className="sec-subtitle">Top Destination</span>
              <h2 className="sec-title h1">Unforgettable Cities</h2>

            </div>
          </div>
          <div className="col-auto">
            <div className="sec-btns">
              <button className="icon-btn" data-slick-prev=".destinationSlide">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="icon-btn" data-slick-next=".destinationSlide">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div
          className="row destinationSlide vs-carousel"
          data-slide-show="3"
          data-arrows="false"
          data-lg-slide-show="2"
          data-md-slide-show="2"
          data-sm-slide-show="1"
        >
          <div className="col-xl-4">
            <div className="destination-style1">
              <a href="destination-details.html">
                <img src="assets/img/destinations/destinations-1-1.jpg" alt="destination image" />
              </a>
              <div className="destination-info">
                <h4 className="destination-name"><a href="#">Thailand</a></h4>
                <p className="destination-text">Explore Sea & Get Relax</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="destination-style1">
              <a href="destination-details.html">
                <img src="assets/img/destinations/destinations-1-2.jpg" alt="destination image" />
              </a>
              <div className="destination-info">
                <h4 className="destination-name"><a href="#">Japan</a></h4>
                <p className="destination-text">Explore Sea & Get Relax</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="destination-style1">
              <a href="destination-details.html">
                <img src="assets/img/destinations/destinations-1-3.jpg" alt="destination image" />
              </a>
              <div className="destination-info">
                <h4 className="destination-name"><a href="#">Spain</a></h4>
                <p className="destination-text">Explore Sea & Get Relax</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="destination-style1">
              <a href="destination-details.html">
                <img src="assets/img/destinations/destinations-1-8.jpg" alt="destination image" />
              </a>
              <div className="destination-info">
                <h4 className="destination-name"><a href="#">Mexico</a></h4>
                <p className="destination-text">Explore World & Get Relax</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnforgettableCitiesSection;
