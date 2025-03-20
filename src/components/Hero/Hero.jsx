import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faCalendarAlt,
  faLanguage,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {topVisitedCities , availableLanguages} from "../../utils/options.js";
// Liste des villes les plus visitées et leurs pays associés

// Liste des langues disponibles

// Extraire les pays uniques
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
        .map(item => item.city)
        .sort();

    setCities(filteredCities);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const toggleLanguage = (languageCode) => {
    setSelectedLanguages(prevSelected => {
      if (prevSelected.includes(languageCode)) {
        return prevSelected.filter(code => code !== languageCode);
      } else {
        return [...prevSelected, languageCode];
      }
    });
  };

  const handleSubmit = () => {
    if (!country || !city) {
      alert("Please select a country and city.");
      return;
    }

    // Construction de l'URL avec les paramètres
    let url = `/gigs?country=${country}&city=${city}`;

    // Ajouter les dates si elles sont sélectionnées
    if (startDate && endDate) {
      url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }

    // Ajouter les langues si elles sont sélectionnées
    if (selectedLanguages.length > 0) {
      url += `&languages=${selectedLanguages.join(',')}`;
    }

    navigate(url);
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

                  {/* Nouvelle sélection des langues - Dropdown avec boutons */}
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
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
                          <span className="dropdown-toggle"></span>
                        </button>

                        {showLanguageDropdown && (
                            <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow" style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}>
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

                      {/* Affichage des langues sélectionnées */}
                      {selectedLanguages.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap">
                            {selectedLanguages.map(code => {
                              const lang = availableLanguages.find(l => l.code === code);
                              return (
                                  <span
                                      key={code}
                                      className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                                  >
                                {lang.name}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white ms-2"
                                        style={{ fontSize: "0.5rem" }}
                                        onClick={() => toggleLanguage(code)}
                                    ></button>
                              </span>
                              );
                            })}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton de recherche */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-3 text-center">
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