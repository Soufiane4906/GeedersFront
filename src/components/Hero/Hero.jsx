import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faCalendarAlt,
  faLanguage,
  faSearch,
  faChevronDown,
  faCar,
  faMotorcycle
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { availableLanguages } from "../../utils/options.js";
import PointsOfInterestSection from "../PointsOfInterestSection/PointsOfInterestSection";
import "./Hero.scss";
import newRequest from "../../utils/newRequest";

const HeroSection = () => {
  // States for form fields
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedPOIs, setSelectedPOIs] = useState([]);
  const [hasCar, setHasCar] = useState(false);
  const [hasScooter, setHasScooter] = useState(false);
  const navigate = useNavigate();
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [showPoiDropdown, setShowPoiDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await newRequest.get("/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        setError("Failed to load countries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle country change
  const handleCountryChange = async (e) => {
    const selectedCountryName = e.target.value;
    setCountry(selectedCountryName);
    setShowCity(true);
    setCity("");
    setSelectedPOIs([]);

    // Clear cities when country changes
    setCities([]);

    // Find the selected country object
    const selectedCountryObj = countries.find(c => c.name === selectedCountryName);

    if (selectedCountryObj) {
      try {
        setIsLoading(true);
        const response = await newRequest.get(`/cities?countryId=${selectedCountryObj._id}`);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities", error);
        setError("Failed to load cities");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setSelectedPOIs([]);
  };

  // Fetch POIs when city is selected
  useEffect(() => {
    const fetchPOIs = async () => {
      if (!city) return;

      try {
        setIsLoading(true);
        const response = await newRequest.get("/pois");
        setPointsOfInterest(response.data.pois || []);
      } catch (error) {
        console.error("Failed to fetch POIs", error);
        setError("Failed to load points of interest");
      } finally {
        setIsLoading(false);
      }
    };

    if (city) {
      fetchPOIs();
    }
  }, [city]);

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

  // Toggle POI selection - using _id as unique identifier
  const togglePOI = (poiId) => {
    setSelectedPOIs(prevSelected => {
      if (prevSelected.includes(poiId)) {
        return prevSelected.filter(id => id !== poiId);
      } else {
        return [...prevSelected, poiId];
      }
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
      if (!e.target.closest('.poi-dropdown-container')) {
        setShowPoiDropdown(false);
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

    // Add vehicle options if selected
    if (hasCar) {
      url += `&hasCar=true`;
    }

    if (hasScooter) {
      url += `&hasScooter=true`;
    }

    navigate(url);
  };

  // Helper function to get POI name by ID
  const getPoiNameById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi ? poi.name : poiId;
  };

  // Helper function to get POI image by ID
  const getPoiImageById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi && poi.image ? poi.image : null;
  };

  // Handle checkbox click directly
  const handleCheckboxClick = (e, id, type) => {
    e.stopPropagation();
    if (type === 'poi') {
      togglePOI(id);
    } else if (type === 'language') {
      toggleLanguage(id);
    }
  };

  return (
      <section className="hero-layout" style={{ backgroundImage: "url('/assets/img/bg/testi-slider-bg1.png')" }}>
        <div className="hero-mask">
          <div className="hero-bottom">
            <div className="container">
              <form className="hero-form">
                <div className="row">

                  {/* Country Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faGlobe} className="me-2"/>
                        Where to?
                      </label>
                      <select
                          required
                          onChange={handleCountryChange}
                          className="form-select"
                          value={country}
                      >
                        <option value="">Select Country</option>
                        {countries.map((countryItem) => (
                            <option key={countryItem._id} value={countryItem.name}>
                              {countryItem.name}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCity} className="me-2"/>
                        Select City
                      </label>
                      <select
                          required
                          onChange={handleCityChange}
                          disabled={!showCity || cities.length === 0}
                          className="form-select"
                          value={city}
                      >
                        <option value="">Select City</option>
                        {cities.map((cityItem) => (
                            <option key={cityItem._id} value={cityItem.name}>
                              {cityItem.name}
                            </option>
                        ))}
                      </select>
                      {isLoading && <div className="loading-indicator">Loading...</div>}
                    </div>
                  </div>

                  {/* Date Range Selection */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2"/>
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

                  {/* Points of Interest Dropdown - Improved Implementation */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group poi-dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faCity} className="me-2"/>
                        Points of Interest
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => setShowPoiDropdown(!showPoiDropdown)}
                            disabled={!city}
                            tabIndex={0}
                        >
        <span className="truncate">
          {selectedPOIs.length === 0
              ? "Select points of interest"
              : `${selectedPOIs.length} POI(s) selected`}
        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle"/>
                        </button>

                        {showPoiDropdown && (
                            <div
                                className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                                style={{maxHeight: "200px", overflowY: "auto"}}
                            >
                              {isLoading ? (
                                  <div className="text-center py-3">Loading points of interest...</div>
                              ) : (
                                  pointsOfInterest.map((poi) => (
                                      <div
                                          key={poi._id}
                                          className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light poi-option"
                                          onClick={() => togglePOI(poi._id)}
                                      >
                                        <div className="form-check mb-0 w-100 d-flex align-items-center">
                                          <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={selectedPOIs.includes(poi._id)}
                                              onChange={(e) => handleCheckboxClick(e, poi._id, "poi")}
                                              id={`poi-${poi._id}`}
                                          />
                                          <label
                                              className="form-check-label ms-2 w-100 d-flex align-items-center"
                                              htmlFor={`poi-${poi._id}`}
                                          >
                                            {poi.image && (
                                                <div className="poi-icon-container me-2">
                                                  <img src={poi.image} alt={poi.name} width="20" height="20"/>
                                                </div>
                                            )}
                                            <span>{poi.name}</span>
                                          </label>
                                        </div>
                                      </div>
                                  ))
                              )}
                              {!isLoading && pointsOfInterest.length === 0 && (
                                  <div className="text-center py-3">No points of interest available</div>
                              )}
                            </div>
                        )}
                      </div>

                      {/* Display selected POIs */}
                      {selectedPOIs.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap selected-pois">
                            {selectedPOIs.map((poiId) => {
                              const poiImage = getPoiImageById(poiId);
                              return (
                                  <span
                                      key={poiId}
                                      className="badge bg-info me-1 mb-1 d-flex align-items-center poi-badge"
                                  >
              {poiImage && (
                  <img src={poiImage} alt="" width="16" height="16" className="me-1"/>
              )}
                                    <span className="poi-name">{getPoiNameById(poiId)}</span>
              <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => togglePOI(poiId)}
              ></button>
            </span>
                              );
                            })}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Language Selection Dropdown with Flags */}
                  <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div className="form-group language-dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faLanguage} className="me-2"/>
                        Languages
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        >
                        <span className="truncate">
                          {selectedLanguages.length === 0
                              ? "Select languages"
                              : `${selectedLanguages.length} language(s) selected`}
                        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle"/>
                        </button>

                        {showLanguageDropdown && (
                            <div
                                className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                                style={{maxHeight: "200px", overflowY: "auto"}}>
                              {availableLanguages.map((lang) => (
                                  <div
                                      key={lang.code}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => toggleLanguage(lang.code)}
                                  >
                                    <div className="form-check mb-0 w-100 d-flex align-items-center">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedLanguages.includes(lang.code)}
                                          onChange={(e) => {
                                          }}
                                          onClick={(e) => handleCheckboxClick(e, lang.code, 'language')}
                                          id={`lang-${lang.code}`}
                                      />
                                      <label className="form-check-label ms-2 w-100" htmlFor={`lang-${lang.code}`}>
                                        <span
                                            className={`flag-icon flag-icon-${lang.code.slice(0, 2).toLowerCase()} me-2`}></span>
                                        {lang.name}
                                      </label>
                                    </div>
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>

                      {/* Display selected languages with flags */}
                      {selectedLanguages.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap selected-languages">
                            {selectedLanguages.map(code => {
                              const lang = availableLanguages.find(l => l.code === code);
                              return lang ? (
                                  <span
                                      key={code}
                                      className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                                  >
                              <span className={`flag-icon flag-icon-${code.slice(0, 2).toLowerCase()} me-1`}></span>
                              <span className="lang-name">{lang.name}</span>
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

                  {/* Vehicle Options */}
                  <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCar} className="me-2"/>
                        Transportation Options
                      </label>
                      <div className="d-flex mt-2">
                        <div className="form-check me-4">
                          <input
                              type="checkbox"
                              className="form-check-input"
                              id="carOption"
                              checked={hasCar}
                              onChange={() => setHasCar(!hasCar)}
                          />
                          <label className="form-check-label" htmlFor="carOption">
                            <FontAwesomeIcon icon={faCar} className="me-2"/>
                            Car Available
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                              type="checkbox"
                              className="form-check-input"
                              id="scooterOption"
                              checked={hasScooter}
                              onChange={() => setHasScooter(!hasScooter)}
                          />
                          <label className="form-check-label" htmlFor="scooterOption">
                            <FontAwesomeIcon icon={faMotorcycle} className="me-2"/>
                            Scooter Available
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="col-lg-4 col-md-12 col-sm-12 col-12 d-flex align-items-end">
                    <button type="button" className="vs-btn style4 w-100" onClick={handleSubmit}>
                      <FontAwesomeIcon icon={faSearch} className="me-2"/>
                      Find Your Adventure
                    </button>
                  </div>

                  {/* Error display */}
                  {error && (
                      <div className="col-12 mt-3">
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      </div>
                  )}

                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;