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
  faMotorcycle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/footer/Footer.jsx";

const formatDate = (dateString) => {
  try {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
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

  // Paramètres de filtrage depuis l'URL
  const [country, setCountry] = useState(queryParams.get('country') || "");
  const [city, setCity] = useState(queryParams.get('city') || "");

  // États pour les dropdowns
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPOIDropdown, setShowPOIDropdown] = useState(false);

  // États pour les données
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  // Paramètres de plage de dates
  const startDateParam = queryParams.get('startDate');
  const endDateParam = queryParams.get('endDate');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Paramètres de langues
  const languagesParam = queryParams.get('languages') || "";
  const [selectedLanguages, setSelectedLanguages] = useState(
      languagesParam ? languagesParam.split(',') : []
  );

  // Paramètres de POI
  const poiParam = queryParams.get('poi') || "";
  const [selectedPOIs, setSelectedPOIs] = useState(
      poiParam ? poiParam.split(',') : []
  );

  // Options de transport
  const hasCarParam = queryParams.get('hasCar') === 'true';
  const hasScooterParam = queryParams.get('hasScooter') === 'true';
  const [hasCar, setHasCar] = useState(hasCarParam);
  const [hasScooter, setHasScooter] = useState(hasScooterParam);

  const [isLoading, setIsLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [error, setError] = useState(null);

  // Initialiser la plage de dates depuis les paramètres d'URL
  useEffect(() => {
    if (startDateParam && endDateParam) {
      try {
        setDateRange([
          new Date(startDateParam),
          new Date(endDateParam)
        ]);
      } catch (error) {
        console.error("Erreur d'analyse des dates depuis l'URL:", error);
        setDateRange([null, null]);
      }
    }
  }, [startDateParam, endDateParam]);

  // Récupérer les données initiales - pays, langues et POI
  useEffect(() => {
    const fetchInitialData = async () => {
      setFilterLoading(true);
      try {
        // Récupérer les pays
        const countriesResponse = await newRequest.get('/countries');
        setCountries(countriesResponse.data);

        // Récupérer les langues
        const languagesResponse = await newRequest.get('/languages');
        setLanguages(languagesResponse.data || []);

        // Récupérer les POI
        const poisResponse = await newRequest.get('/pois');
        setPointsOfInterest(poisResponse.data.pois || []);

        // Récupérer les villes si un pays est sélectionné
        if (country) {
          const selectedCountryObj = countriesResponse.data.find(c => c.name === country);
          if (selectedCountryObj) {
            const citiesResponse = await newRequest.get(`/cities?countryId=${selectedCountryObj._id}`);
            setCities(citiesResponse.data);
          }
        }
      } catch (error) {
        console.error("Échec de récupération des données initiales", error);
        setError("Échec de chargement des données initiales");
      } finally {
        setFilterLoading(false);
      }
    };

    fetchInitialData();
  }, [country]);

  // Fonction pour obtenir l'URL du drapeau à partir du code de drapeau de langue
  const getFlagUrl = (flagCode) => {
    // Si c'est déjà une URL complète, la renvoyer
    if (flagCode?.startsWith('http')) {
      return flagCode;
    }

    // Sinon, supposer que c'est un code de pays et construire l'URL du drapeau
    const code = flagCode?.toLowerCase();
    return code ? `https://flagcdn.com/w320/${code}.png` : '';
  };

  // Gérer la sélection du pays
  const handleCountrySelect = (countryId, countryName) => {
    setCountry(countryName);
    setCity("");
    setSelectedPOIs([]);
    fetchCitiesForCountry(countryId);
    setShowCountryDropdown(false);
  };

  // Récupérer les villes pour un pays
  const fetchCitiesForCountry = async (countryId) => {
    try {
      setFilterLoading(true);
      const response = await newRequest.get(`/cities?countryId=${countryId}`);
      setCities(response.data);
    } catch (error) {
      console.error("Échec de récupération des villes", error);
      setError("Échec de chargement des villes");
    } finally {
      setFilterLoading(false);
    }
  };

  // Gérer la sélection de la ville
  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setSelectedPOIs([]);
    setShowCityDropdown(false);
  };

  // Fermer les dropdowns lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
      if (!e.target.closest('.poi-dropdown-container')) {
        setShowPOIDropdown(false);
      }
      if (!e.target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
      if (!e.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compter les filtres actifs
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

  const { isLoading: queryLoading, error: queryError, data, refetch } = useQuery({
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

  // Basculer la sélection de langue
  const toggleLanguage = (languageId) => {
    setSelectedLanguages(prevSelected => {
      if (prevSelected.includes(languageId)) {
        return prevSelected.filter(id => id !== languageId);
      } else {
        return [...prevSelected, languageId];
      }
    });
  };

  // Basculer la sélection de POI
  const togglePOI = (poiId) => {
    setSelectedPOIs(prevSelected => {
      if (prevSelected.includes(poiId)) {
        return prevSelected.filter(id => id !== poiId);
      } else {
        return [...prevSelected, poiId];
      }
    });
  };

  // Gérer le clic sur la case à cocher directement
  const handleCheckboxClick = (e, id, type) => {
    e.stopPropagation();
    if (type === 'poi') {
      togglePOI(id);
    } else if (type === 'language') {
      toggleLanguage(id);
    }
  };

  // Appliquer tous les filtres
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Mettre à jour tous les paramètres de filtrage
    if (country) params.set('country', country);
    if (city) params.set('city', city);

    if (startDate && endDate) {
      try {
        params.set('startDate', startDate.toISOString());
        params.set('endDate', endDate.toISOString());
      } catch (error) {
        console.error("Erreur de conversion des dates en chaîne ISO:", error);
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

  // Effacer tous les filtres
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

  // Supprimer un filtre spécifique
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

  // Fonctions d'aide pour obtenir les informations sur les POI et les langues
  const getPoiNameById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi ? poi.name : poiId;
  };

  const getPoiImageById = (poiId) => {
    const poi = pointsOfInterest.find(p => p._id === poiId);
    return poi && poi.image ? poi.image : null;
  };

  const getLanguageNameById = (languageId) => {
    const language = languages.find(l => l._id === languageId);
    return language ? language.langue : languageId;
  };

  const getLanguageFlagById = (languageId) => {
    const language = languages.find(l => l._id === languageId);
    return language ? getFlagUrl(language.flag) : null;
  };

  // Composant d'indicateur de chargement
  const LoadingSpinner = () => (
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
        <span>Chargement...</span>
      </div>
  );

  // Définir l'état de chargement pour le chargement initial de la page
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
            {/* Section de filtrage de la barre latérale */}
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

              {/* Dropdown Pays - Mis à jour */}
              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  Pays
                </h5>
                <div className="filter-content country-dropdown-container">
                  <div className="position-relative">
                    <button
                        type="button"
                        className="form-control text-start d-flex justify-content-between align-items-center"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        aria-expanded={showCountryDropdown}
                    >
                    <span className="truncate">
                      {country || "Sélectionner un pays"}
                    </span>
                      <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                    </button>

                    {showCountryDropdown && (
                        <div
                            className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                            style={{maxHeight: "200px", overflowY: "auto"}}
                        >
                          {filterLoading ? (
                              <div className="text-center py-3"><LoadingSpinner /></div>
                          ) : (
                              countries.map((countryItem) => (
                                  <div
                                      key={countryItem._id}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => handleCountrySelect(countryItem._id, countryItem.name)}
                                  >
                                    <div className="form-check mb-0 w-100 d-flex align-items-center">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={country === countryItem.name}
                                          onChange={() => {}}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCountrySelect(countryItem._id, countryItem.name);
                                          }}
                                          id={`country-${countryItem._id}`}
                                      />
                                      <label
                                          className="form-check-label ms-2 w-100"
                                          htmlFor={`country-${countryItem._id}`}
                                      >
                                        {countryItem.name}
                                      </label>
                                    </div>
                                  </div>
                              ))
                          )}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropdown Ville - Mis à jour */}
              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faCity} className="me-2" />
                  Ville
                </h5>
                <div className="filter-content city-dropdown-container">
                  <div className="position-relative">
                    <button
                        type="button"
                        className="form-control text-start d-flex justify-content-between align-items-center"
                        onClick={() => country && setShowCityDropdown(!showCityDropdown)}
                        disabled={!country || cities.length === 0}
                        aria-expanded={showCityDropdown}
                    >
                    <span className="truncate">
                      {city || "Sélectionner une ville"}
                    </span>
                      <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                    </button>

                    {showCityDropdown && (
                        <div
                            className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                            style={{maxHeight: "200px", overflowY: "auto"}}
                        >
                          {filterLoading ? (
                              <div className="text-center py-3"><LoadingSpinner /></div>
                          ) : (
                              cities.map((cityItem) => (
                                  <div
                                      key={cityItem._id}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => handleCitySelect(cityItem.name)}
                                  >
                                    <div className="form-check mb-0 w-100 d-flex align-items-center">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={city === cityItem.name}
                                          onChange={() => {}}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCitySelect(cityItem.name);
                                          }}
                                          id={`city-${cityItem._id}`}
                                      />
                                      <label
                                          className="form-check-label ms-2 w-100"
                                          htmlFor={`city-${cityItem._id}`}
                                      >
                                        {cityItem.name}
                                      </label>
                                    </div>
                                  </div>
                              ))
                          )}
                          {!filterLoading && cities.length === 0 && (
                              <div className="text-center py-3">Aucune ville disponible</div>
                          )}
                        </div>
                    )}
                  </div>
                  {filterLoading && <div className="loading-indicator"><FontAwesomeIcon icon={faSpinner} spin className="me-1" /> Chargement...</div>}
                </div>
              </div>

              {/* Sélection de plage de dates */}
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

              {/* Sélection de langue - Mise à jour avec les données de l'API */}
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
                        aria-expanded={showLanguageDropdown}
                    >
                    <span className="truncate">
                      {selectedLanguages.length === 0
                          ? "Sélectionner des langues"
                          : `${selectedLanguages.length} langue(s) sélectionnée(s)`}
                    </span>
                      <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                    </button>

                    {showLanguageDropdown && (
                        <div
                            className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                            style={{maxHeight: "200px", overflowY: "auto"}}
                        >
                          {filterLoading ? (
                              <div className="text-center py-3"><LoadingSpinner /></div>
                          ) : (
                              languages.map((lang) => (
                                  <div
                                      key={lang._id}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                      onClick={() => toggleLanguage(lang._id)}
                                  >
                                    <div className="form-check mb-0 w-100 d-flex align-items-center">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedLanguages.includes(lang._id)}
                                          onChange={() => {}}
                                          onClick={(e) => handleCheckboxClick(e, lang._id, 'language')}
                                          id={`lang-${lang._id}`}
                                      />
                                      <label
                                          className="form-check-label ms-2 w-100 d-flex align-items-center"
                                          htmlFor={`lang-${lang._id}`}
                                      >
                                        {lang.flag && (
                                            <img
                                                src={getFlagUrl(lang.flag)}
                                                alt={lang.langue}
                                                className="me-2"
                                                style={{width: '20px', height: 'auto'}}
                                            />
                                        )}
                                        {lang.langue}
                                      </label>
                                    </div>
                                  </div>
                              ))
                          )}
                          {!filterLoading && languages.length === 0 && (
                              <div className="text-center py-3">Aucune langue disponible</div>
                          )}
                        </div>
                    )}
                  </div>

                  {/* Afficher les langues sélectionnées avec des drapeaux */}
                  {selectedLanguages.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap selected-languages">
                        {selectedLanguages.map(languageId => {
                          const languageName = getLanguageNameById(languageId);
                          const flagUrl = getLanguageFlagById(languageId);
                          return (
                              <span
                                  key={languageId}
                                  className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                              >
                          {flagUrl && (
                              <img
                                  src={flagUrl}
                                  alt=""
                                  width="16"
                                  height="16"
                                  className="me-1"
                              />
                          )}
                                <span className="lang-name">{languageName}</span>
                          <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              onClick={() => removeFilter('language', languageId)}
                          ></button>
                        </span>
                          );
                        })}
                      </div>
                  )}
                </div>
              </div>

              {/* Dropdown Points d'intérêt - Mis à jour avec les données de l'API */}
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
                        onClick={() => city && setShowPOIDropdown(!showPOIDropdown)}
                        disabled={!city}
                        aria-expanded={showPOIDropdown}
                    >
                    <span className="truncate">
                      {selectedPOIs.length === 0
                          ? "Sélectionner des points d'intérêt"
                          : `${selectedPOIs.length} point(s) d'intérêt sélectionné(s)`}
                    </span>
                      <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                    </button>

                    {showPOIDropdown && (
                        <div
                            className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                            style={{maxHeight: "200px", overflowY: "auto"}}
                        >
                          {filterLoading ? (
                              <div className="text-center py-3"><LoadingSpinner /></div>
                          ) : (
                              pointsOfInterest.map((poi) => (
                                  <div
                                      key={poi._id}
                                      className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light poi-option"
                                      onClick={() => togglePOI(poi._id)}
                                  >
                                    <div className="form-check mb-0 w-100 d-flex align-items-center">
                                      <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedPOIs.includes(poi._id)}
                                          onChange={() => {}}
                                          onClick={(e) => handleCheckboxClick(e, poi._id, 'poi')}
                                          id={`poi-${poi._id}`}
                                      />
                                      <label
                                          className="form-check-label ms-2 w-100 d-flex align-items-center"
                                          htmlFor={`poi-${poi._id}`}
                                      >
                                        {poi.image && (
                                            <div className="poi-icon-container me-2">
                                              <img src={poi.image} alt={poi.name} width="20" height="20"/>
                                            </div>
                                        )}
                                        <span>{poi.name}</span>
                                      </label>
                                    </div>
                                  </div>
                              ))
                          )}
                          {!filterLoading && pointsOfInterest.length === 0 && (
                              <div className="text-center py-3">Aucun point d'intérêt disponible</div>
                          )}
                        </div>
                    )}
                  </div>

                  {/* Afficher les POI sélectionnés */}
                  {selectedPOIs.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap selected-pois">
                        {selectedPOIs.map((poiId) => {
                          const poiName = getPoiNameById(poiId);
                          const poiImage = getPoiImageById(poiId);
                          return (
                              <span
                                  key={poiId}
                                  className="badge bg-info me-1 mb-1 d-flex align-items-center poi-badge"
                              >
                          {poiImage && (
                              <img src={poiImage} alt="" width="16" height="16" className="me-1" />
                          )}
                                <span>{poiName}</span>
                          <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              onClick={() => removeFilter('poi', poiId)}
                          ></button>
                        </span>
                          );
                        })}
                      </div>
                  )}
                </div>
              </div>

              {/* Options de transport */}
              <div className="filter-section">
                <h5 className="filter-heading">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  Transport
                </h5>
                <div className="filter-content">
                  <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="hasCar"
                        checked={hasCar}
                        onChange={() => setHasCar(!hasCar)}
                    />
                    <label className="form-check-label d-flex align-items-center" htmlFor="hasCar">
                      <FontAwesomeIcon icon={faCar} className="me-2 text-primary" />
                      Dispose d'une voiture
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="hasScooter"
                        checked={hasScooter}
                        onChange={() => setHasScooter(!hasScooter)}
                    />
                    <label className="form-check-label d-flex align-items-center" htmlFor="hasScooter">
                      <FontAwesomeIcon icon={faMotorcycle} className="me-2 text-primary" />
                      Dispose d'un scooter
                    </label>
                  </div>
                </div>
              </div>

              {/* Bouton d'application des filtres */}
              <div className="filter-actions mt-4">
                <button className="apply-filters-btn" onClick={applyFilters}>
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  Appliquer les filtres
                </button>
              </div>
            </div>

            {/* Section principale de contenu */}
            <div className="gigs-content">
              {/* Bouton de filtrage mobile */}
              <div className="filter-toggle-mobile d-md-none mb-3">
                <button className="filter-btn" onClick={() => setSidebarOpen(true)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Filtres
                  {activeFilters > 0 && <span className="filter-badge">{activeFilters}</span>}
                </button>
              </div>

              {/* Affichage des filtres actifs */}
              {activeFilters > 0 && (
                  <div className="active-filters mb-3">
                    <div className="d-flex flex-wrap align-items-center">
                      <span className="active-filters-label me-2">Filtres actifs:</span>
                      <div className="active-filters-tags">
                        {country && (
                            <span className="filter-tag">
                        <FontAwesomeIcon icon={faGlobe} className="me-1" />
                              {country}
                              <button
                                  type="button"
                                  className="btn-close ms-2"
                                  onClick={() => removeFilter('country')}
                              ></button>
                      </span>
                        )}
                        {city && (
                            <span className="filter-tag">
                        <FontAwesomeIcon icon={faCity} className="me-1" />
                              {city}
                              <button
                                  type="button"
                                  className="btn-close ms-2"
                                  onClick={() => removeFilter('city')}
                              ></button>
                      </span>
                        )}
                        {startDate && endDate && (
                            <span className="filter-tag">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                              {formatDate(startDate.toISOString())} - {formatDate(endDate.toISOString())}
                              <button
                                  type="button"
                                  className="btn-close ms-2"
                                  onClick={() => removeFilter('dates')}
                              ></button>
                      </span>
                        )}
                        {hasCar && (
                            <span className="filter-tag">
                        <FontAwesomeIcon icon={faCar} className="me-1" />
                        Voiture
                        <button
                            type="button"
                            className="btn-close ms-2"
                            onClick={() => removeFilter('hasCar')}
                        ></button>
                      </span>
                        )}
                        {hasScooter && (
                            <span className="filter-tag">
                        <FontAwesomeIcon icon={faMotorcycle} className="me-1" />
                        Scooter
                        <button
                            type="button"
                            className="btn-close ms-2"
                            onClick={() => removeFilter('hasScooter')}
                        ></button>
                      </span>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              {/* Options de tri */}
              <div className="sort-options">
                <span className="sort-by">Trier par:</span>
                <div className="sort-buttons">
                  <button
                      className={sort === "sales" ? "active" : ""}
                      onClick={() => reSort("sales")}
                  >
                    <FontAwesomeIcon icon={faStar} className="me-1" />
                    Popularité
                  </button>
                  <button
                      className={sort === "createdAt" ? "active" : ""}
                      onClick={() => reSort("createdAt")}
                  >
                    <FontAwesomeIcon icon={faClock} className="me-1" />
                    Nouveautés
                  </button>
                </div>
                <div className="dropdown sort-dropdown">
                  <button
                      className="dropdown-toggle"
                      onClick={() => setOpen(!open)}
                  >
                    <FontAwesomeIcon icon={faArrowsUpDown} className="me-2" />
                    {sort === "sales" ? "Popularité" : "Nouveautés"}
                  </button>
                  {open && (
                      <div className="dropdown-menu">
                        <span onClick={() => reSort("sales")}>Popularité</span>
                        <span onClick={() => reSort("createdAt")}>Nouveautés</span>
                      </div>
                  )}
                </div>
              </div>

              {/* Affichage des résultats */}
              <div className="cards">
                {queryLoading ? (
                    <div className="loading-container">
                      <LoadingSpinner />
                    </div>
                ) : queryError ? (
                    <div className="error-message">
                      Une erreur s'est produite lors du chargement des données.
                    </div>
                ) : data && data.length === 0 ? (
                    <div className="no-results">
                      <div className="no-results-icon">
                        <FontAwesomeIcon icon={faSearch} />
                      </div>
                      <h3>{noResultsMessage}</h3>
                      <p>Essayez de modifier vos filtres ou d'élargir votre recherche.</p>
                    </div>
                ) : (
                    data.map((gig) => <GigCard key={gig._id} item={gig} />)
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
}

export default Gigs;


