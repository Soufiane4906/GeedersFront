import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Liste des 30 villes les plus visitées et leurs pays associés
const topVisitedCities = [
  { city: "Bangkok", country: "Thailand" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Paris", country: "France" },
  { city: "London", country: "United Kingdom" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Singapore", country: "Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "New York", country: "United States" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Tokyo", country: "Japan" },
  { city: "Antalya", country: "Turkey" },
  { city: "Seoul", country: "South Korea" },
  { city: "Osaka", country: "Japan" },
  { city: "Makkah", country: "Saudi Arabia" },
  { city: "Pattaya", country: "Thailand" },
  { city: "Milan", country: "Italy" },
  { city: "Barcelona", country: "Spain" },
  { city: "Bali", country: "Indonesia" },
  { city: "Hong Kong", country: "Hong Kong" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Vienna", country: "Austria" },
  { city: "Taipei", country: "Taiwan" },
  { city: "Rome", country: "Italy" },
  { city: "Shanghai", country: "China" },
  { city: "Las Vegas", country: "United States" },
  { city: "Los Angeles", country: "United States" },
  { city: "Madrid", country: "Spain" },
  { city: "Guangzhou", country: "China" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Miami", country: "United States" },
  { city: "Berlin", country: "Germany" }
];

// Extraire les pays uniques
const countries = [...new Set(topVisitedCities.map(item => item.country))];

const HeroSection = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  // Gestion du changement de pays
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");

    // Filtrer les villes correspondant au pays sélectionné
    const filteredCities = topVisitedCities
        .filter(item => item.country === selectedCountry)
        .map(item => item.city);

    setCities(filteredCities);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = () => {
    if (!country || !city) {
      alert("Please select a country and city.");
      return;
    }

    navigate(`/gigs?country=${country}&city=${city}`);
  };

  return (
      <section className="hero-layout" style={{ backgroundImage: "url('../assets/img/banner/banner-bg-1.png')" }}>
        <div className="hero-mask">
          <div className="hero-bottom">
            <div className="container">
              <form className="hero-form">
                <div className="row">

                  {/* Sélection du pays */}
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

                  {/* Sélection de la ville */}
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

                  {/* Sélection de la plage de dates */}
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

                  {/* Bouton de recherche */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <button type="button" className="vs-btn style4" onClick={handleSubmit}>
                      Find Now
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
