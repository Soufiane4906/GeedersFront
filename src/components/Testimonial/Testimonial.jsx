import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";
const TestimonialSection = () => {
  return (
    <section className="space testimonial-style1 "style={{ backgroundImage: "url('../assets/img/bg/testimonial-bg.jpg')" }}>
      {/* Full-width background image */}
      <div className="testimonial-bg-container">
        
      </div>

      <div className="container">
      
        <div className="row justify-content-between align-items-center">
          <div className="col-xxl-5 col-xl-5">
            <div className="title-area">
              <span className="sec-subtitle">Go & Discover</span>
              <h2 className="sec-title h1">What Our Travelers Say
              </h2>
              <p className="sec-text">
              Blablatrip connects adventurers with passionate locals for unforgettable experiences. 
              Hear from our travelers who’ve explored the world in a whole new way!
              </p>
              <a href="contact.html" className="vs-btn style3">View More</a>
            </div>
          </div>
          <div className="col-xxl-6 col-xl-7">
            <div className="testi-style1">

              <div className="testi-shape"></div>
              <div className="vs-carousel" id="testId" data-slide-show="1" data-fade="true">
                {/* Testimonial content */}
                <div className="position-relative z-index-common">
                  <div className="testi-quote">
                    <img src="assets/img/shape/quote1.png" alt="quote" />
                  </div>
                  <div className="testi-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>
                  <p className="testi-text">
                  Blablatrip connects you with local ambassadors for unique and authentic adventures. Discover hidden gems,
                   explore cultures, and make unforgettable memories with personalized experiences
                  </p>
                  <div className="testi-avater">
                    <img src="assets/img/testimonial/avater-1-1.jpg" alt="customer image" />
                  </div>
                  <h3 className="testi-name">Lisa Smith</h3>
                  <span className="testi-degi">Developer</span>
                </div>
                {/* Additional Testimonials */}
                {/* Repeat for other testimonials */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
