import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import "../../style.scss";
const TestimonialSection = () => {
  return (
      <section className="space testimonial-style1 "style={{ backgroundImage: "url('../assets/img/bg/testimonial-bg.jpg')" }}>

        <div className="testimonial-bg-container">

        </div>

        <div className="container">

          <div className="row justify-content-between align-items-center">
            <div className="col-xxl-5 col-xl-5">
              <div className="title-area">
                <span className="sec-subtitle">Travelers' Stories</span>
                <h2 className="sec-title h1">What Our Travelers Say
                </h2>
                <p className="sec-text">
                  Blablatrip connects adventurers with passionate locals for unforgettable experiences.
                  From spiritual journeys to nightlife adventures, our travelers have explored the world
                  in a whole new way with their local Ambassadors!
                </p>
                <Link to="/contact" className="vs-btn style3">Read More Stories</Link>
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
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <p className="testi-text">
                      "We are Carlos and Maria, a young Spanish couple, and we recently had the chance to discover New York in a unique way thanks to Blablatrip.com and our amazing Ambassador, Jack. With his car, he took us to exclusive clubs and bars, far from the touristy spots. We danced until dawn, explored trendy neighborhoods, and discovered hidden spots that only locals know."
                    </p>
                    <div className="testi-avater">
                      <img src="assets/img/testimonial/avater-1-1.jpg" alt="customer image" />
                    </div>
                    <h3 className="testi-name">Carlos & Maria</h3>
                    <span className="testi-degi">New York Experience</span>
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