import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style.scss";
import React from "react";
import './UnforgettableCitiesSection.scss'

const UnforgettableCitiesSection = () => {
  // Données des destinations
  const destinations = [
    {
      id: 1,
      country: "Morocco",
      city: "Marrakech",
      description: "Explore ancient medinas & vibrant souks",
      image: "https://www.clickexcursions.com/storage/excursions/June2022/9JVxSePAHAAf7SruQMH1.jpg"
    },
    {
      id: 2,
      country: "France",
      city: "Paris",
      description: "Discover art, culture & gastronomy",
      image: "https://hospitality-on.com/sites/default/files/2017-09/Paris.jpg"
    },
    {
      id: 3,
      country: "Morocco",
      city: "Chefchaouen",
      description: "Wander through the blue pearl city",
      image: "https://www.tracedirecte.com/media/original_images/chefchaouen-maroc.jpg.1920x0_q85_format-jpg.jpg"
    },
    {
      id: 4,
      country: "France",
      city: "Nice",
      description: "Experience French Riviera charm",
      image: "https://www.kaplaninternational.com/files/styles/hero_banner_k_mb/public/school/New%20folder/kaplan-nice-school-hero.jpg?itok=iHm9DOqn"
    },
    {
      id: 5,
      country: "Morocco",
      city: "Essaouira",
      description: "Feel the Atlantic breeze & coastal magic",
      image: "https://parisinsider-fr.com/wp-content/uploads/2020/12/essouira-une-maroc.jpg"
    },
    {
      id: 6,
      country: "France",
      city: "Lyon",
      description: "Savor culinary excellence & history",
      image: "https://medias.bikube.co/_medias-bikube-prod_/4baddfe8-92e3-4943-87a4-920722acb4a3/Generique-Blog-Lyon-1.jpg?w=3840&q=75"
    }
  ];

  return (
      <section
          className="space space-extra-bottom bg-light shape-mockup-wrap"
          style={{ backgroundImage: 'url("assets/img/shape/Bg.png")' }}
      >
        <div
            className="shape-mockup d-none d-xl-block spin z-index-negative"
            style={{ top: "-20%", right: "-8%" }}
        >
          <img src="assets/img/shape/circle1.png" alt="circle" />
        </div>
        <div
            className="shape-mockup d-none d-xl-block z-index-negative"
            style={{ bottom: "13%", left: "0%" }}
        >
          <img src="assets/img/shape/walk.png" alt="circle" />
        </div>
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-5 col-md-8">
              <div className="title-area">
                <span className="sec-subtitle">Top Destinations</span>
                <h2 className="sec-title h1">Unforgettable Cities</h2>
                <p className="sec-text mt-3">Discover magical places in Morocco and France with our local ambassadors who know every hidden gem and authentic experience.</p>
              </div>
            </div>
            <div className="col-auto">
              <div className="sec-btns">
                <button className="icon-btn" data-slick-prev=".destinationSlide">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="icon-btn" data-slick-next=".destinationSlide">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div
              className="row destinationSlide vs-carousel"
              data-slide-show="3"
              data-arrows="false"
              data-lg-slide-show="2"
              data-md-slide-show="2"
              data-sm-slide-show="1"
          >
            {destinations.map(destination => (
                <div className="col-xl-4" key={destination.id}>
                  <div className="destination-style1">
                    <a href={`/destinations/${destination.country.toLowerCase()}/${destination.city.toLowerCase()}`}>
                      <img
                          src={destination.image}
                          alt={`${destination.city}, ${destination.country}`}
                          className="img-fluid"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "assets/img/destinations/destination-placeholder.jpg";
                          }}
                      />
                    </a>
                    <div className="destination-info">
                      <div className="destination-country">
                    <span className="country-badge">
                      {destination.country === "Morocco" ?
                          <img src="/img/flags/ma.png" alt="Morocco flag" className="flag-icon me-1" /> :
                          <img src="/img/flags/fr.png" alt="France flag" className="flag-icon me-1" />
                      }
                      {destination.country}
                    </span>
                      </div>
                      <h4 className="destination-name">
                        <a href={`/destinations/${destination.country.toLowerCase()}/${destination.city.toLowerCase()}`}>
                          {destination.city}
                        </a>
                      </h4>
                      <p className="destination-text">{destination.description}</p>
                      <div className="explore-btn">
                        <a href={`/destinations/${destination.country.toLowerCase()}/${destination.city.toLowerCase()}`} className="link-btn">
                          Explore <i className="fas fa-arrow-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <a href="/destinations" className="vs-btn">View All Destinations</a>
          </div>
        </div>
      </section>
  );
};

export default UnforgettableCitiesSection;
