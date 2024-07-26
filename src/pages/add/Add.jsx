import React, { useState } from "react";
import "./Add.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faMapMarkerAlt, faCity, faCar, faMotorcycle, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Add = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    country: "",
    city: "",
    hasCar: "",
    carPrice: "",
    hasScooter: "",
    scooterPrice: "",
    availabilityTimes: selectedDate,
    shortDesc: "",
    price: "",
    features: [],
  });
  const [error, setError] = useState("");

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
      const gigData = { ...formData, userId: currentUser._id, availabilityTimes: selectedDate };
      await newRequest.post("/gigs", gigData);
      navigate("/myGigs");
    } catch (error) {
      setError("Error creating gig: " + error.message);
    }
  };

  return (
    <div className="add container">
      <h1>Add New Post</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="title">
              <FontAwesomeIcon icon={faTachometerAlt} /> Title
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="e.g. I will guide you"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Country
            </label>
            <input
              type="text"
              className="form-control"
              name="country"
              placeholder="Country"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">
              <FontAwesomeIcon icon={faCity} /> City
            </label>
            <input
              type="text"
              className="form-control"
              name="city"
              placeholder="City"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hasCar">
              <FontAwesomeIcon icon={faCar} /> Do you have a car?
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
                <FontAwesomeIcon icon={faCar} />
                <label htmlFor="carPrice">Car Price per Hour</label>
                <input
                  type="number"
                  className="form-control"
                  name="carPrice"
                  placeholder="Price per hour"
                  onChange={handleChange}
                  required={formData.hasCar === "true"}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="hasScooter">
              <FontAwesomeIcon icon={faMotorcycle} /> Do you have a scooter?
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
                <FontAwesomeIcon icon={faMotorcycle} />
                <label htmlFor="scooterPrice">Scooter Price per Hour</label>
                <input
                  type="number"
                  className="form-control"
                  name="scooterPrice"
                  placeholder="Price per hour"
                  onChange={handleChange}
                  required={formData.hasScooter === "true"}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="availabilityTimes">
              <FontAwesomeIcon icon={faDollarSign} /> Available Times
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                handleChange({ target: { name: "availabilityTimes", value: date } });
              }}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
              required
            />
          </div>
          <button className="btn btn-success mt-3" onClick={handleSubmit}>
            Create
          </button>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="shortDesc">
              <FontAwesomeIcon icon={faDollarSign} /> Short Description
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
            <label htmlFor="price">
              <FontAwesomeIcon icon={faDollarSign} /> Price
            </label>
            <input
              type="number"
              className="form-control"
              name="price"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addFeature">
              <FontAwesomeIcon icon={faDollarSign} /> Add Features
            </label>
            <form className="addFeatureForm" onSubmit={handleFeature}>
              <input type="text" className="form-control" placeholder="e.g. page design" />
              <button type="submit" className="btn btn-primary mt-2">Add</button>
            </form>
            <div className="addedFeatures mt-2">
              {formData.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        features: prevData.features.filter((f) => f !== feature),
                      }))
                    }
                  >
                    {feature} <span className="remove-icon">x</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
