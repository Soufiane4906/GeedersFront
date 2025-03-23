import React from 'react';
import { Link } from 'react-router-dom';
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
                    <p className="cta-text">It only takes a few minutes to register your FREE BlaBlaTrip account.</p>
                    <Link to="/register" className="vs-btn style2">Open An Account</Link>
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
                      <Link to="/"><BlaBlaTripLogo /></Link>
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
                    <li><Link to="/"><i className="far fa-angle-right"></i> Home</Link></li>
                    <li><Link to="/gigs"><i className="far fa-angle-right"></i> Destinations</Link></li>
                    <li><Link to="/about"><i className="far fa-angle-right"></i> About Us</Link></li>
                    <li><Link to="/terms"><i className="far fa-angle-right"></i> Terms & Conditions</Link></li>
                    <li><Link to="/privacy"><i className="far fa-angle-right"></i> Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-xl-3">
                <div className="widget footer-widget">
                  <h3 className="widget_title">Company Info</h3>
                  <p className="footer-text">
                    StarkX LLC<br />
                    30 N Gould St Ste R<br />
                    Sheridan, WY 82801<br />
                    EIN: 98-1845762
                  </p>
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
                  Copyright <i className="fal fa-copyright"></i> {new Date().getFullYear()} <Link to="/">BlaBlaTrip</Link>.
                  All Rights Reserved By <span>StarkX LLC</span>
                </p>
              </div>
              <div className="col-auto d-none d-lg-block">
                <ul className="list-unstyled copyright-menu">
                  <li><Link to="/privacy">Privacy</Link></li>
                  <li><Link to="/terms">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;