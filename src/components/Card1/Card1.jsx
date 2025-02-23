import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";
const Card1 = () => {
  return (
    <section className="space space-extra-bottom gallery-style1">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="title-area">
              <span className="sec-subtitle">Go & Discover</span>
              <h2 className="sec-title h1">Breathtaking Cities</h2>
              <p className="sec-text">
              Blablatrip invites you to explore cities through the eyes of passionate locals. From hidden alleyways to famous landmarks
              </p>
            </div>
            <div className="row">
              <div className="col-xl-6 col-sm-6">
                <img className="gallery-image" src="assets/img/gallery/gallery-1-1.jpg" alt="gallery" />
              </div>
              <div className="col-xl-6 col-sm-6">
                <img className="gallery-image" src="assets/img/gallery/gallery-1-2.jpg" alt="gallery" />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="gallery-video">
              <img src="assets/img/gallery/gallery-1-3.jpg" alt="gallery" />
              <div className="gallery-btn">
                <span>Watch Video</span>
                <a href="https://youtu.be/YFhwEJosUsU?si=m7KDhyJe9uss4owL" className="play-btn popup-video">
                  <i className="fas fa-play"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card1;
