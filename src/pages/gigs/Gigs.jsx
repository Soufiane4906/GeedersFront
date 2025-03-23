import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import Loading from "../../components/loading/Loading";
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
  faSearch,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { availableLanguages } from "../../utils/options.js";



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

  // New POI options with icons - moved from PointsOfInterestSection
  const pointsOfInterestOptions = [
    { id: "business", name: "Business", icon: "./img/icons8-b2b-50.png" },
    { id: "administration", name: "Administration", icon: "./img/icons8-administration.png" },
    { id: "museum", name: "Museum", icon: "./img/icons8-museum.png" },
    { id: "beach", name: "Beach", icon: "./img/icons8-beach.png" },
    { id: "nightclub", name: "Night Club", icon: "./img/icons8-night-club.png" },
    { id: "park", name: "Park", icon: "./img/icons8-park.png" },
    { id: "shoppingmall", name: "Shopping Mall", icon: "./img/icons8-shopping-mall.png" },
    { id: "theatre", name: "Theatre", icon: "./img/icons8-theatre.png" },
    { id: "amusementpark", name: "Amusement Park", icon: "./img/icons8-amusement-park.png" },
    { id: "restaurant", name: "Restaurant", icon: "./img/icons8-restaurant.png" },
    { id: "hiking", name: "Hiking", icon: "./img/icons8-hiking.png" },
  ];

  // Get all unique countries from topVisitedCities - Replaced with direct API call
  const [countries, setCountries] = useState([]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await newRequest.get('/gigs/countries');
        const uniqueCountries = [...new Set(res.data.map(item => item))].sort();
        setCountries(uniqueCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Update cities list when country changes
  useEffect(() => {
    if (country) {
      const fetchCities = async () => {
        try {
          const res = await newRequest.get(`/gigs/cities?country=${country}`);
          setCities(res.data.sort());
        } catch (err) {
          console.error("Error fetching cities:", err);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [country]);

  // Close POI dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.poi-dropdown-container')) {
        setShowPOIDropdown(false);
      }
      if (!e.target.closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                  {/* Points of Interest Selection - Using structure from PointsOfInterestSection */}
                  <div className="filter-item poi-dropdown-container">
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Points of Interest
                    </label>
                    <div className="position-relative">
                      <button
                          type="button"
                          className="form-control text-start d-flex justify-content-between align-items-center"
                          onClick={() => setShowPOIDropdown(!showPOIDropdown)}
                          disabled={!city}
                      >
                    <span>
                      {selectedPOIs.length === 0
                          ? "Select points of interest"
                          : `${selectedPOIs.length} POI(s) selected`}
                    </span>
                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                      </button>

                      {showPOIDropdown && (
                          <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow poi-options-container">
                            {pointsOfInterestOptions.map((poi) => (
                                <div
                                    key={poi.id}
                                    className="d-flex align-items-center px-3 py-2 poi-option"
                                    onClick={() => togglePOI(poi.id)}
                                >
                                  <div className="form-check mb-0 d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedPOIs.includes(poi.id)}
                                        onChange={() => {}}
                                        id={`poi-${poi.id}`}
                                    />
                                    <div className="poi-icon-container mx-2">
                                      <img src={poi.icon} alt={poi.name} width="24" height="24" />
                                    </div>
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
                        <div className="mt-2 d-flex flex-wrap">
                          {selectedPOIs.map(poiId => {
                            const poi = pointsOfInterestOptions.find(p => p.id === poiId);
                            return poi ? (
                                <span
                                    key={poiId}
                                    className="badge bg-info me-1 mb-1 d-flex align-items-center poi-badge"
                                >
                          <img src={poi.icon} alt={poi.name} width="16" height="16" className="me-1" />
                                  {poi.name}
                                  <button
                                      type="button"
                                      className="btn-close btn-close-white ms-2"
                                      onClick={() => togglePOI(poiId)}
                                  ></button>
                        </span>
                            ) : null;
                          })}
                        </div>
                    )}
                  </div>

                  {/* Language Selection Dropdown */}
                  <div className="filter-item language-dropdown-container">
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
                        <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                      </button>

                      {showLanguageDropdown && (
                          <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow language-options-container">
                            {availableLanguages.map((lang) => (
                                <div
                                    key={lang.code}
                                    className="d-flex align-items-center px-3 py-2 language-option"
                                    onClick={() => toggleLanguage(lang.code)}
                                >
                                  <div className="form-check mb-0 d-flex align-items-center">
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
                        <div className="mt-2 d-flex flex-wrap">
                          {selectedLanguages.map(code => {
                            const lang = availableLanguages.find(l => l.code === code);
                            return lang ? (
                                <span
                                    key={code}
                                    className="badge bg-info me-1 mb-1 d-flex align-items-center language-badge"
                                >
                          {lang.name}
                                  <button
                                      type="button"
                                      className="btn-close btn-close-white ms-2"
                                      onClick={() => toggleLanguage(code)}
                                  ></button>
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
          {/* Removed the InteractiveMap component */}
        </div>
      </div>
  );
}

export default Gigs;