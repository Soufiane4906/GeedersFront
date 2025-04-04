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
  FaMapMarkerAlt
} from "react-icons/fa";

const GigCard = ({ item }) => {
  const [languagesData, setLanguagesData] = useState([]);
  const [poiData, setPoiData] = useState([]);

  // Récupération des données utilisateur
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
        newRequest.get(`/users/${item.userId}`).then((res) => res.data),
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

  // Modification de la fonction getPoiDetails pour récupérer l'image également
  const getPoiDetails = (poiId) => {
    // Si c'est déjà un objet POI complet (après populate)
    if (poiId && typeof poiId === 'object' && poiId.name) {
      return poiId;
    }

    // Si c'est un ID, chercher par ID
    const poi = poiData.find(p => p._id === poiId);
    return poi || { name: poiId, image: null }; // Retourne l'objet POI complet si trouvé
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isUserLoggedIn = !!currentUser;

  // Ensure data is available and check for properties before accessing
  const userData = data || {};
  const languages = userData.languages || [];
  const rating = !isNaN(item.totalStars / item.starNumber)
      ? Math.round(item.totalStars / item.starNumber)
      : 0;

  const [showMessage, setShowMessage] = useState(false);
  const [showAllPoi, setShowAllPoi] = useState(false);

  // Limiter le nombre de POI affichés initialement
  const displayedPoi = showAllPoi ? (item.poi || []) : (item.poi || []).slice(0, 2);

  return (
      <div className="gigCard">
        <div className="topSection">
          <div className="userInfo">
            <div className="user">
              {isLoading ? (
                  "loading"
              ) : error ? (
                  "Something went wrong!"
              ) : (
                  <>
                    <img
                        src={userData.img || "/img/noavatar.jpg"}
                        alt=""
                        className={`userAvatar ${
                            userData.isVerified ? "verified-avatar" : ""
                        }`}
                    />
                    <div className="userDetails">
                      <span className="username">{userData.username}</span>
                      {userData.isVerified && (
                          <div className="verified">
                            <FaCheckCircle color="green" />
                            <span>This Ambassador is verified</span>
                          </div>
                      )}
                    </div>
                  </>
              )}
            </div>
            <div className="rating">
              {[...Array(5)].map((_, index) => (
                  <span key={index}>
                {index < rating ? (
                    <FaStar color="gold" />
                ) : (
                    <FaRegStar color="gold" />
                )}
              </span>
              ))}
              <span className="ratingValue">{rating}</span>
            </div>

            {/* Section des langues avec drapeaux */}
            <div className="languages-section">
              <h4><FaLanguage /> Langues parlées:</h4>
              <div className="language-flags-container">
                {languages.length > 0 ? (
                    languages.map((lang, index) => {
                      const language = getLanguageDetails(lang);
                      return (
                          <div key={index} className="language-badge">
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
                    <span className="no-languages">Aucune langue spécifiée</span>
                )}
              </div>
            </div>

            {/* Section des points d'intérêt avec images */}
            {item.poi && item.poi.length > 0 && (
                <div className="poi-section">
                  <h4><FaMapMarkerAlt /> Points d'intérêt:</h4>
                  <div className="poi-list">
                    {displayedPoi.map((poi, index) => {
                      const poiDetails = getPoiDetails(poi);
                      return (
                          <div key={index} className="poi-item">
                            {poiDetails.image ? (
                                <img
                                    src={poiDetails.image}
                                    alt={poiDetails.name}
                                    className="poi-image"
                                />
                            ) : (
                                <FaMapMarkerAlt className="poi-icon" />
                            )}
                            <span className="poi-name">{poiDetails.name}</span>
                          </div>
                      );
                    })}
                    {item.poi.length > 2 && (
                        <button
                            className="show-more-btn"
                            onClick={() => setShowAllPoi(!showAllPoi)}
                        >
                          {showAllPoi ? "Voir moins" : `+${item.poi.length - 2} de plus`}
                        </button>
                    )}
                  </div>
                </div>
            )}
          </div>

          <div className="detailsSection">
            <hr />
            <div className="detail">
              <div className="price">
                <span>À PARTIR DE</span>
                <h2 style={{ color: "#e66224" }}>$ {item.price} / heure</h2>
              </div>
              <div className="features">
                {item.hasCar ? (
                    <div className="feature">
                      <FaCar />
                      <span>Voiture: ${item.carPrice} / heure</span>
                    </div>
                ) : item.hasScooter ? (
                    <div className="feature">
                      <FaMotorcycle />
                      <span>Scooter: ${item.scooterPrice} / heure</span>
                    </div>
                ) : (
                    <div className="noOptions">
                      <FaBan />
                      <span>Pas d'options disponibles</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          <button
              className={`detailsButton ${!isUserLoggedIn ? 'disabled' : ''} ${!isUserLoggedIn && showMessage ? 'showTooltip' : ''}`}
              onMouseEnter={() => !isUserLoggedIn && setShowMessage(true)}
              onMouseLeave={() => setShowMessage(false)}
              disabled={!isUserLoggedIn}
          >
            {isUserLoggedIn ? (
                <Link to={`/gig/${item._id}`}>Plus de détails / Réserver</Link>
            ) : (
                <span className="linkText">Plus de détails / Réserver</span>
            )}
            {!isUserLoggedIn && showMessage && (
                <div className="tooltip">Vous devez vous connecter ou créer un compte.</div>
            )}
          </button>
        </div>
      </div>
  );
};

export default GigCard;
