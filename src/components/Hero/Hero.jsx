import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
// Remove import of availableLanguages since we'll fetch from API
// import { availableLanguages } from "../../utils/options.js";
import "./Hero.scss";
import newRequest from "../../utils/newRequest";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Image paths - make sure these are correct
const images = [
  "/assets/img/hero/freepik__a-collection-of-colorful-travel-stamps-with-variou__39091.jpeg",
  "/assets/img/hero/freepik__a-collection-of-colorful-travel-stamps-with-variou__39092.jpeg",
  "/assets/img/hero/freepik__a-collection-of-colorful-travel-stamps-with-variou__39093.jpeg",
  "/assets/img/hero/freepik__a-collection-of-colorful-travel-stamps-with-variou__39094.jpeg",
  "/assets/img/hero/v660-mon-04-travelbadge.jpg"
];

const HeroSection = () => {
  // States for form fields
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]); // Add state for languages from API
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedPOIs, setSelectedPOIs] = useState([]);
  const [hasCar, setHasCar] = useState(false);
  const [hasScooter, setHasScooter] = useState(false);
  const navigate = useNavigate();
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [showPoiDropdown, setShowPoiDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sliderLoaded, setSliderLoaded] = useState(false);

  // Improved slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    lazyLoad: 'ondemand',
    beforeChange: () => setSliderLoaded(true),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  // Fetch countries and languages on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch countries
        const countriesResponse = await newRequest.get("/countries");
        setCountries(countriesResponse.data);

        // Fetch languages
        const languagesResponse = await newRequest.get("/languages");
        setLanguages(languagesResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        setError("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get flag URL from language flag code - similar to AdminLanguages
  const getFlagUrl = (flagCode) => {
    // If it's already a full URL, return it
    if (flagCode?.startsWith('http')) {
      return flagCode;
    }

    // Otherwise, assume it's a country code and build the flag URL
    const code = flagCode?.toLowerCase();
    return code ? `https://flagcdn.com/w320/${code}.png` : '';
  };

  // Handle country selection
  const handleCountrySelect = (countryId, countryName) => {
    setCountry(countryName);
    setCity("");
    setSelectedPOIs([]);
    fetchCitiesForCountry(countryId);
    setShowCountryDropdown(false);
  };

  // Fetch cities for a country
  const fetchCitiesForCountry = async (countryId) => {
    try {
      setIsLoading(true);
      const response = await newRequest.get(`/cities?countryId=${countryId}`);
      setCities(response.data);
    } catch (error) {
      console.error("Failed to fetch cities", error);
      setError("Failed to load cities");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setSelectedPOIs([]);
    setShowCityDropdown(false);
    fetchPOIsForCity(cityName);
  };

  // Fetch POIs when city is selected
  const fetchPOIsForCity = async (cityName) => {
    if (!cityName) return;

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

  // Toggle language selection
  const toggleLanguage = (languageId) => {
    setSelectedLanguages(prevSelected => {
      if (prevSelected.includes(languageId)) {
        return prevSelected.filter(id => id !== languageId);
      } else {
        return [...prevSelected, languageId];
      }
    });
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
      if (!e.target.closest('.poi-dropdown-container')) {
        setShowPoiDropdown(false);
      }
      if (!e.target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
      if (!e.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
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

  // Helper function to get language name by ID
  const getLanguageNameById = (languageId) => {
    const language = languages.find(l => l._id === languageId);
    return language ? language.langue : languageId;
  };

  // Helper function to get language flag by ID
  const getLanguageFlagById = (languageId) => {
    const language = languages.find(l => l._id === languageId);
    return language ? getFlagUrl(language.flag) : null;
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

  // Image loading error handler
  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}`);
    // You could set a fallback image here
  };

  return (
      <section className="hero-layout">
        {/* Image Slider with Error Handling */}
        <div className="slider-container">
          <Slider {...settings}>
            {images.map((img, index) => (
                <div key={index} className="slide-item">
                  <img
                      src={img}
                      alt={`Travel destination ${index + 1}`}
                      onError={() => handleImageError(index)}
                      className="slide-image"
                  />
                </div>
            ))}
          </Slider>
        </div>

        <div className="hero-mask">
          <div className="hero-bottom">
            <div className="container">
              <form className="hero-form">
                <div className="row">
                  {/* Country Selection - Now with Checkboxes */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group country-dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faGlobe} className="me-2"/>
                        Where to?
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        >
                        <span className="truncate">
                          {country || "Select Country"}
                        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle"/>
                        </button>

                        {showCountryDropdown && (
                            <div
                                className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                                style={{maxHeight: "200px", overflowY: "auto"}}
                            >
                              {isLoading ? (
                                  <div className="text-center py-3">Loading countries...</div>
                              ) : (
                                  countries.map((countryItem) => (
                                      <div
                                          key={countryItem._id}
                                          className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                          onClick={() => handleCountrySelect(countryItem._id, countryItem.name)}
                                      >
                                        <div className="form-check mb-0 w-100 d-flex align-items-center">
                                          <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={country === countryItem.name}
                                              onChange={() => {}}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCountrySelect(countryItem._id, countryItem.name);
                                              }}
                                              id={`country-${countryItem._id}`}
                                          />
                                          <label
                                              className="form-check-label ms-2 w-100"
                                              htmlFor={`country-${countryItem._id}`}
                                          >
                                            {countryItem.name}
                                          </label>
                                        </div>
                                      </div>
                                  ))
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* City Selection - Now with Checkboxes */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group city-dropdown-container">
                      <label>
                        <FontAwesomeIcon icon={faCity} className="me-2"/>
                        Select City
                      </label>
                      <div className="position-relative">
                        <button
                            type="button"
                            className="form-control text-start d-flex justify-content-between align-items-center"
                            onClick={() => country && setShowCityDropdown(!showCityDropdown)}
                            disabled={!country || cities.length === 0}
                        >
                        <span className="truncate">
                          {city || "Select City"}
                        </span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle"/>
                        </button>

                        {showCityDropdown && (
                            <div
                                className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                                style={{maxHeight: "200px", overflowY: "auto"}}
                            >
                              {isLoading ? (
                                  <div className="text-center py-3">Loading cities...</div>
                              ) : (
                                  cities.map((cityItem) => (
                                      <div
                                          key={cityItem._id}
                                          className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                          onClick={() => handleCitySelect(cityItem.name)}
                                      >
                                        <div className="form-check mb-0 w-100 d-flex align-items-center">
                                          <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={city === cityItem.name}
                                              onChange={() => {}}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCitySelect(cityItem.name);
                                              }}
                                              id={`city-${cityItem._id}`}
                                          />
                                          <label
                                              className="form-check-label ms-2 w-100"
                                              htmlFor={`city-${cityItem._id}`}
                                          >
                                            {cityItem.name}
                                          </label>
                                        </div>
                                      </div>
                                  ))
                              )}
                              {!isLoading && cities.length === 0 && (
                                  <div className="text-center py-3">No cities available</div>
                              )}
                            </div>
                        )}
                      </div>
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

                  {/* Points of Interest Dropdown */}
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
                            onClick={() => city && setShowPoiDropdown(!showPoiDropdown)}
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

                  {/* Language Selection Dropdown with Flags - Now from API */}
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
                                style={{maxHeight: "200px", overflowY: "auto"}}
                            >
                              {isLoading ? (
                                  <div className="text-center py-3">Loading languages...</div>
                              ) : (
                                  languages.map((lang) => (
                                      <div
                                          key={lang._id}
                                          className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                          onClick={() => toggleLanguage(lang._id)}
                                      >
                                        <div className="form-check mb-0 w-100 d-flex align-items-center">
                                          <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={selectedLanguages.includes(lang._id)}
                                              onChange={(e) => handleCheckboxClick(e, lang._id, 'language')}
                                              id={`lang-${lang._id}`}
                                          />
                                          <label className="form-check-label ms-2 w-100 d-flex align-items-center" htmlFor={`lang-${lang._id}`}>
                                            <img
                                                src={getFlagUrl(lang.flag)}
                                                alt={lang.langue}
                                                className="me-2"
                                                style={{ width: '20px', height: 'auto' }}
                                            />
                                            {lang.langue}
                                          </label>
                                        </div>
                                      </div>
                                  ))
                              )}
                              {!isLoading && languages.length === 0 && (
                                  <div className="text-center py-3">No languages available</div>
                              )}
                            </div>
                        )}
                      </div>

                      {/* Display selected languages with flags */}
                      {selectedLanguages.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap selected-languages">
                            {selectedLanguages.map(languageId => {
                              const flagUrl = getLanguageFlagById(languageId);
                              return (
                                  <span
                                      key={languageId}
                                      className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                                  >
                              {flagUrl && (
                                  <img
                                      src={flagUrl}
                                      alt=""
                                      width="16"
                                      height="16"
                                      className="me-1"
                                  />
                              )}
                                    <span className="lang-name">{getLanguageNameById(languageId)}</span>
                              <button
                                  type="button"
                                  className="btn-close btn-close-white ms-2"
                                  onClick={() => toggleLanguage(languageId)}
                              ></button>
                            </span>
                              );
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
                      Find Your Ambassador
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