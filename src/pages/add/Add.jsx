import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faInfoCircle,
  faStarOfLife,
  faClock,
  faMapMarkerAlt,
  faMapMarkedAlt,
  faTachometerAlt,
  faGlobe,
  faCity,
  faCar,
  faMotorcycle,
  faCheck,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { topVisitedCities } from "../../utils/options.js";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Add.scss";
import WysiwygEditor from "../../components/WysiwygEditor.jsx";

const Add = () => {
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    country: "",
    city: "",
    hasCar: "",
    carPrice: 0,
    hasScooter: "",
    scooterPrice: 0,
    availabilityTimes: selectedDates,
    shortDesc: "",
    price: 0,
    features: [],
    poi: [],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [selectedPointsOfInterest, setSelectedPointsOfInterest] = useState([]);
  const navigate = useNavigate();

  // Extract unique countries from topVisitedCities
  const countries = [...new Set(topVisitedCities.map(item => item.country))].sort();

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountry,
      city: "",
    }));
    setShowCity(true);

    // Get cities that match the selected country
    const filteredCities = topVisitedCities
        .filter((item) => item.country === selectedCountry)
        .map((item) => item.city)
        .sort();

    setCities(filteredCities);

    // Clear city validation error if country is selected
    if (selectedCountry) {
      setValidationErrors(prev => ({ ...prev, country: "" }));
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData((prevData) => ({ ...prevData, city: selectedCity }));

    // Clear city validation error if city is selected
    if (selectedCity) {
      setValidationErrors(prev => ({ ...prev, city: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error for the field being changed
    if (value) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const feature = e.target[0].value;
    if (feature) {
      setFormData((prevData) => ({
        ...prevData,
        features: [...prevData.features, feature],
      }));
      e.target[0].value = "";
    }
  };

  const validateStep = (currentStep) => {
    const errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        errors.title = "Title is required";
        isValid = false;
      }
      if (!formData.desc.trim()) {
        errors.desc = "Description is required";
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.country) {
        errors.country = "Country is required";
        isValid = false;
      }
      if (!formData.city) {
        errors.city = "City is required";
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.hasCar) {
        errors.hasCar = "Please specify if you have a car";
        isValid = false;
      }
      if (!formData.hasScooter) {
        errors.hasScooter = "Please specify if you have a scooter";
        isValid = false;
      }
      if (selectedDates.length === 0) {
        errors.availabilityTimes = "Please select available dates";
        isValid = false;
      }
    } else if (currentStep === 4) {
      if (!formData.shortDesc.trim()) {
        errors.shortDesc = "Short description is required";
        isValid = false;
      }
      if (formData.price <= 0) {
        errors.price = "Price must be greater than 0";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => setStep(step - 1);

  const handlePoiChange = (poiName) => {
    setSelectedPointsOfInterest(prev => {
      if (prev.includes(poiName)) {
        return prev.filter(p => p !== poiName);
      } else {
        return [...prev, poiName];
      }
    });

    // Update formData with the selected POIs
    setFormData(prev => ({
      ...prev,
      poi: selectedPointsOfInterest.includes(poiName)
          ? prev.poi.filter(p => p !== poiName)
          : [...prev.poi, poiName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const gigData = {
        ...formData,
        userId: currentUser._id,
        availabilityTimes: selectedDates,
        poi: selectedPointsOfInterest
      };
      await newRequest.post("/gigs", gigData);
      toast.success("Gig created successfully!");
      navigate("/myGigs");
    } catch (error) {
      toast.error("Error creating gig: " + (error.response?.data?.message || error.message));
    }
  };

  return (
      <div className="add-gig-container">
        <div className="add-gig-wrapper">
          <div className="section-title">
            <h2>Add New Gig</h2>
            <p>Create your new service offering for travelers</p>
          </div>

          <ToastContainer position="top-right" autoClose={5000} />

          <div className="progress-container">
            <ProgressBar
                percent={(step - 1) * 33.33}
                filledBackground="linear-gradient(to right, #ff681a, #37d4d9)"
            >
              <Step>
                {({ accomplished }) => (
                    <div className={`progress-step ${accomplished ? "accomplished" : ""}`}>
                      <span>1</span>
                      <p>Basic Info</p>
                    </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                    <div className={`progress-step ${accomplished ? "accomplished" : ""}`}>
                      <span>2</span>
                      <p>Location</p>
                    </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                    <div className={`progress-step ${accomplished ? "accomplished" : ""}`}>
                      <span>3</span>
                      <p>Services</p>
                    </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                    <div className={`progress-step ${accomplished ? "accomplished" : ""}`}>
                      <span>4</span>
                      <p>Details</p>
                    </div>
                )}
              </Step>
            </ProgressBar>
          </div>

          <div className="form-container">
            {step === 1 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="title">
                      <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                      Title <span className="required-star">*</span>
                    </label>
                    <input
                        type="text"
                        className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                        name="title"
                        value={formData.title}
                        placeholder="e.g. I will guide you through Paris..."
                        onChange={handleChange}
                    />
                    {validationErrors.title && (
                        <div className="error-message">
                          <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.title}
                        </div>
                    )}
                  </div>

              <div className="form-group">
                    <label htmlFor="desc">
                      <FontAwesomeIcon icon={faInfoCircle} className="icon" />
                      Description <span className="required-star">*</span>
                    </label>
                    {/* Replace textarea with WYSIWYG editor */}
                    <WysiwygEditor
                        value={formData.desc}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            desc: e.target.value
                          }));
                          if (e.target.value) {
                            setValidationErrors(prev => ({ ...prev, desc: "" }));
                          }
                        }}
                        placeholder="Describe your service in detail... What makes your guide service unique?"
                    />
                    {validationErrors.desc && (
                        <div className="error-message">
                          <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.desc}
                        </div>
                    )}
                  </div>

                  <div className="button-group">
                    <button className="btn next-btn" onClick={nextStep}>
                      Next <FontAwesomeIcon icon={faCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div className="form-step">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="country">
                          <FontAwesomeIcon icon={faGlobe} className="icon" />
                          Country <span className="required-star">*</span>
                        </label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleCountryChange}
                            className={`form-control ${validationErrors.country ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select Country</option>
                          {countries.map((countryName) => (
                              <option key={countryName} value={countryName}>
                                {countryName}
                              </option>
                          ))}
                        </select>
                        {validationErrors.country && (
                            <div className="error-message">
                              <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.country}
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="city">
                          <FontAwesomeIcon icon={faCity} className="icon" />
                          City <span className="required-star">*</span>
                        </label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleCityChange}
                            disabled={!showCity}
                            className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                          ))}
                        </select>
                        {validationErrors.city && (
                            <div className="error-message">
                              <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.city}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn back-btn" onClick={prevStep}>
                      Back
                    </button>
                    <button className="btn next-btn" onClick={nextStep}>
                      Next <FontAwesomeIcon icon={faCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
            )}

            {step === 3 && (
                <div className="form-step">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="hasCar">
                          <FontAwesomeIcon icon={faCar} className="icon" />
                          Will you have a car? <span className="required-star">*</span>
                        </label>
                        <select
                            name="hasCar"
                            className={`form-control ${validationErrors.hasCar ? 'is-invalid' : ''}`}
                            value={formData.hasCar}
                            onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        {validationErrors.hasCar && (
                            <div className="error-message">
                              <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.hasCar}
                            </div>
                        )}

                        {formData.hasCar === "true" && (
                            <div className="price-slider-container">
                              <label htmlFor="carPrice">
                                <FontAwesomeIcon icon={faDollarSign} className="price-icon" />
                                Car Price per Hour: <span className="price-value">${formData.carPrice}</span>
                              </label>
                              <Slider
                                  value={formData.carPrice}
                                  onChange={(value) => setFormData(prev => ({ ...prev, carPrice: value }))}
                                  min={0}
                                  max={50}
                                  step={1}
                                  className="custom-slider"
                              />
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="hasScooter">
                          <FontAwesomeIcon icon={faMotorcycle} className="icon" />
                          Will you have a scooter? <span className="required-star">*</span>
                        </label>
                        <select
                            name="hasScooter"
                            className={`form-control ${validationErrors.hasScooter ? 'is-invalid' : ''}`}
                            value={formData.hasScooter}
                            onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        {validationErrors.hasScooter && (
                            <div className="error-message">
                              <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.hasScooter}
                            </div>
                        )}

                        {formData.hasScooter === "true" && (
                            <div className="price-slider-container">
                              <label htmlFor="scooterPrice">
                                <FontAwesomeIcon icon={faDollarSign} className="price-icon" />
                                Scooter Price per Hour: <span className="price-value">${formData.scooterPrice}</span>
                              </label>
                              <Slider
                                  value={formData.scooterPrice}
                                  onChange={(value) => setFormData(prev => ({ ...prev, scooterPrice: value }))}
                                  min={0}
                                  max={50}
                                  step={1}
                                  className="custom-slider"
                              />
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="availabilityTimes">
                      <FontAwesomeIcon icon={faClock} className="icon" />
                      Available Dates <span className="required-star">*</span>
                    </label>
                    <div className={`date-picker-container ${validationErrors.availabilityTimes ? 'is-invalid' : ''}`}>
                      <DatePicker
                          selected={selectedDates[0]}
                          onChange={(dates) => {
                            if (Array.isArray(dates)) {
                              setSelectedDates(dates);
                              setFormData(prev => ({ ...prev, availabilityTimes: dates }));
                              setValidationErrors(prev => ({ ...prev, availabilityTimes: "" }));
                            } else {
                              setSelectedDates([dates]);
                              setFormData(prev => ({ ...prev, availabilityTimes: [dates] }));
                              setValidationErrors(prev => ({ ...prev, availabilityTimes: "" }));
                            }
                          }}
                          onSelect={(date) => {
                            setSelectedDates([...selectedDates, date]);
                            setValidationErrors(prev => ({ ...prev, availabilityTimes: "" }));
                          }}
                          shouldCloseOnSelect={false}
                          inline
                          selectsRange
                          startDate={selectedDates[0]}
                          endDate={selectedDates[selectedDates.length - 1]}
                          className="custom-datepicker"
                      />
                    </div>
                    {validationErrors.availabilityTimes && (
                        <div className="error-message">
                          <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.availabilityTimes}
                        </div>
                    )}
                    {selectedDates.length > 0 && (
                        <div className="selected-dates">
                          <p>Selected dates:</p>
                          <div className="date-tags">
                            {selectedDates.map((date, idx) => (
                                date && <span key={idx} className="date-tag">
                          {date.toLocaleDateString()}
                        </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="button-group">
                    <button className="btn back-btn" onClick={prevStep}>
                      Back
                    </button>
                    <button className="btn next-btn" onClick={nextStep}>
                      Next <FontAwesomeIcon icon={faCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
            )}

            {step === 4 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="shortDesc">
                      <FontAwesomeIcon icon={faInfoCircle} className="icon" />
                      Short Description about yourself <span className="required-star">*</span>
                    </label>
                    <textarea
                        name="shortDesc"
                        className={`form-control ${validationErrors.shortDesc ? 'is-invalid' : ''}`}
                        value={formData.shortDesc}
                        placeholder="Share a bit about yourself, your expertise, and why travelers should choose you as their ambassadors..."
                        rows="4"
                        onChange={handleChange}
                    ></textarea>
                    {validationErrors.shortDesc && (
                        <div className="error-message">
                          <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.shortDesc}
                        </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price" className="price-main-label">
                      <FontAwesomeIcon icon={faDollarSign} className="price-main-icon" />
                      Service Price per Hour: <span className="price-main-value">${formData.price}</span>
                    </label>
                    <div className={`price-slider-container main-price ${validationErrors.price ? 'is-invalid' : ''}`}>
                      <Slider
                          value={formData.price}
                          onChange={(value) => {
                            setFormData(prev => ({ ...prev, price: value }));
                            setValidationErrors(prev => ({ ...prev, price: "" }));
                          }}
                          min={0}
                          max={50}
                          step={1}
                          className="custom-slider main-price-slider"
                      />
                    </div>
                    {validationErrors.price && (
                        <div className="error-message">
                          <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.price}
                        </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="addFeature">
                      <FontAwesomeIcon icon={faStarOfLife} className="icon" /> Add Features
                    </label>
                    <form className="feature-form" onSubmit={handleFeature}>
                      <div className="input-with-button">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Local cuisine knowledge, Photography spots, etc."
                        />
                        <button type="submit" className="btn feature-btn">
                          Add
                        </button>
                      </div>
                    </form>

                    {formData.features.length > 0 && (
                        <div className="features-container">
                          {formData.features.map((feature, index) => (
                              <span className="feature-tag" key={index}>
                        {feature}
                                <button
                                    type="button"
                                    className="remove-feature"
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      features: prev.features.filter((_, i) => i !== index)
                                    }))}
                                >
                          ×
                        </button>
                      </span>
                          ))}
                        </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pointsOfInterest">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="icon" /> Points of Interest
                    </label>
                    <div className="poi-grid">
                      {pointsOfInterestOptions.map((poi) => (
                          <div
                              key={poi.name}
                              className={`poi-item ${selectedPointsOfInterest.includes(poi.name) ? 'active' : ''}`}
                              onClick={() => handlePoiChange(poi.name)}
                          >
                            <div className="poi-checkbox">
                              <input
                                  type="checkbox"
                                  checked={selectedPointsOfInterest.includes(poi.name)}
                                  onChange={() => {}}
                                  id={`poi-${poi.name}`}
                              />
                              <label htmlFor={`poi-${poi.name}`} className="checkbox-label"></label>
                            </div>
                            <div className="poi-content">
                              <img src={poi.icon} alt={poi.name} className="poi-icon" />
                              <span className="poi-name">{poi.name}</span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn back-btn" onClick={prevStep}>
                      Back
                    </button>
                    <button className="btn submit-btn" onClick={handleSubmit}>
                      Create Gig <FontAwesomeIcon icon={faCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Add;

// POI options
const pointsOfInterestOptions = [
  { name: "Business", icon: "./img/icons8-b2b-50.png" },
  { name: "Administration", icon: "./img/icons8-administration.png" },
  { name: "Museum", icon: "https://img.icons8.com/ios/50/000000/museum.png" },
  { name: "Beach", icon: "https://img.icons8.com/ios/50/000000/beach.png" },
  { name: "Night Club", icon: "https://img.icons8.com/?size=100&id=60357&format=png&color=000000" },
  { name: "Park", icon: "https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000" },
  { name: "Shopping Mall", icon: "https://img.icons8.com/ios/50/000000/shopping-mall.png" },
  { name: "Theatre", icon: "https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000" },
  { name: "Amusement Park", icon: "https://img.icons8.com/?size=100&id=25053&format=png&color=000000" },
  { name: "Restaurant", icon: "https://img.icons8.com/ios/50/000000/restaurant.png" },
  { name: "Hiking", icon: "https://img.icons8.com/?size=100&id=9844&format=png&color=000000" },
];