import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import HeroProfile from "../../components/HeroProfile";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCity,
  faGlobe,
  faUser,
  faLanguage,
  faPhone,
  faEnvelope,
  faLock,
  faIdCard,
  faSearch,
  faCheck,
  faExclamationTriangle,
  faCalendarAlt,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedPOIs, setSelectedPOIs] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [errors, setErrors] = useState({});

  // Refs for handling clicks outside dropdowns
  const countryDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryId: "",
    city: "",
    userType: "guest",
    isAmbassador: false,
    phone: "",
    age: "",
    languages: [],
    desc: ""
  });

  const navigate = useNavigate();

  // Calculate max steps based on user type
  const maxSteps = user.isAmbassador ? 6 : 4;

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update CSS variable for progress bar
  useEffect(() => {
    const progressBarElement = document.querySelector('.register');
    if (progressBarElement) {
      progressBarElement.style.setProperty('--step-count', step);
      progressBarElement.style.setProperty('--max-steps', maxSteps);
    }
  }, [step, maxSteps]);

// Fetch countries and languages on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch countries
        const countriesResponse = await newRequest.get("/countries");
        // Vérifier que les données sont valides avant de les utiliser
        const validCountries = Array.isArray(countriesResponse.data)
            ? countriesResponse.data.filter(country => country && country.name)
            : [];
        setCountries(validCountries);

        // Fetch languages
        const languagesResponse = await newRequest.get("/languages");
        console.log("langue",languagesResponse);
        // Vérifier que les données sont valides avant de les utiliser
        const validLanguages = Array.isArray(languagesResponse.data)
            ? languagesResponse.data.filter(language => language && language.name)
            : [];

        setLanguages(languagesResponse.data);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        setError("Failed to load initial data");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  useEffect(() => {
    console.log("Languages state:", languages);
    console.log("Selected language IDs:", user.languages);

    // Vérifier la correspondance
    const foundLanguages = user.languages.map(langId => {
      const found = languages.find(l => l._id === langId || l.id === langId);
      return { langId, found: !!found, name: found?.name };
    });
    console.log("Found languages:", foundLanguages);
  }, [languages, user.languages]);

  const handleUserTypeChange = (e) => {
    const selectedType = e.target.value;
    setUser((prev) => ({
      ...prev,
      userType: selectedType,
      isAmbassador: selectedType === "ambassador",
    }));
  };

// Function to get flag URL from language flag code
  const getFlagUrl = (flagCode) => {
    // Si flagCode est undefined ou null, retourner une chaîne vide
    if (!flagCode) return '';

    // If it's already a full URL, return it
    if (flagCode.startsWith('http')) {
      return flagCode;
    }

    // Otherwise, assume it's a country code and build the flag URL
    const code = flagCode.toLowerCase();
    return code ? `https://flagcdn.com/w20/${code}.png` : '';
  };


  // Handle country selection
  const handleCountrySelect = (countryId, countryName) => {
    setUser(prev => ({
      ...prev,
      country: countryName,
      countryId: countryId,
      city: ""
    }));

    if (errors.country) {
      setErrors(prev => ({ ...prev, country: null }));
    }

    fetchCitiesForCountry(countryId);
    setShowCountryDropdown(false);
  };

  // Fetch cities for a country
  const fetchCitiesForCountry = async (countryId) => {
    try {
      setIsLoading(true);
      const response = await newRequest.get(`/cities?countryId=${countryId}`);
      setCities(response.data);
    } catch (error) {
      console.error("Failed to fetch cities", error);
      toast.error("Erreur lors du chargement des villes");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (cityName) => {
    setUser(prev => ({
      ...prev,
      city: cityName
    }));

    if (errors.city) {
      setErrors(prev => ({ ...prev, city: null }));
    }

    setShowCityDropdown(false);
  };

  // Toggle language selection
  const toggleLanguage = (languageId, languageName) => {
    setUser(prev => {
      const isSelected = prev.languages.includes(languageId);
      const newLanguages = isSelected
          ? prev.languages.filter(id => id !== languageId)
          : [...prev.languages, languageId];
      return { ...prev, languages: newLanguages };
    });

    if (errors.languages) {
      setErrors(prev => ({ ...prev, languages: null }));
    }
  };
  const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredLanguages = languages.filter(language => {
    if (!language || !language.langue) return false;
    return language.langue.toLowerCase().includes((languageSearch || '').toLowerCase());
  });


  const validateStep = (currentStep) => {
    const newErrors = {};

    switch(currentStep) {
      case 1:
        // No validation needed for user type
        break;
      case 2:
        if (!user.firstName.trim()) newErrors.firstName = "Le prénom est requis";
        if (!user.lastName.trim()) newErrors.lastName = "Le nom est requis";
        break;
      case 3:
        if (!user.email.trim()) {
          newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          newErrors.email = "Format d'email invalide";
        }

        if (!user.password) {
          newErrors.password = "Le mot de passe est requis";
        } else if (user.password.length < 6) {
          newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }

        if (!user.confirmPassword) {
          newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
        } else if (user.password !== user.confirmPassword) {
          newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;
      case 4:
        if (user.isAmbassador) {
          if (!user.country) newErrors.country = "Le pays est requis";
          if (!user.city) newErrors.city = "La ville est requise";
        }
        break;
      case 5:
        if (user.isAmbassador) {
          if (!user.phone) {
            newErrors.phone = "Le numéro de téléphone est requis";
          } else if (!/^\+?[0-9]{10,15}$/.test(user.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Format de téléphone invalide";
          }

          if (!user.age) {
            newErrors.age = "L'âge est requis";
          } else if (isNaN(user.age) || user.age < 18 || user.age > 100) {
            newErrors.age = "Âge invalide (doit être entre 18 et 100)";
          }

          if (!user.languages.length) {
            newErrors.languages = "Sélectionnez au moins une langue";
          }

          if (!user.desc || user.desc.trim().length < 20) {
            newErrors.desc = "La description doit contenir au moins 20 caractères";
          }
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!validateStep(user.isAmbassador ? 5 : 3)) {
      toast.error("Veuillez corriger les erreurs avant de soumettre");
      return;
    }

    setIsLoading(true);
    try {
      // Transform user data for API if needed
      const userData = {
        ...user,
        // Convert languages from array of IDs to format expected by API if needed
      };

      await newRequest.post("/auth/register", userData);
      toast.success("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Une erreur s'est produite lors de l'inscription !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>

        <div className="register mt-4 mb-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {isLoading && <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="signup-form bg-smoke p-4 rounded">
                  <h1 className="form-title text-center mb-4">Inscription</h1>

                  {/* Progress bar */}
                  <div className="progress-bar mb-4">
                    {Array.from({ length: maxSteps }).map((_, index) => (
                        <div
                            key={index}
                            className={`step ${step >= index + 1 ? 'active' : ''}`}
                        >
                          {index + 1}
                        </div>
                    ))}
                  </div>

                  {/* Step 1: Account Type */}
                  {step === 1 && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Choisissez votre type de compte</h3>

                        <div className="form-group">
                          <div className="account-type-selection">
                            <div
                                className={`account-type-card ${user.userType === "guest" ? "selected" : ""}`}
                                onClick={() => setUser(prev => ({ ...prev, userType: "guest", isAmbassador: false }))}
                            >
                              <div className="icon-container">
                                <FontAwesomeIcon icon={faUser} size="2x" />
                              </div>
                              <h4>Traveler</h4>
                              <p>Explorez et découvrez de nouvelles destinations</p>
                            </div>

                            <div
                                className={`account-type-card ${user.userType === "ambassador" ? "selected" : ""}`}
                                onClick={() => setUser(prev => ({ ...prev, userType: "ambassador", isAmbassador: true }))}
                            >
                              <div className="icon-container">
                                <FontAwesomeIcon icon={faGlobe} size="2x" />
                              </div>
                              <h4>Ambassador</h4>
                              <p>Partagez votre expertise locale et guidez les visiteurs</p>
                            </div>
                          </div>
                        </div>

                        <button type="button" onClick={nextStep} className="vs-btn style4 w-100 mt-3">
                          Suivant
                        </button>
                      </div>
                  )}

                  {/* Step 2: Personal Info */}
                  {step === 2 && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Informations personnelles</h3>

                        <div className="form-group">
                          <label htmlFor="firstName">
                            <FontAwesomeIcon icon={faIdCard} /> Prénom
                          </label>
                          <input
                              name="firstName"
                              type="text"
                              placeholder="Prénom"
                              value={user.firstName}
                              onChange={handleChange}
                              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">
                            <FontAwesomeIcon icon={faIdCard} /> Nom
                          </label>
                          <input
                              name="lastName"
                              type="text"
                              placeholder="Nom"
                              value={user.lastName}
                              onChange={handleChange}
                              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </div>
                  )}

                  {/* Step 3: Email & Password */}
                  {step === 3 && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Informations de connexion</h3>

                        <div className="form-group">
                          <label htmlFor="email">
                            <FontAwesomeIcon icon={faEnvelope} /> Email
                          </label>
                          <input
                              name="email"
                              type="email"
                              placeholder="Adresse email"
                              value={user.email}
                              onChange={handleChange}
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">
                            <FontAwesomeIcon icon={faLock} /> Mot de passe
                          </label>
                          <input
                              name="password"
                              type="password"
                              placeholder="Mot de passe"
                              value={user.password}
                              onChange={handleChange}
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          <small className="form-text text-muted">
                            <FontAwesomeIcon icon={faInfoCircle} /> Le mot de passe doit contenir au moins 6 caractères
                          </small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmPassword">
                            <FontAwesomeIcon icon={faLock} /> Confirmer le mot de passe
                          </label>
                          <input
                              name="confirmPassword"
                              type="password"
                              placeholder="Confirmer le mot de passe"
                              value={user.confirmPassword}
                              onChange={handleChange}
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </div>
                  )}
                  {/* Step 4: Country & City */}
                  {step === 4 && user.isAmbassador && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Localisation</h3>

                        {/* Country Selection */}
                        <div className="form-group mb-3" ref={countryDropdownRef}>
                          <label htmlFor="country" className="mb-2">
                            <FontAwesomeIcon icon={faGlobe} /> Pays
                          </label>
                          <div className="position-relative">
                            <div
                                className={`form-control d-flex justify-content-between align-items-center ${errors.country ? 'is-invalid' : ''}`}
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            >
                              <span>{user.country || "Sélectionner un pays"}</span>
                              <FontAwesomeIcon icon={faSearch} className="ms-auto" />
                            </div>

                            {showCountryDropdown && (
                                <div className="dropdown-menu w-100 show custom-dropdown" style={{maxHeight: '250px', overflowY: 'auto', zIndex: 1050}}>
                                  <div className="px-3 py-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher un pays..."
                                        value={countrySearch}
                                        onChange={(e) => setCountrySearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  <div className="dropdown-divider"></div>
                                  {isLoading ? (
                                      <div className="text-center p-2">Chargement...</div>
                                  ) : (
                                      filteredCountries && filteredCountries.length > 0 ? (
                                          filteredCountries.map((country) => (
                                              <div
                                                  key={country._id || country.id}
                                                  className={`dropdown-item d-flex align-items-center ${user.country === country.name ? 'active' : ''}`}
                                                  onClick={() => handleCountrySelect(country._id || country.id, country.name)}
                                              >
                                                {country.flag && (
                                                    <img
                                                        src={getFlagUrl(country.flag)}
                                                        alt={country.name}
                                                        className="flag-icon me-2"
                                                        width="20"
                                                    />
                                                )}
                                                {country.name}
                                              </div>
                                          ))
                                      ) : (
                                          <div className="text-center p-2">Aucun pays trouvé</div>
                                      )
                                  )}
                                </div>
                            )}

                            {errors.country && (
                                <div className="invalid-feedback">
                                  {errors.country}
                                </div>
                            )}
                          </div>
                        </div>


                        <div className="form-group">
                          <label htmlFor="city">
                            <FontAwesomeIcon icon={faCity} /> Ville
                          </label>
                          <div className="custom-select-container" ref={cityDropdownRef}>
                            <div
                                className={`custom-select-header ${errors.city ? 'is-invalid' : ''}`}
                                onClick={() => user.country && setShowCityDropdown(!showCityDropdown)}
                            >
                              {user.city || "Sélectionner une ville"}
                              <FontAwesomeIcon icon={faCity} className="ms-auto" />
                            </div>

                            {showCityDropdown && (
                                <div className="custom-select-dropdown">
                                  <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder="Rechercher une ville..."
                                        value={citySearch || ''}
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="form-control"
                                    />
                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                  </div>
                                  <div className="options-container">
                                    {isLoading ? (
                                        <div className="text-center p-2">Chargement...</div>
                                    ) : cities && cities.length > 0 ? (
                                        cities
                                            .filter(city =>
                                                city &&
                                                city.name &&
                                                (!citySearch ||
                                                    city.name.toLowerCase().includes((citySearch || '').toLowerCase()))
                                            )
                                            .map((city) => (
                                                city && city.name && (
                                                    <div
                                                        key={city.id || city._id}
                                                        className={`option ${user.city === city.name ? 'selected' : ''}`}
                                                        onClick={() => handleCitySelect(city.name)}
                                                    >
                                                      {city.name}
                                                      {user.city === city.name && (
                                                          <FontAwesomeIcon icon={faCheck} className="ms-auto" />
                                                      )}
                                                    </div>
                                                )
                                            ))
                                    ) : (
                                        <div className="text-center p-2">
                                          {user.country ? "Aucune ville trouvée" : "Sélectionnez d'abord un pays"}
                                        </div>
                                    )}
                                  </div>
                                </div>
                            )}
                            {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </div>
                  )}


                  {/* Step 5: Additional Info for Ambassadors */}
                  {step === 5 && user.isAmbassador && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Informations complémentaires</h3>

                        <div className="form-group">
                          <label htmlFor="phone">
                            <FontAwesomeIcon icon={faPhone} /> Téléphone
                          </label>
                          <input
                              name="phone"
                              type="tel"
                              placeholder="Numéro de téléphone"
                              value={user.phone}
                              onChange={handleChange}
                              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              required
                          />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          <small className="form-text text-muted">
                            <FontAwesomeIcon icon={faInfoCircle} /> Format international recommandé (+33612345678)
                          </small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="age">
                            <FontAwesomeIcon icon={faCalendarAlt} /> Âge
                          </label>
                          <input
                              name="age"
                              type="number"
                              placeholder="Votre âge"
                              value={user.age}
                              onChange={handleChange}
                              className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                              min="18"
                              max="100"
                              required
                          />
                          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="languages">
                            <FontAwesomeIcon icon={faLanguage}/> Langues parlées
                          </label>
                          <div className="custom-select-container position-relative" ref={languageDropdownRef}>
                            <div
                                className={`custom-select-header form-control d-flex justify-content-between align-items-center ${errors.languages ? 'is-invalid' : ''}`}
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                            >
      <span>
        {user.languages.length
            ? `${user.languages.length} langue(s) sélectionnée(s)`
            : "Sélectionner les langues"}
      </span>
                              <FontAwesomeIcon icon={faLanguage} className="ms-auto"/>
                            </div>

                            {showLanguageDropdown && (
                                <div className="custom-select-dropdown custom-dropdown"
                                     style={{maxHeight: '250px', overflowY: 'auto', zIndex: 1050}}>
                                  <div className="search-container px-3 py-2">
                                    <input
                                        type="text"
                                        placeholder="Rechercher une langue..."
                                        value={languageSearch}
                                        onChange={(e) => setLanguageSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="form-control"
                                    />
                                  </div>
                                  <div className="dropdown-divider"></div>
                                  <div className="options-container">
                                    {isLoading ? (
                                        <div className="text-center p-2">Chargement...</div>
                                    ) : filteredLanguages && filteredLanguages.length > 0 ? (
                                        filteredLanguages.map((language) => (
                                            <div
                                                key={language._id || language.id}
                                                className={`option dropdown-item d-flex align-items-center ${user.languages.includes(language._id || language.id) ? 'selected' : ''}`}
                                                onClick={() => toggleLanguage(language._id, language.langue)}
                                            >
                                              {language.flag && (
                                                  <img
                                                      src={getFlagUrl(language.flag)}
                                                      alt={language.name}
                                                      className="flag-icon me-2"
                                                      width="20"
                                                  />
                                              )}
                                              <span>{language.langue}</span>
                                              {user.languages.includes(language._id || language.id) && (
                                                  <FontAwesomeIcon icon={faCheck} className="ms-auto" />
                                              )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-2">Aucune langue trouvée</div>
                                    )}
                                  </div>
                                </div>
                            )}
                            {errors.languages && <div className="invalid-feedback d-block">{errors.languages}</div>}
                          </div>
                          <small className="form-text text-muted">
                            <FontAwesomeIcon icon={faInfoCircle} /> Cliquez sur les langues pour les sélectionner ou désélectionner
                          </small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="desc">
                            <FontAwesomeIcon icon={faInfoCircle} /> Description
                          </label>
                          <textarea
                              name="desc"
                              placeholder="Parlez-nous de vous et de votre expérience en tant qu'ambassadeur local"
                              value={user.desc}
                              onChange={handleChange}
                              className={`form-control ${errors.desc ? 'is-invalid' : ''}`}
                              rows="4"
                              required
                          ></textarea>
                          {errors.desc && <div className="invalid-feedback">{errors.desc}</div>}
                          <small className="form-text text-muted">
                            <FontAwesomeIcon icon={faInfoCircle} /> Minimum 20 caractères
                          </small>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </div>
                  )}

                  {/* Step 4/6: Summary and Submission */}
                  {((step === 4 && !user.isAmbassador) || step === 6) && (
                      <div className="step-content">
                        <h3 className="step-title text-center mb-4">Résumé des informations</h3>

                        <div className="summary-container">
                          <div className="summary-section">
                            <h4>Informations de base</h4>
                            <div className="summary-item">
                              <span className="label">Type de compte:</span>
                              <span className="value">{user.userType === "guest" ? "Guest" : "Ambassador"}</span>
                            </div>
                            <div className="summary-item">
                              <span className="label">Nom complet:</span>
                              <span className="value">{user.firstName} {user.lastName}</span>
                            </div>
                            <div className="summary-item">
                              <span className="label">Email:</span>
                              <span className="value">{user.email}</span>
                            </div>
                          </div>

                          {user.isAmbassador && (
                              <>
                                <div className="summary-section">
                                  <h4>Localisation</h4>
                                  <div className="summary-item">
                                    <span className="label">Pays:</span>
                                    <span className="value">{user.country}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="label">Ville:</span>
                                    <span className="value">{user.city}</span>
                                  </div>
                                </div>

                                <div className="summary-section">
                                  <h4>Informations complémentaires</h4>
                                  <div className="summary-item">
                                    <span className="label">Téléphone:</span>
                                    <span className="value">{user.phone}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="label">Âge:</span>
                                    <span className="value">{user.age} ans</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="label">Langues parlées:</span>
                                    <span className="value">
  {user.languages.length > 0
      ? user.languages.map(langId => {
        const lang = languages.find(l => l._id === langId);
        return lang ? lang.langue : langId;
      }).join(", ")
      : "Aucune langue sélectionnée"}
</span>
                                  </div>
                                </div>

                                <div className="summary-section">
                                  <h4>Description</h4>
                                  <p className="description-text">{user.desc}</p>
                                </div>
                              </>
                          )}
                        </div>

                        <div className="terms-agreement form-group mt-4">
                          <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="termsAgreement"
                                required
                            />
                            <label className="form-check-label" htmlFor="termsAgreement">
                              J'accepte les conditions générales d'utilisation et la politique de confidentialité
                            </label>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button
                              type="submit"
                              className="vs-btn style4"
                              disabled={isLoading}
                          >
                            {isLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Inscription en cours...
                                </>
                            ) : "S'inscrire"}
                          </button>
                        </div>
                      </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
  );
}

export default Register;
