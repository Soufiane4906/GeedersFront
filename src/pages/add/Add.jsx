import React, { useState } from "react";
import "./Add.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMotorcycle, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Add = () => {
  const navigate = useNavigate();
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
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
    <div className="add">
      <div className="container">
        <h1>Add New Post</h1>
        {error && <div className="error">{error}</div>}
        <div className="sections">
          <div className="info">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              required
            />
            <label htmlFor="desc">Description</label>
            <textarea
              name="desc"
              id="desc"
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="country">Country</label>
            <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
            <label htmlFor="city">City</label>
            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            <label htmlFor="hasCar">Do you have a car?</label>
            <select name="hasCar" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {formData.hasCar === "true" && (
              <div className="priceField">
                <FontAwesomeIcon icon={faCar} />
                <label htmlFor="carPrice">Car Price per Hour</label>
                <input
                  type="number"
                  name="carPrice"
                  placeholder="Price per hour"
                  onChange={handleChange}
                  required={formData.hasCar === "true"}
                />
              </div>
            )}
            <label htmlFor="hasScooter">Do you have a scooter?</label>
            <select name="hasScooter" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {formData.hasScooter === "true" && (
              <div className="priceField">
                <FontAwesomeIcon icon={faMotorcycle} />
                <label htmlFor="scooterPrice">Scooter Price per Hour</label>
                <input
                  type="number"
                  name="scooterPrice"
                  placeholder="Price per hour"
                  onChange={handleChange}
                  required={formData.hasScooter === "true"}
                />
              </div>
            )}
            <label htmlFor="availabilityTimes">Available Times</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                handleChange({ target: { name: "availabilityTimes", value: date } });
              }}
              showTimeSelect
              dateFormat="Pp"
              required
            />
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="shortDesc">Short Description</label>
            <textarea
              name="shortDesc"
              id="shortDesc"
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="price">Price</label>
            <input type="number" name="price" onChange={handleChange} required />
            <label htmlFor="addFeature">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>
            <div className="addedFeatures">
              {formData.features.map((feature, index) => (
                <div className="item" key={index}>
                  <button
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        features: prevData.features.filter((f) => f !== feature),
                      }))
                    }
                  >
                    {feature}
                    <span>X</span>
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
