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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import newRequest from "../../utils/newRequest";
import "./EditGig.scss";
import WysiwygEditor from "../../components/WysiwygEditor.jsx";
import PointsOfInterestSection from "../../components/PointsOfInterestSection/PointsOfInterestSection.jsx";

function EditGig() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialGigData = location.state?.gigData;

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
    availabilityTimes: [],
    shortDesc: "",
    price: 0,
    features: [],
    poi: [],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [selectedPointsOfInterest, setSelectedPointsOfInterest] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load gig data
  const { isLoading: isLoadingGig } = useQuery({
    queryKey: ["gigDetails", id],
    queryFn: async () => {
      if (initialGigData) return initialGigData;
      const res = await newRequest.get(`/gigs/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setFormData({
        ...data,
        hasCar: data.hasCar.toString(),
        hasScooter: data.hasScooter.toString()
      });

      if (data.availabilityTimes && data.availabilityTimes.length > 0) {
        // Convert string dates to Date objects
        const dates = data.availabilityTimes.map(date =>
            typeof date === 'string' ? new Date(date) : date
        );
        setSelectedDates(dates);
      }

      if (data.poi && data.poi.length > 0) {
        setSelectedPointsOfInterest(data.poi);
      }
    },
    enabled: !!id
  });

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await newRequest.get("/countries");
        setCountries(response.data || []);

        // If we have a country in formData, fetch cities for that country
        if (formData.country) {
          const country = response.data.find(c => c.name === formData.country);
          if (country) {
            setShowCity(true);
            fetchCitiesForCountry(country._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
        toast.error("Failed to load countries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [formData.country]);

  // Fetch POIs when city is selected
  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const response = await newRequest.get("/pois");
        setPointsOfInterest(response.data.pois || []);
      } catch (error) {
        console.error("Failed to fetch POIs", error);
      }
    };

    if (formData.city) {
      fetchPOIs();
    }
  }, [formData.city]);

  // Fetch cities for a country
  const fetchCitiesForCountry = async (countryId) => {
    if (!countryId) return;

    try {
      setIsLoading(true);
      const response = await newRequest.get(`/cities?countryId=${countryId}`);
      setCities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch cities", error);
      toast.error("Failed to load cities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;

    // Find the selected country in the list of countries
    const selectedCountry = countries.find(country => country._id === selectedCountryId);

    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountry ? selectedCountry.name : "",
      countryId: selectedCountryId,
      city: "",
    }));

    setShowCity(true);
    fetchCitiesForCountry(selectedCountryId);

    // Clear country validation error if country is selected
    if (selectedCountryId) {
      setValidationErrors(prev => ({ ...prev, country: "" }));
    }
  };

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;

    // Find the selected city in the list of cities
    const selectedCity = cities.find(city => city._id === selectedCityId);

    setFormData((prevData) => ({
      ...prevData,
      city: selectedCity ? selectedCity.name : "",
      cityId: selectedCityId
    }));

    // Clear city validation error if city is selected
    if (selectedCityId) {
      setValidationErrors(prev => ({ ...prev, city: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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

  // Mutation for updating the gig
  const mutation = useMutation({
    mutationFn: (updatedGigData) => {
      return newRequest.put(`/gigs/${id}`, updatedGigData);
    },
    onSuccess: () => {
      toast.success("Gig updated successfully!");
      navigate("/myGigs");
    },
    onError: (error) => {
      toast.error("Error updating gig: " + (error.response?.data?.message || error.message));
      console.error("Full error details:", error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Create a new object without countryId and cityId
      const { countryId, cityId, ...gigDataWithoutIds } = formData;

      const updatedGigData = {
        ...gigDataWithoutIds,
        availabilityTimes: selectedDates,
        poi: selectedPointsOfInterest
      };

      mutation.mutate(updatedGigData);
    } catch (error) {
      toast.error("Error preparing data: " + error.message);
      console.error("Full error details:", error);
    }
  };

  if (isLoadingGig) {
    return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading gig details...</p>
        </div>
    );
  }

  return (
      <div className="add-gig-container">
        <div className="add-gig-wrapper">
          <div className="section-title">
            <h2>Edit Your Availability</h2>
            <p>Update your service offering for travelers</p>
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
                        {isLoading ? (
                            <div className="loading-indicator">Loading countries...</div>
                        ) : (
                            <select
                                name="country"
                                value={formData.countryId || ""}
                                onChange={handleCountryChange}
                                className={`form-control ${validationErrors.country ? 'is-invalid' : ''}`}
                            >
                              <option value="">Select Country</option>
                              {countries.map((country) => (
                                  <option key={country._id} value={country._id}>
                                    {country.name}
                                  </option>
                              ))}
                            </select>
                        )}
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
                        {isLoading ? (
                            <div className="loading-indicator">Loading cities...</div>
                        ) : (
                            <select
                                name="city"
                                value={formData.cityId || ""}
                                onChange={handleCityChange}
                                disabled={!showCity || cities.length === 0}
                                className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                            >
                              <option value="">Select City</option>
                              {cities.map((city) => (
                                  <option key={city._id} value={city._id}>
                                    {city.name}
                                  </option>
                              ))}
                            </select>
                        )}
                        {validationErrors.city && (
                            <div className="error-message">
                              <FontAwesomeIcon icon={faExclamationTriangle} /> {validationErrors.city}
                            </div>
                        )}
                        {showCity && cities.length === 0 && !isLoading && (
                            <div className="info-message">
                              No cities available for this country
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
                          showMonthYearDropdown
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
                    <PointsOfInterestSection
                        selectedPOIs={selectedPointsOfInterest}
                        setSelectedPOIs={setSelectedPointsOfInterest}
                        city={formData.city}
                        pointsOfInterest={pointsOfInterest}
                        disabled={!formData.city}
                    />
                  </div>

                  <div className="button-group">
                    <button className="btn back-btn" onClick={prevStep}>
                      Back
                    </button>
                    <button
                        className="btn submit-btn"
                        onClick={handleSubmit}
                        disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Updating..." : "Save Changes"} <FontAwesomeIcon icon={faCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default EditGig;