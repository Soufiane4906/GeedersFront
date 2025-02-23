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
              <h2 className="sec-title h1">Awesome Tips That Makes Your Travel Beautiful</h2>
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
              <i className="far fa-calendar-alt"></i> July 21, 2023
            </a>
            <h3 className="blog-title">
              <a href="blog-details.html">A Time to Travel And Find Breathtaking Landscapes For Relax</a>
            </h3>
            <p className="blog-text">
            When you travel with Blablatrip, you're not just visiting a place; you're diving into a local experience. To make the most of your journey, 
            pack light but be prepared with the essentials—comfortable shoes, local currency, and a power bank
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
              <i className="far fa-calendar-alt"></i> July 21, 2023
            </a>
            <h3 className="blog-title">
              <a href="blog-details.html">A Time to Travel And Find Breathtaking Landscapes For Relax</a>
            </h3>
            <p className="blog-text">
            Traveling with Blablatrip means exploring beyond the ordinary. To enhance your adventure, e
            nsure you’re always ready—bring a good camera for memories
            </p>
            <a className="vs-btn style4" href="blog-details.html">Read More</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
