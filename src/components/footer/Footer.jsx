import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style.scss";

const BlaBlaTripLogo = () => {
  return (
    <div
      style={{
        fontFamily: "Franklin Gothic Demi Cond, Arial Narrow, sans-serif",
        fontSize: "32px",
      }}
    >
      <span style={{ color: "white" }}>BlaBla</span>
      <span style={{ color: "#ff7b00" }}>Trip</span>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer-wrapper footer-layout1" style={{ backgroundImage: "url('assets/img/bg/footer-bg.jpg')" }}>
      <div className="footer-top">
        <div className="shadow-color"></div>
        <div className="container">
          <div className="cta-style1">
            <div className="row g-5 align-items-center justify-content-between">
              <div className="col-lg-6">
                <div className="cta-content">
                  <h2 className="cta-title">Ready to get started?</h2>
                  <p className="cta-text">It only takes a few minutes to register your FREE Travolo account.</p>
                  <a href="sign-up.html" className="vs-btn style2">Open An Account</a>
                </div>
              </div>
              <div className="col-md-5 col-sm-6">
                <div className="cta-image d-lg-block d-none">
                  <img src="assets/img/newsletter.png" alt="CTA" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-area">
        <div className="container">
          <div className="row g-5 justify-content-between">
            <div className="col-md-6 col-xl-3">
              <div className="widget footer-widget">
                <div className="vs-widget-about">
                  <div className="footer-logo">
                    <a href="index.html"><BlaBlaTripLogo /></a>
                  </div>
                  <p className="footer-text">Curabitur aliquet quam id dui bandit posuere blandit.</p>
                  <div className="social-style1">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-pinterest-p"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-2">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title">Useful Links</h3>
                <ul className="menu">
                  <li><a href="index.html"><i className="far fa-angle-right"></i> Home</a></li>
                  <li><a href="destinations.html"><i className="far fa-angle-right"></i> Destinations</a></li>
                  <li><a href="tours.html"><i className="far fa-angle-right"></i> Tour</a></li>
                  <li><a href="shop.html"><i className="far fa-angle-right"></i> Shop</a></li>
                  <li><a href="blog.html"><i className="far fa-angle-right"></i> Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright-wrap">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-auto">
              <p className="copyright-text">
                Copyright <i className="fal fa-copyright"></i> {new Date().getFullYear()} <a href="index.html">BlaBlaTrip</a>.
                All Rights Reserved By <a href="https://themeforest.net/user/vecuro">BlaBlaTrip</a>
              </p>
            </div>
            <div className="col-auto d-none d-lg-block">
              <ul className="list-unstyled copyright-menu">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
