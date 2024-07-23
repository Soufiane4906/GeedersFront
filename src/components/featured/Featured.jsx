import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Featured.scss";

function Featured() {
  const [input, setInput] = useState("");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showCity, setShowCity] = useState(false);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(false);
  const [hasScooter, setHasScooter] = useState(false);
  const [hasCar, setHasCar] = useState(false);
  const [pricePerHour, setPricePerHour] = useState("");
  const [countryImage, setCountryImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    setPointsOfInterest([]);
    setShowPointsOfInterest(false);

    try {
      const image = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${selectedCountry}&prop=pageimages&format=json&pithumbsize=200`
      );
      const page = Object.values(image.data.query.pages)[0];
      setCountryImage(page.thumbnail ? page.thumbnail.source : "");
    } catch (error) {
      console.error("Error fetching country image", error);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setShowPointsOfInterest(true);
  };

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}&country=${country}&city=${city}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Discover the perfect <span>guide</span> for your adventure
          </h1>
          <div className="select">
            <label>Country:</label>
            <select onChange={handleCountryChange}>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {countryImage && (
              <div className="country-image">
                <img src={countryImage} alt={country} />
              </div>
            )}
          </div>
          {showCity && (
            <div className="select">
              <label>City:</label>
              <select onChange={handleCityChange}>
                <option value="">Select City</option>
                {countries
                  .find((c) => c.name === country)
                  ?.cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {showPointsOfInterest && (
            <div className="select">
              <label>Points of Interest:</label>
              <input
                type="text"
                placeholder="Enter points of interest"
                onChange={(e) =>
                  setPointsOfInterest(e.target.value.split(","))
                }
              />
            </div>
          )}
          <div className="additional-fields">
            <label>
              <input
                type="checkbox"
                checked={hasScooter}
                onChange={(e) => setHasScooter(e.target.checked)}
              />
              Do you have a scooter?
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasCar}
                onChange={(e) => setHasCar(e.target.checked)}
              />
              Do you have a car?
            </label>
            <label>Price per hour:</label>
            <input
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit}>Search</button>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
