import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import Loading from "../../components/loading/Loading";
import InteractiveMap from "../../components/InteractiveMap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faCalendarAlt,
  faLanguage,
  faMapMarkerAlt,
  faFilter,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { topVisitedCities, availableLanguages, pointsOfInterest } from "../../utils/options.js";

const formatDate = (dateString) => {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, 'dd/MM/yyyy ');
};

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Get all filter parameters from URL
  const country = queryParams.get('country') || "";
  const city = queryParams.get('city') || "";

  // Get cities for the selected country
  const [cities, setCities] = useState([]);

  // Date range parameters
  const startDateParam = queryParams.get('startDate');
  const endDateParam = queryParams.get('endDate');
  const [dateRange, setDateRange] = useState([
    startDateParam ? new Date(startDateParam) : null,
    endDateParam ? new Date(endDateParam) : null
  ]);
  const [startDate, endDate] = dateRange;

  // Language parameters
  const languagesParam = queryParams.get('languages') || "";
  const [selectedLanguages, setSelectedLanguages] = useState(
      languagesParam ? languagesParam.split(',') : []
  );
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // POI parameters
  const poiParam = queryParams.get('poi') || "";
  const [selectedPOIs, setSelectedPOIs] = useState(
      poiParam ? poiParam.split(',') : []
  );
  const [showPOIDropdown, setShowPOIDropdown] = useState(false);
  const [availablePOIs, setAvailablePOIs] = useState([]);

  // Get all unique countries from topVisitedCities
  const countries = [...new Set(topVisitedCities.map(item => item.country))].sort();

  // Update cities list when country changes
  useEffect(() => {
    if (country) {
      const filteredCities = topVisitedCities
          .filter(item => item.country === country)
          .map(item => item.city)
          .sort();

      setCities(filteredCities);
    } else {
      setCities([]);
    }
  }, [country]);

  // Update POI list when country and city are selected
  useEffect(() => {
    if (country && city) {
      const filteredPOIs = pointsOfInterest
          .filter(poi => poi.country === country && poi.city === city)
          .map(poi => ({
            id: poi.id,
            name: poi.name
          }));

      setAvailablePOIs(filteredPOIs);
    } else {
      setAvailablePOIs([]);
    }
  }, [country, city]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, country, city, startDateParam, endDateParam, languagesParam, poiParam],
    queryFn: () => {
      let queryString = `/gigs?country=${country}&city=${city}&sort=${sort}`;

      if (startDate && endDate) {
        queryString += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      if (selectedLanguages.length > 0) {
        queryString += `&languages=${selectedLanguages.join(',')}`;
      }

      if (selectedPOIs.length > 0) {
        queryString += `&poi=${selectedPOIs.join(',')}`;
      }

      return newRequest.get(queryString).then((res) => res.data);
    },
  });

  const locations = data ? data.map(gig => ({
    _id: gig._id,
    title: gig.title,
    latitude: gig.latitude,
    longitude: gig.longitude,
    description: gig.desc,
  })) : [];

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

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

  // Handle country change
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const params = new URLSearchParams(search);
    params.set('country', selectedCountry);
    params.delete('city');
    params.delete('poi');
    setSelectedPOIs([]);
    window.history.pushState({}, '', `?${params.toString()}`);
    window.location.search = params.toString();
  };

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    const params = new URLSearchParams(search);
    params.set('city', selectedCity);
    params.delete('poi');
    setSelectedPOIs([]);
    window.history.pushState({}, '', `?${params.toString()}`);
    window.location.search = params.toString();
  };

  // Apply all filters
  const applyFilters = () => {
    const params = new URLSearchParams(search);

    // Update all filter parameters
    if (country) params.set('country', country);
    else params.delete('country');

    if (city) params.set('city', city);
    else params.delete('city');

    if (startDate && endDate) {
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }

    if (selectedLanguages.length > 0) {
      params.set('languages', selectedLanguages.join(','));
    } else {
      params.delete('languages');
    }

    if (selectedPOIs.length > 0) {
      params.set('poi', selectedPOIs.join(','));
    } else {
      params.delete('poi');
    }

    window.history.pushState({}, '', `?${params.toString()}`);
    window.location.search = params.toString();
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = "No matching Ambassadors found in these areas.";

  return (
      <div className="gigs">
        <div className="container">
          <span className="breadcrumbs">Search Results</span>
          <h1>Available Ambassadors</h1>

          <div className="filter-toggle" onClick={() => setFilterOpen(!filterOpen)}>
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </div>

          {filterOpen && (
              <div className="filters">
                <div className="filter-row">
                  {/* Country Selection */}
                  <div className="filter-item">
                    <label>
                      <FontAwesomeIcon icon={faGlobe} className="me-2" />
                      Country
                    </label>
                    <select
                        value={country}
                        onChange={handleCountryChange}
                        className="form-select"
                    >
                      <option value="">Select Country</option>
                      {countries.map((countryName) => (
                          <option key={countryName} value={countryName}>
                            {countryName}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* City Selection */}
                  <div className="filter-item">
                    <label>
                      <FontAwesomeIcon icon={faCity} className="me-2" />
                      City
                    </label>
                    <select
                        value={city}
                        onChange={handleCityChange}
                        disabled={!country}
                        className="form-select"
                    >
                      <option value="">Select City</option>
                      {cities.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Selection */}
                  <div className="filter-item">
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

                <div className="filter-row">
                  {/* Points of Interest Dropdown */}
                  <div className="filter-item">
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Points of Interest
                    </label>
                    <div className="position-relative">
                      <button
                          type="button"
                          className="form-control text-start d-flex justify-content-between align-items-center"
                          onClick={() => setShowPOIDropdown(!showPOIDropdown)}
                          disabled={!city || availablePOIs.length === 0}
                      >
                    <span>
                      {selectedPOIs.length === 0
                          ? "Select points of interest"
                          : `${selectedPOIs.length} POI(s) selected`}
                    </span>
                        <span className="dropdown-toggle"></span>
                      </button>

                      {showPOIDropdown && availablePOIs.length > 0 && (
                          <div className="dropdown-menu show">
                            {availablePOIs.map((poi) => (
                                <div
                                    key={poi.id}
                                    className="dropdown-item"
                                    onClick={() => togglePOI(poi.id)}
                                >
                                  <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedPOIs.includes(poi.id)}
                                        onChange={() => {}}
                                        id={`poi-${poi.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`poi-${poi.id}`}>
                                      {poi.name}
                                    </label>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>

                    {/* Display selected POIs */}
                    {selectedPOIs.length > 0 && (
                        <div className="selected-items">
                          {selectedPOIs.map(poiId => {
                            const poi = availablePOIs.find(p => p.id === poiId);
                            return poi ? (
                                <span key={poiId} className="selected-badge">
                          {poi.name}
                                  <button
                                      type="button"
                                      className="badge-close"
                                      onClick={() => togglePOI(poiId)}
                                  >×</button>
                        </span>
                            ) : null;
                          })}
                        </div>
                    )}
                  </div>

                  {/* Language Selection Dropdown */}
                  <div className="filter-item">
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
                          <div className="dropdown-menu show">
                            {availableLanguages.map((lang) => (
                                <div
                                    key={lang.code}
                                    className="dropdown-item"
                                    onClick={() => toggleLanguage(lang.code)}
                                >
                                  <div className="form-check">
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

                    {/* Display selected languages */}
                    {selectedLanguages.length > 0 && (
                        <div className="selected-items">
                          {selectedLanguages.map(code => {
                            const lang = availableLanguages.find(l => l.code === code);
                            return lang ? (
                                <span key={code} className="selected-badge lang-badge">
                          {lang.name}
                                  <button
                                      type="button"
                                      className="badge-close"
                                      onClick={() => toggleLanguage(code)}
                                  >×</button>
                        </span>
                            ) : null;
                          })}
                        </div>
                    )}
                  </div>
                </div>

                <div className="filter-actions">
                  <button type="button" className="apply-btn" onClick={applyFilters}>
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
          )}

          <div className="menu">
            <div className="right">
              <span className="sortBy">Sort by</span>
              <span className="sortType">
              {sort === "sales" ? "Best Ambassador" : sort === "popularity" ? "Popular" : "Newest"}
            </span>
              <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
              {open && (
                  <div className="rightMenu">
                    <span onClick={() => reSort("createdAt")}>Newest</span>
                    <span onClick={() => reSort("sales")}>Best</span>
                    <span onClick={() => reSort("popularity")}>Popular</span>
                  </div>
              )}
            </div>
          </div>

          <div className="cards">
            {isLoading ? (
                "Loading..."
            ) : error ? (
                <div>
                  <p>Something went wrong!</p>
                  <p>Error: {error.message}</p>
                  <p>URL: {error.config.url}</p>
                </div>
            ) : data && data.length > 0 ? (
                data.map((gig) => <GigCard key={gig._id} item={gig} />)
            ) : (
                <p>{noResultsMessage}</p>
            )}
          </div>
          {data && data.length > 0 && <InteractiveMap locations={locations} />}
        </div>
      </div>
  );
}

export default Gigs;