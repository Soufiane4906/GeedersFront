import Raeact from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";
const HeroSection = () => {
  return (
    <section
    className="hero-layout"
    style={{ backgroundImage: "url('../assets/img/banner/banner-bg-1.png')" }}
    >
      <div className="hero-mask">
        <div
          className="vs-carousel"
          id="hero-slider"
          data-slide-show="1"
          autoplay="false"
        >
          <div className="hero-slide">
            <div className="container">
              <div className="row align-items-center justify-content-between">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <span className="hero-subtitle">Let's Go Now</span>
                    <h1 className="hero-title">
                      Explore the World
                    </h1>
                    <p className="hero-text">
                      Blablatrip connects you with passionate local Ambassadors who are ready to share their city’s best-kept secrets.
                       Skip the crowded tourist traps and immerse yourself in authentic, personalized experiences. 
                    Blablatrip gives you a deeper connection to the places you visit.
                    </p>
                    <a href="about.html" className="vs-btn style4">
                      Read More
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-img">
                    <img
                      className="img1"
                      src="assets/img/banner/banner-img-1-1.jpg"
                      alt="hero"
                    />
                    <img
                      className="img2"
                      src="assets/img/banner/banner-img-1-2.png"
                      alt="hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="hero-bottom">
          <div className="container">
            <form className="hero-form">
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <i className="fas fa-compass"></i>
                    <input type="text" placeholder="Where To?" />
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <i className="fas fa-calendar-alt"></i>
                    <select className="form-select" name="name">
                      <option
                        value=""
                        selected="selected"
                        disabled="disabled"
                        hidden=""
                      >
                        Select Month
                      </option>
                      <option value="">January</option>
                      <option value="">February</option>
                      <option value="">March</option>
                      <option value="">April</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <i className="fas fa-thumbtack"></i>
                    <select className="form-select" name="name">
                      <option
                        value=""
                        selected="selected"
                        disabled="disabled"
                        hidden=""
                      >
                        Select Type
                      </option>
                      <option value="">Adventure</option>
                      <option value="">Combining</option>
                      <option value="">Sporting</option>
                      <option value="">Domestic</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <button className="vs-btn style4">Find Now</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
