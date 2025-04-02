import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";
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
  faChevronDown,
  faArrowsUpDown,
  faStar,
  faClock,
  faXmark,
  faSliders,
  faCar,
  faMotorcycle
} from "@fortawesome/free-solid-svg-icons";
import { availableLanguages } from "../../utils/options.js";
import Footer from "../../components/footer/Footer.jsx";

const formatDate = (dateString) => {
  try {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

function Gigs() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Get all filter parameters from URL
  const [country, setCountry] = useState(queryParams.get('country') || "");
  const [city, setCity] = useState(queryParams.get('city') || "");

  // Get cities for the selected country
  const [cities, setCities] = useState([]);

  // Date range parameters
  const startDateParam = queryParams.get('startDate');
  const endDateParam = queryParams.get('endDate');
  const [dateRange, setDateRange] = useState([null, null]);
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
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  // Transport options
  const hasCarParam = queryParams.get('hasCar') === 'true';
  const hasScooterParam = queryParams.get('hasScooter') === 'true';
  const [hasCar, setHasCar] = useState(hasCarParam);
  const [hasScooter, setHasScooter] = useState(hasScooterParam);

  // Get all unique countries from API
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(0);

  // Initialize date range from URL parameters
  useEffect(() => {
    if (startDateParam && endDateParam) {
      try {
        setDateRange([
          new Date(startDateParam),
          new Date(endDateParam)
        ]);
      } catch (error) {
        console.error("Error parsing dates from URL:", error);
        setDateRange([null, null]);
      }
    }
  }, [startDateParam, endDateParam]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await newRequest.get('/countries');
        setCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch POIs from API
  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const response = await newRequest.get("/pois");
        setPointsOfInterest(response.data.pois || []);
      } catch (error) {
        console.error("Failed to fetch POIs", error);
      }
    };

    fetchPOIs();
  }, []);

  // Update cities list when country changes
  useEffect(() => {
    if (country) {
      const fetchCities = async () => {
        try {
          const selectedCountryObj = countries.find(c => c.name === country);
          if (selectedCountryObj) {
            const res = await newRequest.get(`/cities?countryId=${selectedCountryObj._id}`);
            setCities(res.data);
          }
        } catch (err) {
          console.error("Error fetching cities:", err);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [country, countries]);

  // Close dropdowns when clicking outside
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

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (country) count++;
    if (city) count++;
    if (startDate && endDate) count++;
    if (selectedLanguages.length > 0) count++;
    if (selectedPOIs.length > 0) count++;
    if (hasCar) count++;
    if (hasScooter) count++;
    setActiveFilters(count);
  }, [country, city, startDate, endDate, selectedLanguages, selectedPOIs, hasCar, hasScooter]);

  const { isLoading: queryLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, country, city, startDateParam, endDateParam, languagesParam, poiParam, hasCarParam, hasScooterParam],
    queryFn: () => {
      let queryString = `/gigs?sort=${sort}`;

      if (country) {
        queryString += `&country=${encodeURIComponent(country)}`;
      }

      if (city) {
        queryString += `&city=${encodeURIComponent(city)}`;
      }

      if (startDate && endDate) {
        queryString += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      if (selectedLanguages.length > 0) {
        queryString += `&languages=${selectedLanguages.join(',')}`;
      }

      if (selectedPOIs.length > 0) {
        queryString += `&poi=${selectedPOIs.join(',')}`;
      }

      if (hasCar) {
        queryString += `&hasCar=true`;
      }

      if (hasScooter) {
        queryString += `&hasScooter=true`;
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
  }, [sort, refetch]);

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
    setCountry(selectedCountry);
    setCity("");
    setSelectedPOIs([]);
  };

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setSelectedPOIs([]);
  };

  // Apply all filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Update all filter parameters
    if (country) params.set('country', country);
    if (city) params.set('city', city);

    if (startDate && endDate) {
      try {
        params.set('startDate', startDate.toISOString());
        params.set('endDate', endDate.toISOString());
      } catch (error) {
        console.error("Error converting dates to ISO string:", error);
      }
    }

    if (selectedLanguages.length > 0) {
      params.set('languages', selectedLanguages.join(','));
    }

    if (selectedPOIs.length > 0) {
      params.set('poi', selectedPOIs.join(','));
    }

    if (hasCar) {
      params.set('hasCar', 'true');
    }

    if (hasScooter) {
      params.set('hasScooter', 'true');
    }

    navigate(`?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setCountry("");
    setCity("");
    setDateRange([null, null]);
    setSelectedLanguages([]);
    setSelectedPOIs([]);
    setHasCar(false);
    setHasScooter(false);
    navigate('/gigs');
  };

  // Remove specific filter
  const removeFilter = (type, value = null) => {
    const params = new URLSearchParams(search);

    switch(type) {
      case 'country':
        params.delete('country');
        params.delete('city');
        params.delete('poi');
        setCountry("");
        setCity("");
        setSelectedPOIs([]);
        break;
      case 'city':
        params.delete('city');
        params.delete('poi');
        setCity("");
        setSelectedPOIs([]);
        break;
      case 'dates':
        params.delete('startDate');
        params.delete('endDate');
        setDateRange([null, null]);
        break;
      case 'language':
        if (value) {
          const newLangs = selectedLanguages.filter(lang => lang !== value);
          setSelectedLanguages(newLangs);
          if (newLangs.length > 0) {
            params.set('languages', newLangs.join(','));
          } else {
            params.delete('languages');
          }
        }
        break;
      case 'poi':
        if (value) {
          const newPois = selectedPOIs.filter(poi => poi !== value);
          setSelectedPOIs(newPois);
          if (newPois.length > 0) {
            params.set('poi', newPois.join(','));
          } else {
            params.delete('poi');
          }
        }
        break;
      case 'hasCar':
        params.delete('hasCar');
        setHasCar(false);
        break;
      case 'hasScooter':
        params.delete('hasScooter');
        setHasScooter(false);
        break;
      default:
        break;
    }

    navigate(`?${params.toString()}`);
  };

  // Handle checkbox click directly
  const handleCheckboxClick = (e, id, type) => {
    e.stopPropagation();
    if (type === 'poi') {
      togglePOI(id);
    } else if (type === 'language') {
      toggleLanguage(id);
    }
  };

  // Get POI name by ID
  const getPoiNameById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi ? poi.name : poiId;
  };

  // Get POI image by ID
  const getPoiImageById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi && poi.image ? poi.image : null;
  };

  // Set loading state for initial page load
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const noResultsMessage = "Aucun ambassadeur correspondant trouvé dans ces zones.";

  return (
      <div className="gigs">
        <div className="container-fluid">
          <div className="gigs-wrapper">
            {/* Sidebar Filter Section */}
            <div className={`filter-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
              <div className="sidebar-header">
                <h4>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Filtres
                  {activeFilters > 0 && <span className="active-filters-badge">{activeFilters}</span>}
                </h4>
                <button
                    className="sidebar-toggle-btn d-md-none"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {activeFilters > 0 && (
                  <div className="filter-actions mb-4">
                    <button className="clear-filters-btn" onClick={clearAllFilters}>
                      Effacer tous les filtres
                    </button>
                  </div>
              )}

              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  Localisation
                </h5>
                <div className="filter-content">
                  <select
                      value={country}
                      onChange={handleCountryChange}
                      className="form-select mb-3"
                  >
                    <option value="">Sélectionner un pays</option>
                    {countries.map((countryItem) => (
                        <option key={countryItem._id} value={countryItem.name}>
                          {countryItem.name}
                        </option>
                    ))}
                  </select>

                  <select
                      value={city}
                      onChange={handleCityChange}
                      disabled={!country}
                      className="form-select"
                  >
                    <option value="">Sélectionner une ville</option>
                    {cities.map((cityItem) => (
                        <option key={cityItem._id} value={cityItem.name}>
                          {cityItem.name}
                        </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Disponibilité
                </h5>
                <div className="filter-content">
                  <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Sélectionner une période"
                  />
                </div>
              </div>

              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faLanguage} className="me-2" />
                  Langues
                </h5>
                <div className="filter-content language-dropdown-container">
                  <div className="position-relative">
                    <button
                        type="button"
                        className="form-control text-start d-flex justify-content-between align-items-center"
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    >
                    <span className="truncate">
                      {selectedLanguages.length === 0
                          ? "Sélectionner des langues"
                          : `${selectedLanguages.length} langue(s) sélectionnée(s)`}
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
                                      onClick={(e) => handleCheckboxClick(e, lang.code, 'language')}
                                      id={`lang-${lang.code}`}
                                  />
                                  <label className="form-check-label ms-2" htmlFor={`lang-${lang.code}`}>
                                    <span className={`flag-icon flag-icon-${lang.code.slice(0, 2).toLowerCase()} me-2`}></span>
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
                      <div className="selected-items-container">
                        {selectedLanguages.map(code => {
                          const lang = availableLanguages.find(l => l.code === code);
                          return lang ? (
                              <div key={code} className="selected-item">
                                <span className={`flag-icon flag-icon-${code.slice(0, 2).toLowerCase()} me-1`}></span>
                                <span>{lang.name}</span>
                                <button type="button" className="remove-btn" onClick={() => removeFilter('language', code)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </div>
                          ) : null;
                        })}
                      </div>
                  )}
                </div>
              </div>

              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                  Points d'intérêt
                </h5>
                <div className="filter-content poi-dropdown-container">
                  <div className="position-relative">
                    <button
                        type="button"
                        className="form-control text-start d-flex justify-content-between align-items-center"
                        onClick={() => setShowPOIDropdown(!showPOIDropdown)}
                        disabled={!city}
                    >
                    <span className="truncate">
                      {selectedPOIs.length === 0
                          ? "Sélectionner des points d'intérêt"
                          : `${selectedPOIs.length} point(s) d'intérêt sélectionné(s)`}
                    </span>
                      <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                    </button>

                    {showPOIDropdown && (
                        <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow poi-options-container">
                          {pointsOfInterest.map((poi) => (
                              <div
                                  key={poi._id}
                                  className="d-flex align-items-center px-3 py-2 poi-option"
                                  onClick={() => togglePOI(poi._id)}
                              >
                                <div className="form-check mb-0 d-flex align-items-center">
                                  <input
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={selectedPOIs.includes(poi._id)}
                                      onChange={() => {}}
                                      onClick={(e) => handleCheckboxClick(e, poi._id, 'poi')}
                                      id={`poi-${poi._id}`}
                                  />
                                  <div className="poi-icon-container mx-2">
                                    {poi.image && <img src={poi.image} alt={poi.name} width="20" height="20" />}
                                  </div>
                                  <label className="form-check-label" htmlFor={`poi-${poi._id}`}>
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
                      <div className="selected-items-container">
                        {selectedPOIs.map(poiId => {
                          const poiName = getPoiNameById(poiId);
                          const poiImage = getPoiImageById(poiId);
                          return (
                              <div key={poiId} className="selected-item">
                                {poiImage && <img src={poiImage} alt={poiName} width="16" height="16" className="me-1" />}
                                <span>{poiName}</span>
                                <button type="button" className="remove-btn" onClick={() => removeFilter('poi', poiId)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </div>
                          );
                        })}
                      </div>
                  )}
                </div>
              </div>

              {/* Transport Options */}
              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  Options de transport
                </h5>
                <div className="filter-content">
                  <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="carOption"
                        checked={hasCar}
                        onChange={() => setHasCar(!hasCar)}
                    />
                    <label className="form-check-label" htmlFor="carOption">
                      <FontAwesomeIcon icon={faCar} className="me-2" />
                      Voiture disponible
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="scooterOption"
                        checked={hasScooter}
                        onChange={() => setHasScooter(!hasScooter)}
                    />
                    <label className="form-check-label" htmlFor="scooterOption">
                      <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                      Scooter disponible
                    </label>
                  </div>
                </div>
              </div>

              <div className="filter-actions mt-4">
                <button className="apply-filters-btn" onClick={applyFilters}>
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  Appliquer les filtres
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
              <div className="content-header">
                <div className="header-left">
                  <button
                      className="sidebar-toggle-btn d-md-none"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <FontAwesomeIcon icon={faSliders} />
                  </button>
                  <h1>Ambassadeurs disponibles</h1>
                  <p className="breadcrumbs">Résultats de recherche</p>
                </div>

                {/* Active filters display */}
                {activeFilters > 0 && (
                    <div className="active-filters-display">
                      {country && (
                          <div className="active-filter">
                            <span>Pays: {country}</span>
                            <button onClick={() => removeFilter('country')}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                      )}

                      {city && (
                          <div className="active-filter">
                            <span>Ville: {city}</span>
                            <button onClick={() => removeFilter('city')}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                      )}

                      {startDate && endDate && (
                          <div className="active-filter">
                            <span>Dates: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}</span>
                            <button onClick={() => removeFilter('dates')}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                      )}

                      {hasCar && (
                          <div className="active-filter">
                            <span><FontAwesomeIcon icon={faCar} className="me-1" /> Voiture</span>
                            <button onClick={() => removeFilter('hasCar')}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                      )}

                      {hasScooter && (
                          <div className="active-filter">
                            <span><FontAwesomeIcon icon={faMotorcycle} className="me-1" /> Scooter</span>
                            <button onClick={() => removeFilter('hasScooter')}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                      )}
                    </div>
                )}

                <div className="sort-container">
                  <span className="sortBy">Trier par</span>
                  <div className="sort-dropdown">
                    <button className="sort-btn" onClick={() => setOpen(!open)}>
                    <span>
                      {sort === "sales" ? "Meilleur ambassadeur" :
                          sort === "popularity" ? "Populaire" : "Plus récent"}
                    </span>
                      <FontAwesomeIcon icon={faArrowsUpDown} />
                    </button>

                    {open && (
                        <div className="sort-menu">
                          <div className="sort-option" onClick={() => reSort("createdAt")}>
                            <FontAwesomeIcon icon={faClock} className="me-2" />
                            <span>Plus récent</span>
                          </div>
                          <div className="sort-option" onClick={() => reSort("sales")}>
                            <FontAwesomeIcon icon={faStar} className="me-2" />
                            <span>Meilleur</span>
                          </div>
                          <div className="sort-option" onClick={() => reSort("popularity")}>
                            <FontAwesomeIcon icon={faStar} className="me-2" />
                            <span>Populaire</span>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="cards-container">
                {queryLoading ? (
                    <div className="loading-spinner">Chargement des ambassadeurs...</div>
                ) : error ? (
                    <div className="error-message">
                      <p>Une erreur s'est produite !</p>
                      <p>Erreur: {error.message}</p>
                    </div>
                ) : data && data.length > 0 ? (
                    <div className="cards">
                      {data.map((gig) => <GigCard key={gig._id} item={gig} />)}
                    </div>
                ) : (
                    <div className="no-results">
                      <img src="/img/img_no_result.png" alt="Pas de résultats" className="no-results-img" />
                      <p>{noResultsMessage}</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <Footer />
      </div>

  );
}

export default Gigs;
