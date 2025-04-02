import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";
const BlogSection = () => {
  return (
      <div className="space-top space-extra-bottom blog-wrapper1 shape-mockup-wrap">
        <div
            className="shape-mockup d-none d-xl-block spin z-index-negative"
            data-top="-5%"
            data-left="-5%"
        >
          <img src="assets/img/shape/circle1.png" alt="circle" />
        </div>
        <div
            className="shape-mockup d-none d-xl-block jump z-index-negative"
            data-bottom="5%"
            data-right="5%"
        >
          <img src="assets/img/shape/Dot.png" alt="Dots" />
        </div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-xxl-6 col-xl-7 col-lg-8 wow fadeInUp" data-wow-delay="0.3s">
              <div className="title-area">
                <span className="sec-subtitle">Travel Essentials Tips</span>
                <h2 className="sec-title h1">Travel Differently, Meet Local Ambassadors</h2>
              </div>
            </div>
          </div>
          <div className="blog-style4">
            <div className="blog-image">
              <img src="assets/img/blog/blog-a-1-1.jpg" alt="blog" />
              <div className="category-tag">
                <a href="#">
                  <i className="fas fa-tag"></i> Tips
                </a>
              </div>
            </div>
            <div className="blog-content" data-bg-src="assets/img/shape/blog-bg.png">
              <a className="blog-date" href="blog-details.html">
                <i className="far fa-calendar-alt"></i> April 1, 2025
              </a>
              <h3 className="blog-title">
                <a href="blog-details.html">Say Goodbye to Tourist Traps and Pre-Made Itineraries</a>
              </h3>
              <p className="blog-text">
                Say goodbye to endless tours and early morning schedules! As a local Ambassador, we craft tailor-made experiences at your pace,
                avoiding traditional tourist traps and places you don't really want to visit. Enjoy unique moments at comfortable times,
                and explore the real local treasures.
              </p>
              <a className="vs-btn style4" href="blog-details.html">Read More</a>
            </div>
          </div>
          <div className="blog-style4">
            <div className="blog-image">
              <img src="assets/img/blog/blog-a-1-2.jpg" alt="blog" />
              <div className="category-tag">
                <a href="#">
                  <i className="fas fa-tag"></i> Tips
                </a>
              </div>
            </div>
            <div className="blog-content" data-bg-src="assets/img/shape/blog-bg.png">
              <a className="blog-date" href="blog-details.html">
                <i className="far fa-calendar-alt"></i> April 1, 2025
              </a>
              <h3 className="blog-title">
                <a href="blog-details.html">Explore at Your Own Pace with a Personal Ambassador</a>
              </h3>
              <p className="blog-text">
                Explore the world at your own pace with a Blablatrip Ambassador. With personalized itineraries and expert advice,
                you'll experience unforgettable and enriching moments. Take the opportunity to discover a destination like a local,
                with ease and friendliness.
              </p>
              <a className="vs-btn style4" href="blog-details.html">Read More</a>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BlogSection;