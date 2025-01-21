import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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
import { countriesData, languageOptions, pointsOfInterestOptions } from "../../utils/options.js";

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
  const [backgroundImage, setBackgroundImage] = useState("./img/img_1.png");
  const navigate = useNavigate();

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    try {
      const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: selectedCountry }
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
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
    setBackgroundImage((prev) =>
        prev === "./img/img_1.png" ? "./img/img_2.png" : "./img/img_1.png"
    );
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
        <div className="container">
          <div className="left">
            <h1>
              Discover the perfect <span>guide</span> for your adventure
            </h1>
            <div className="search-container">
              <div className="select">
                <label>
                  <FontAwesomeIcon icon={faGlobe} /> Country:
                </label>
                <select required onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {countriesData.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.flag} {country.name}
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