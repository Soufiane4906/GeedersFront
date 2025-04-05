import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

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
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="row">
              <div className="col-md-4">
                <div className="footer-logo">
                  <Link to="/"><BlaBlaTripLogo /></Link>
                  <p className="mt-3">
                    Connecting travelers with unique local experiences around the world.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="footer-links">
                  <h3>Legal</h3>
                  <ul>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>

              <div className="col-md-4">
                <div className="footer-social">
                  <h3>Connect With Us</h3>
                  <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BlaBlaTrip. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
