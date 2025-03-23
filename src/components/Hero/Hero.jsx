import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faCalendarAlt,
  faLanguage,
  faMapMarkerAlt,
  faSearch,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {topVisitedCities, availableLanguages, pointsOfInterest} from "../../utils/options.js";
import "./Hero.scss"; // Make sure to create this file with the SCSS styles

// Extract unique countries
const countries = [...new Set(topVisitedCities.map(item => item.country))].sort();

const HeroSection = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [availablePOIs, setAvailablePOIs] = useState([]);
  const [selectedPOIs, setSelectedPOIs] = useState([]);
  const [showPOIDropdown, setShowPOIDropdown] = useState(false);
  const navigate = useNavigate();

  // Handle country change
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    setSelectedPOIs([]);

    // Filter cities for the selected country
    const filteredCities = topVisitedCities
        .filter(item => item.country === selectedCountry)
        .map(item => item.city)
        .sort();

    setCities(filteredCities);

    // Reset available POIs when country changes
    setAvailablePOIs([]);
  };

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    // Update available POIs based on country and city
    if (country && selectedCity) {
      // Filter POIs by country and city
      const filteredPOIs = pointsOfInterest
          .filter(poi => poi.country === country && poi.city === selectedCity)
          .map(poi => ({
            id: poi.id,
            name: poi.name
          }));

      setAvailablePOIs(filteredPOIs);
    }
  };

  // Toggle POI selection
  const togglePOI = (poiId) => {
    setSelectedPOIs(prevSelected => {
      if (prevSelected.includes(poiId)) {
        return prevSelected.filter(id => id !== poiId);
      } else {
        return [...prevSelected, poiId];
      }
    });
  };

  // Toggle language selection
  const toggleLanguage = (languageCode) => {
    setSelectedLanguages(prevSelected => {
      if (prevSelected.includes(languageCode)) {
        return prevSelected.filter(code => code !== languageCode);
      } else {
        return [...prevSelected, languageCode];
      }
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowLanguageDropdown(false);
        setShowPOIDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    if (!country || !city) {
      alert("Please select a country and city.");
      return;
    }

    // Construct URL with parameters
    let url = `/gigs?country=${country}&city=${city}`;

    // Add dates if selected
    if (startDate && endDate) {
      url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }

    // Add languages if selected
    if (selectedLanguages.length > 0) {
      url += `&languages=${selectedLanguages.join(',')}`;
    }

    // Add POIs if selected
    if (selectedPOIs.length > 0) {
      url += `&poi=${selectedPOIs.join(',')}`;
    }

    navigate(url);
  };

  return (
      <section className="hero-layout" style={{ backgroundImage: "url('/img/banner/banner-bg-1.png')" }}>
        <div className="hero-mask">
          <div className="hero-bottom">
            <div className="container">
              <form className="hero-form">
                <div className="row">

                  {/* Country Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faGlobe} className="me-2" />
                        Where to?
                      </label>
                      <select required onChange={handleCountryChange} className="form-select">
                        <option value="">Select Country</option>
                        {countries.map((countryName) => (
                            <option key={countryName} value={countryName}>
                              {countryName}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCity} className="me-2" />
                        Select City
                      </label>
                      <select required onChange={handleCityChange} disabled={!showCity} className="form-select">
                        <option value="">Select City</option>
                        {cities.map((cityName) => (
                            <option key={cityName} value={cityName}>
                              {cityName}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Range Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Availability
                      </label>
                      <DatePicker
                          selectsRange
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => setDateRange(update)}
                          minDate={new Date()}
                          className="form-control"
                          placeholderText="Select availability range"
                      />
                    </div>
                  </div>

                  {/* Points of Interest Dropdown */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                        Points of Interest
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => setShowPOIDropdown(!showPOIDropdown)}
                            disabled={!city || availablePOIs.length === 0}
                        >
                        <span>
                          {selectedPOIs.length === 0
                              ? "Select points of interest"
                              : `${selectedPOIs.length} POI(s) selected`}
                        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                        </button>

                        {showPOIDropdown && availablePOIs.length > 0 && (
                            <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow" style={{ maxHeight: "200px", overflowY: "auto" }}>
                              {availablePOIs.map((poi) => (
                                  <div
                                      key={poi.id}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => togglePOI(poi.id)}
                                      style={{ cursor: "pointer" }}
                                  >
                                    <div className="form-check mb-0">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedPOIs.includes(poi.id)}
                                          onChange={() => {}}
                                          id={`poi-${poi.id}`}
                                      />
                                      <label className="form-check-label" htmlFor={`poi-${poi.id}`}>
                                        {poi.name}
                                      </label>
                                    </div>
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>

                      {/* Display selected POIs */}
                      {selectedPOIs.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap">
                            {selectedPOIs.map(poiId => {
                              const poi = availablePOIs.find(p => p.id === poiId);
                              return poi ? (
                                  <span
                                      key={poiId}
                                      className="badge bg-info me-1 mb-1 d-flex align-items-center"
                                  >
                              {poi.name}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white ms-2"
                                        onClick={() => togglePOI(poiId)}
                                    ></button>
                            </span>
                              ) : null;
                            })}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Language Selection Dropdown */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faLanguage} className="me-2" />
                        Languages
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        >
                        <span>
                          {selectedLanguages.length === 0
                              ? "Select languages"
                              : `${selectedLanguages.length} language(s) selected`}
                        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                        </button>

                        {showLanguageDropdown && (
                            <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow" style={{ maxHeight: "200px", overflowY: "auto" }}>
                              {availableLanguages.map((lang) => (
                                  <div
                                      key={lang.code}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => toggleLanguage(lang.code)}
                                      style={{ cursor: "pointer" }}
                                  >
                                    <div className="form-check mb-0">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedLanguages.includes(lang.code)}
                                          onChange={() => {}}
                                          id={`lang-${lang.code}`}
                                      />
                                      <label className="form-check-label" htmlFor={`lang-${lang.code}`}>
                                        {lang.name}
                                      </label>
                                    </div>
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>

                      {/* Display selected languages */}
                      {selectedLanguages.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap">
                            {selectedLanguages.map(code => {
                              const lang = availableLanguages.find(l => l.code === code);
                              return lang ? (
                                  <span
                                      key={code}
                                      className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                                  >
                              {lang.name}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white ms-2"
                                        onClick={() => toggleLanguage(code)}
                                    ></button>
                            </span>
                              ) : null;
                            })}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-3 text-center">
                    <button type="button" className="vs-btn style4" onClick={handleSubmit}>
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Find Your Adventure
                    </button>
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