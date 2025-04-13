import React, { useState, useEffect } from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import {
  FaCheckCircle,
  FaMotorcycle,
  FaCar,
  FaStar,
  FaRegStar,
  FaBan,
  FaLanguage,
  FaMapMarkerAlt,
  FaEuroSign,
  FaClock,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const GigCard = ({ item }) => {
  const [languagesData, setLanguagesData] = useState([]);
  const [poiData, setPoiData] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showAllPoi, setShowAllPoi] = useState(false);

  // Récupération des données utilisateur
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  // Récupération des données de langues
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await newRequest.get("/languages");
        setLanguagesData(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des langues", error);
      }
    };

    fetchLanguages();
  }, []);

  // Récupération des données des POI
  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const response = await newRequest.get("/poi");
        setPoiData(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des points d'intérêt", error);
      }
    };

    fetchPOIs();
  }, []);

  // Fonction pour obtenir l'URL du drapeau à partir du code
  const getFlagUrl = (flagCode) => {
    if (flagCode?.startsWith('http')) {
      return flagCode;
    }
    const code = flagCode?.toLowerCase();
    return code ? `https://flagcdn.com/w320/${code}.png` : '';
  };

  // Fonction pour obtenir les détails d'une langue par son ID ou son nom
  const getLanguageDetails = (language) => {
    // Si c'est un objet complet (après populate)
    if (language && typeof language === 'object' && language.langue) {
      return language;
    }

    // Si c'est un ID, chercher par ID
    const byId = languagesData.find(lang => lang._id === language);
    if (byId) return byId;

    // Sinon chercher par nom
    const byName = languagesData.find(lang => lang.langue === language);
    return byName || { langue: language, flag: null };
  };

  // Fonction pour obtenir les détails d'un POI
  const getPoiDetails = (poiId) => {
    // Si c'est déjà un objet POI complet (après populate)
    if (poiId && typeof poiId === 'object' && poiId.name) {
      return poiId;
    }

    // Si c'est un ID, chercher par ID
    const poi = poiData.find(p => p._id === poiId);
    return poi || { name: poiId, image: null };
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isUserLoggedIn = !!currentUser;

  // Ensure data is available and check for properties before accessing
  const userData = data || {};
  const languages = userData.languages || [];
  const rating = !isNaN(item.totalStars / item.starNumber)
      ? Math.round(item.totalStars / item.starNumber)
      : 0;

  // Limiter le nombre de POI affichés initialement
  const displayedPoi = showAllPoi ? (item.poi || []) : (item.poi || []).slice(0, 2);

  return (
      <div className="gigCard">
        <div className="card-container">
          {/* En-tête de la carte avec avatar et nom d'utilisateur */}
          <div className="card-header">
            {isLoading ? (
                <div className="loading-placeholder">Chargement...</div>
            ) : error ? (
                <div className="error-message">Une erreur est survenue</div>
            ) : (
                <div className="user-profile">
                  <img
                      src={userData.img || "/img/noavatar.jpg"}
                      alt={userData.username || "Utilisateur"}
                      className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="username-container">
                      <h3 className="username">{userData.username}</h3>
                      {userData.isVerified && (
                          <FaCheckCircle className="verified-icon" title="Ambassadeur vérifié" />
                      )}
                    </div>
                    <div className="rating-container">
                      {[...Array(5)].map((_, index) => (
                          <span key={index} className="star-icon">
                      {index < rating ? <FaStar /> : <FaRegStar />}
                    </span>
                      ))}
                      <span className="rating-value">({rating || 0})</span>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Contenu principal */}
          <div className="card-body">
            {/* Section des langues */}
            <div className="info-section language-section">
              <div className="section-header">
                <FaLanguage className="section-icon" />
                <h4 className="section-title">Langues parlées</h4>
              </div>
              <div className="language-list">
                {languages.length > 0 ? (
                    languages.map((lang, index) => {
                      const language = getLanguageDetails(lang);
                      return (
                          <div key={index} className="language-item">
                            {language.flag && (
                                <img
                                    src={getFlagUrl(language.flag)}
                                    alt={language.langue}
                                    className="language-flag"
                                />
                            )}
                            <span className="language-name">{language.langue}</span>
                          </div>
                      );
                    })
                ) : (
                    <span className="empty-message">Aucune langue spécifiée</span>
                )}
              </div>
            </div>

            {/* Section des points d'intérêt */}
            {item.poi && item.poi.length > 0 && (
                <div className="info-section poi-section">
                  <div className="section-header">
                    <FaMapMarkerAlt className="section-icon" />
                    <h4 className="section-title">Points d'intérêt</h4>
                  </div>
                  <div className="poi-list">
                    {displayedPoi.map((poi, index) => {
                      const poiDetails = getPoiDetails(poi);
                      return (
                          <div key={index} className="poi-item">
                            {poiDetails.image ? (
                                <img
                                    src={poiDetails.image}
                                    alt={poiDetails.name}
                                    className="poi-thumbnail"
                                />
                            ) : (
                                <div className="poi-icon-container">
                                  <FaMapMarkerAlt className="poi-icon" />
                                </div>
                            )}
                            <span className="poi-name">{poiDetails.name}</span>
                          </div>
                      );
                    })}
                    {item.poi.length > 2 && (
                        <button
                            className="toggle-button"
                            onClick={() => setShowAllPoi(!showAllPoi)}
                        >
                          {showAllPoi ? (
                              <>Voir moins <FaChevronUp className="toggle-icon" /></>
                          ) : (
                              <>Voir +{item.poi.length - 2} <FaChevronDown className="toggle-icon" /></>
                          )}
                        </button>
                    )}
                  </div>
                </div>
            )}

            {/* Section des prix et options */}
            <div className="info-section price-section">
              <div className="price-header">
                <FaEuroSign className="section-icon" />
                <div className="price-info">
                  <span className="price-label">À PARTIR DE</span>
                  <h2 className="price-value">{item.price}€<span className="price-unit">/heure</span></h2>
                </div>
              </div>

              <div className="transport-options">
                {item.hasCar ? (
                    <div className="transport-option">
                      <FaCar className="transport-icon" />
                      <span className="transport-details">Voiture: {item.carPrice}€/heure</span>
                    </div>
                ) : item.hasScooter ? (
                    <div className="transport-option">
                      <FaMotorcycle className="transport-icon" />
                      <span className="transport-details">Scooter: {item.scooterPrice}€/heure</span>
                    </div>
                ) : (
                    <div className="transport-option no-transport">
                      <FaBan className="transport-icon" />
                      <span className="transport-details">Pas d'options de transport</span>
                    </div>
                )}

                {item.deliveryTime && (
                    <div className="duration-info">
                      <FaClock className="duration-icon" />
                      <span className="duration-value">Durée: {item.deliveryTime} heure(s)</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="card-footer">
            <button
                className={`action-button ${!isUserLoggedIn ? 'disabled' : ''}`}
                onMouseEnter={() => !isUserLoggedIn && setShowMessage(true)}
                onMouseLeave={() => setShowMessage(false)}
                disabled={!isUserLoggedIn}
            >
              {isUserLoggedIn ? (
                  <Link to={`/gig/${item._id}`} className="button-link">
                    Plus de détails / Réserver
                  </Link>
              ) : (
                  <span className="button-text">Plus de détails / Réserver</span>
              )}
              {!isUserLoggedIn && showMessage && (
                  <div className="login-tooltip">
                    Vous devez vous connecter ou créer un compte
                  </div>
              )}
            </button>
          </div>
        </div>
      </div>
  );
};

export default GigCard;
