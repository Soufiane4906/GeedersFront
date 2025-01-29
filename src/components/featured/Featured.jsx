import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faLanguage,
  faCar,
  faMotorcycle,
  faChevronDown,
  faChevronUp,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import "./Featured.scss";
import { FaSearchPlus } from "react-icons/fa";
import { languageOptions, pointsOfInterestOptions } from "../../utils/options.js";

// Limited list of countries and cities
const limitedCountries = [
  { name: "France", cities: ["Paris"], image: "../img/paris.jpg" },
  { name: "Spain", cities: ["Barcelona"], image: "../img/barcelone.jpg" },
  { name: "United States", cities: ["New York"], image: "../img/newyork.jpg" },
  { name: "Italy", cities: ["Rome"], image: "../img/rome.jpg" },
  { name: "Japan", cities: ["Tokyo"], image: "../img/tokyo.jpg" },
  { name: "United Kingdom", cities: ["London"], image: "../img/london.jpg" },
  { name: "Germany", cities: ["Berlin"], image: "../img/berlin.jpg" },
  { name: "Canada", cities: ["Toronto"], image: "../img/toronto.jpg" },
];

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

function Featured() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showCity, setShowCity] = useState(false);
  const [cities, setCities] = useState([]);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(false);
  const [selectedPointsOfInterest, setSelectedPointsOfInterest] = useState([]);
  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    const countryData = limitedCountries.find((c) => c.name === selectedCountry);
    setCities(countryData ? countryData.cities : []);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions.map((option) => option.value));
  };

  const handleVehicleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedVehicles((prev) =>
        checked ? [...prev, value] : prev.filter((vehicle) => vehicle !== value)
    );
  };

  const handleVehicleMenuChange = (e) => {
    setShowVehicleOptions(e.target.value === "yes");
  };

  const handleMoreDetailsClick = () => {
    setShowPointsOfInterest((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!country || !city) {
      alert("Please select a country and city.");
      return;
    }

    const queryParams = new URLSearchParams({
      country,
      city,
      languages: selectedLanguages.join(","),
      vehicles: selectedVehicles.join(","),
      pointsOfInterest: selectedPointsOfInterest.join(","),
    });

    navigate(`/gigs?${queryParams.toString()}`);
  };

  return (
      <div className="featured">
        {/* City Image Slider */}
        <div className="city-slider">
          <Slider {...sliderSettings}>
            {limitedCountries.map((country) => (
                <div key={country.name} className="slider-item">
                  <img src={country.image} alt={country.name} />
                  <div className="slider-overlay">
                    <h2>{country.name}</h2>
                    <p>Explore the best of {country.cities[0]}</p>
                  </div>
                </div>
            ))}
          </Slider>
        </div>

        <div className="container">
          <div className="left">
            <h1>
              Discover the perfect <span>local expert</span> for your adventure
            </h1>
            <p className="tagline">
              Find the best travel companions to make your trip unforgettable.
            </p>
            <div className="search-container">
              <div className="select">
                <label>
                  <FontAwesomeIcon icon={faGlobe} /> Country:
                </label>
                <select required onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {limitedCountries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="select">
                <label>
                  <FontAwesomeIcon icon={faCity} /> City:
                </label>
                <select required onChange={handleCityChange} disabled={!showCity}>
                  <option value="">Select City</option>
                  {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                  ))}
                </select>
              </div>
              <div className="select">
                <label>
                  <FontAwesomeIcon icon={faLanguage} /> Languages:
                </label>
                <Select
                    options={languageOptions}
                    isMulti
                    onChange={handleLanguageChange}
                    value={languageOptions.filter((option) =>
                        selectedLanguages.includes(option.value)
                    )}
                />
              </div>
              <div className="additional-fields">
                <p>
                  <FontAwesomeIcon icon={faCar} /> With Vehicle Options?
                </p>
                <div className="radio-buttons">
                  <label>
                    <input
                        type="radio"
                        name="vehicleMenu"
                        value="yes"
                        onChange={handleVehicleMenuChange}
                        checked={showVehicleOptions}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                        type="radio"
                        name="vehicleMenu"
                        value="no"
                        onChange={handleVehicleMenuChange}
                        checked={!showVehicleOptions}
                    />
                    No
                  </label>
                </div>
                {showVehicleOptions && (
                    <div className="vehicle-options">
                      <label className={`checkbox-container ${selectedVehicles.includes("scooter") ? "active" : ""}`}>
                        <input
                            type="checkbox"
                            value="scooter"
                            checked={selectedVehicles.includes("scooter")}
                            onChange={handleVehicleChange}
                        />
                        <FontAwesomeIcon icon={faMotorcycle} /> Scooter
                      </label>
                      <label className={`checkbox-container ${selectedVehicles.includes("car") ? "active" : ""}`}>
                        <input
                            type="checkbox"
                            value="car"
                            checked={selectedVehicles.includes("car")}
                            onChange={handleVehicleChange}
                        />
                        <FontAwesomeIcon icon={faCar} /> Car
                      </label>
                    </div>
                )}
              </div>
              <button className="more-details" onClick={handleMoreDetailsClick}>
                {showPointsOfInterest ? (
                    <>
                      <FontAwesomeIcon icon={faChevronUp} /> Show Less
                    </>
                ) : (
                    <>
                      <FontAwesomeIcon icon={faChevronDown} /> More Details
                    </>
                )}
              </button>
              {showPointsOfInterest && (
                  <div className="points-of-interest">
                    <p className="p-poi">
                      <FontAwesomeIcon icon={faMapPin} /> Points of Interest
                    </p>
                    <div className="poi-options">
                      {pointsOfInterestOptions.map((poi) => (
                          <label
                              key={poi.name}
                              className={`poi-container ${selectedPointsOfInterest.includes(poi.name) ? "active" : ""}`}
                          >
                            <input
                                type="checkbox"
                                value={poi.name}
                                checked={selectedPointsOfInterest.includes(poi.name)}
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  setSelectedPointsOfInterest((prev) =>
                                      checked ? [...prev, value] : prev.filter((poi) => poi !== value)
                                  );
                                }}
                            />
                            <img src={poi.icon} alt={poi.name} />
                            {poi.name}
                          </label>
                      ))}
                    </div>
                  </div>
              )}
              <button className="search-button" onClick={handleSubmit}>
                Search <FaSearchPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Featured;