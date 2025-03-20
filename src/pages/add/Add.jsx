import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import LocationMap from "./../../components/LocationMap";
import "./Add.scss";
import { ToastContainer, toast } from "react-toastify";
 import 'bootstrap/dist/css/bootstrap.min.css';
import { topVisitedCities } from "../../utils/options.js"; // Import predefined cities

import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
//newrequest
import axios from "axios";
import newRequest from "../../utils/newRequest";

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
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [selectedPointsOfInterest, setSelectedPointsOfInterest] = useState([]);
  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountry,
      city: "",
    }));
    setShowCity(true);

    // Get cities that match the selected country from `topVisitedCities`
    const filteredCities = topVisitedCities
        .filter((item) => item.country === selectedCountry)
        .map((item) => item.city)
        .sort();

    setCities(filteredCities); // Use predefined cities
  };

  const handleCityChange = (e) => {
    setFormData((prevData) => ({ ...prevData, city: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const gigData = {
        ...formData,
        userId: currentUser._id,
        availabilityTimes: selectedDates,
      };
      await newRequest.post("/gigs", gigData);
      toast.success("Gig created successfully!");
      navigate("/myGigs");
    } catch (error) {
      toast.error("Error creating gig: " + error.message);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="add container">
      <h1 style={{textAlign : 'center'}} >Add New Post</h1>
      <ToastContainer />
      {error && <div className="alert alert-danger">{error}</div>}
      <ProgressBar percent={(step - 1) * 33}>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : ""}`}
            >
              1
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : ""}`}
            >
              2
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : ""}`}
            >
              3
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : ""}`}
            >
              4
            </div>
          )}
        </Step>
      </ProgressBar>
      {step === 1 && (
        <div>
          <div className="form-group">
            <label htmlFor="title">
              <FontAwesomeIcon
                icon={faTachometerAlt}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Title
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="e.g. I will guide you ..."
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="desc">
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Description
            </label>
            <textarea
              name="desc"
              className="form-control"
              placeholder="Describe your service in detail"
              rows="5"
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button className="btn btn-primary"  style={{float :'right'}}  onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 2 && (
          <div>
            {/* Country Selection */}
            <div className="form-group">
              <label htmlFor="country">
                <FontAwesomeIcon icon={faGlobe} style={{ marginRight: "2%" }} /> Country
              </label>
              <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  style={{ width: "100%" }}
                  className="form-control"
              >
                <option value="">Select Country</option>
                {[...new Set(topVisitedCities.map((city) => city.country))].map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                ))}
              </select>
            </div>

            {/* City Selection (Only Cities from Hero.jsx) */}
            <div className="form-group">
              <label htmlFor="city">
                <FontAwesomeIcon icon={faCity} style={{ marginRight: "2%" }} /> City
              </label>
              <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  style={{ width: "100%" }}
                  disabled={!showCity}
                  className="form-control"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                ))}
              </select>
            </div>

            {/* Remove Location Selection */}
            {/* <div className="form-group">
              <label htmlFor="location">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginInlineEnd: "2%" }} /> Select Location
              </label>
              <LocationMap setFormData={setFormData} formData={formData} />
          </div> */}

            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
            <button className="btn btn-primary" style={{ float: "right" }} onClick={() => setStep(step + 1)}>
              Next
            </button>
          </div>
      )}
      {step === 3 && (
        <div>
          <div className="form-group">
            <label htmlFor="hasCar">
              <FontAwesomeIcon icon={faCar} style={{ marginInlineEnd: "2%" }} />{" "}
              Will you have a car?
            </label>
            <select
              name="hasCar"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {formData.hasCar === "true" && (
              <div className="priceField mt-2">
                <label htmlFor="carPrice">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ color: "green", marginInlineEnd: "2%" }}
                  />{" "}
                  Car Price per Hour
                </label>
                <Slider
                  value={formData.carPrice}
                  onChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      carPrice: value,
                    }))
                  }
                  min={0}
                  max={50}
                  step={1}
                  renderTrack={(props) => (
                    <div {...props} className="slider-track" />
                  )}
                  renderThumb={(props, state) => (
                    <div {...props} className="slider-thumb">
                      {state.valueNow}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="hasScooter">
              <FontAwesomeIcon
                icon={faMotorcycle}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Will you have a scooter?
            </label>
            <select
              name="hasScooter"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {formData.hasScooter === "true" && (
              <div className="priceField mt-2">
                <label htmlFor="scooterPrice">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ color: "green", marginInlineEnd: "2%" }}
                  />{" "}
                  Scooter Price per Hour
                </label>
                <Slider
                  value={formData.scooterPrice}
                  onChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      scooterPrice: value,
                    }))
                  }
                  min={0}
                  max={50}
                  step={1}
                  renderTrack={(props) => (
                    <div {...props} className="slider-track" />
                  )}
                  renderThumb={(props, state) => (
                    <div {...props} className="slider-thumb">
                      {state.valueNow}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="availabilityTimes">
              <FontAwesomeIcon
                icon={faClock}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Available Times
            </label>
            <DatePicker
              selected={selectedDates[0]} // Display the first selected date
              onChange={(dates) => {
                if (Array.isArray(dates)) {
                  setSelectedDates(dates);
                  handleChange({
                    target: { name: "availabilityTimes", value: dates },
                  });
                } else {
                  setSelectedDates([dates]);
                  handleChange({
                    target: { name: "availabilityTimes", value: [dates] },
                  });
                }
              }}
              onSelect={(date) => setSelectedDates([...selectedDates, date])}
              shouldCloseOnSelect={false} // Keep the picker open for multiple selections
              inline // Display the calendar inline
              selectsRange // Allow range selection
              startDate={selectedDates[0]} // Start date for range
              endDate={selectedDates[selectedDates.length - 1]} // End date for range
              className="form-control"
              required
            />
          </div>
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button className="btn btn-primary"  style={{float :'right'}}  onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 4 && (
        <div>
          <div className="form-group">
            <label htmlFor="shortDesc">
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Short Description about yourself
            </label>
            <textarea
              name="shortDesc"
              className="form-control"
              placeholder="Short description of your service"
              rows="6"
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price" style={{ color: "green" }}>
              <FontAwesomeIcon
                icon={faDollarSign}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Price / hour
            </label>
            <Slider
              value={formData.price}
              onChange={(value) =>
                setFormData((prevData) => ({ ...prevData, price: value }))
              }
              min={0}
              max={50}
              step={1}
              renderTrack={(props) => (
                <div {...props} className="slider-track" />
              )}
              renderThumb={(props, state) => (
                <div {...props} className="slider-thumb">
                  {state.valueNow}
                </div>
              )}
            />
          </div>
          <div className="form-group" >
            <label htmlFor="addFeature">
              <FontAwesomeIcon icon={faStarOfLife} /> Add Features
            </label>
            <form className="addFeatureForm" onSubmit={handleFeature}>
              <input type="text" className="form-control" placeholder=" " />
              <button type="submit" className="btn btn-primary mt-2">
                Add
              </button>
            </form>
            <div className="addedFeatures mt-2">
              {formData.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        features: prevData.features.filter(
                          (f) => f !== feature
                        ),
                      }))
                    }
                  >
                    {feature} <span className="remove-icon">x</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pointsOfInterest">
              <FontAwesomeIcon
                icon={faMapMarkedAlt}
                style={{ marginInlineEnd: "2%" }}
              />{" "}
              Points of Interest
            </label>
            <div className="points-of-interest">
              {pointsOfInterestOptions.map((poi) => (
                <label
                  key={poi.name}
                  className={`poi-container ${
                    selectedPointsOfInterest.includes(poi.name) ? "active" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={poi.name}
                    checked={selectedPointsOfInterest.includes(poi.name)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedPointsOfInterest((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((poi) => poi !== value)
                      );
                    }}
                  />
                  <img
                    src={poi.icon}
                    alt={poi.name}
                    style={{ width: 30, height: 30, marginRight: 10 }}
                  />
                  {poi.name}
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button className="btn btn-success" style={{float :'right'}} onClick={handleSubmit}>
            Create
          </button>
        </div>
      )}
    </div>
  );
};

export default Add;
const CustomOption = (props) => (
  <div
    {...props.innerProps}
    style={{ display: "flex", alignItems: "center", padding: "10px" }}
  >
    <img
      src={props.data.icon}
      alt={props.data.name}
      style={{ width: 20, height: 20, marginRight: 10 }}
    />
    {props.data.label}
  </div>
);
const pointsOfInterestOptions = [
  { name: "Business", icon: "./img/icons8-b2b-50.png" },
  { name: "Administration", icon: "./img/icons8-administration.png" },
  { name: "Museum", icon: "https://img.icons8.com/ios/50/000000/museum.png" },
  { name: "Beach", icon: "https://img.icons8.com/ios/50/000000/beach.png" },
  {
    name: "Night Club",
    icon: "https://img.icons8.com/?size=100&id=60357&format=png&color=000000",
  },
  {
    name: "Park",
    icon: "https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000",
  },
  {
    name: "Shopping Mall",
    icon: "https://img.icons8.com/ios/50/000000/shopping-mall.png",
  },
  {
    name: "Theatre",
    icon: "https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000",
  },
  {
    name: "Amusement Park",
    icon: "https://img.icons8.com/?size=100&id=25053&format=png&color=000000",
  },
  {
    name: "Restaurant",
    icon: "https://img.icons8.com/ios/50/000000/restaurant.png",
  },
  {
    name: "Hiking",
    icon: "https://img.icons8.com/?size=100&id=9844&format=png&color=000000",
  },
];
