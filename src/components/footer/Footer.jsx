import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faLinkedin, faPinterest, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import "./Footer.scss";
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <div className="footer bg-light py-4">
      <div className="container">


        <hr />

        <div className="row">
          {/* Contact and Info Section */}
          <div className="col-md-6 mb-3">
            <h5>Contact Us</h5>
            <p className="mb-1"><FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> +212 773-777320</p>
            <p className="mb-1"><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> <a href="mailto:geeders.info@gmail.com" className="text-dark">geeders.info@gmail.com</a></p>
            <p><strong>Website:</strong> <a href="http://geeders.com" className="text-dark">geeders.com</a></p>
          </div>

          {/* Footer Bottom */}
          <div className="col-md-6 text-end">
            <div className="social mb-2">
              <a href="#twitter" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} className="me-2" size="lg" /></a>
              <a href="#facebook" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} className="me-2" size="lg" /></a>
              <a href="#linkedin" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} className="me-2" size="lg" /></a>
              <a href="#pinterest" aria-label="Pinterest"><FontAwesomeIcon icon={faPinterest} className="me-2" size="lg" /></a>
              <a href="#instagram" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} className="me-2" size="lg" /></a>
            </div>
            <p className="mb-1">© geeders International Ltd. 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
