import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faLinkedin, faPinterest, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import "./Footer.scss";

function Footer() {
  return (
      <div className="footer bg-light py-4">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo Section */}
            <div className="col-md-4 mb-3 text-center">
              <img src="./img/img_1.svg" style={{borderRadius : "1px solid #6841ea "}} alt="BlaBlaTrip Logo" className="footer-logo" />
            </div>

            {/* Contact and Info Section */}
            <div className="col-md-4 mb-3">
              <h5>Contact Us</h5>
              <p className="mb-1"><FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> +212 773-777320</p>
              <p className="mb-1"><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> <a href="mailto:BlaBlaTrip.info@gmail.com" className="text-dark">BlaBlaTrip.info@gmail.com</a></p>
              <p><strong>Website:</strong> <a href="http://BlaBlaTrip.com" className="text-dark">BlaBlaTrip.com</a></p>
            </div>

            {/* Social Media Section */}
            <div className="col-md-4 text-center">
              <div className="social mb-2">
                <a href="#twitter" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} className="me-2" size="lg" /></a>
                <a href="#facebook" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} className="me-2" size="lg" /></a>
                <a href="#linkedin" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} className="me-2" size="lg" /></a>
                <a href="#pinterest" aria-label="Pinterest"><FontAwesomeIcon icon={faPinterest} className="me-2" size="lg" /></a>
                <a href="#instagram" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} className="me-2" size="lg" /></a>
              </div>
              <p className="mb-1">© BlaBlaTrip International Ltd. 2023</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Footer;