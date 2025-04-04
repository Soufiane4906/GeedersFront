import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import {
  FaMapMarkerAlt,
  FaStar,
  FaRegFlag,
  FaRegCalendarAlt,
  FaRegClock,
  FaLanguage,
  FaInfoCircle,
  FaMoneyBillWave,
  FaCheck,
  FaHeart,
  FaShare,
  FaCalendarDay,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUsers, faCalendarCheck, faMotorcycle, faMapMarkedAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/reviews/Reviews';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Gig.scss';

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hours, setHours] = useState(1);
  const [languagesData, setLanguagesData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Redirect unauthenticated users
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const currentUserId = currentUser._id;

  // Fetch gig data
  const {
    isLoading,
    error,
    data: gigData
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = gigData?.userId;

  // Fetch user data
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  // Fetch languages data
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await newRequest.get("/languages");
        setLanguagesData(response.data || []);
      } catch (error) {
        console.error("Error fetching languages", error);
      }
    };

    fetchLanguages();
  }, []);

  // Function to get the language details
  const getLanguageDetails = (language) => {
    const byId = languagesData.find(lang => lang._id === language);
    if (byId) return byId;

    const byName = languagesData.find(lang => lang.langue === language);
    return byName || { langue: language, flag: null };
  };

  // Function to get flag URL from code
  const getFlagUrl = (flagCode) => {
    if (!flagCode) return '';
    if (flagCode.startsWith('http')) {
      return flagCode;
    }
    const code = flagCode.toLowerCase();
    return code ? `https://flagcdn.com/w320/${code}.png` : '';
  };

  // Handle vehicle selection
  const handleVehicleChange = (e) => {
    const vehicle = e.target.value;
    setSelectedVehicle(vehicle);
    calculateTotalPrice(hours, vehicle);
  };

  // Calculate star rating
  const calculateStarRating = (totalStars, starNumber) => {
    const rating = totalStars && starNumber
        ? Math.round(totalStars / starNumber)
        : 0;
    return Math.min(Math.max(rating, 0), 5);
  };

  const starRating = calculateStarRating(gigData?.totalStars, gigData?.starNumber);

  // Handle hours change
  const handleHoursChange = (e) => {
    const selectedHours = parseInt(e.target.value, 10) || 1;
    setHours(selectedHours);
    calculateTotalPrice(selectedHours, selectedVehicle);
  };

  // Calculate total price
  const calculateTotalPrice = (hours, vehicle) => {
    let additionalPrice = 0;
    if (vehicle === 'car' && gigData?.carPrice) {
      additionalPrice = gigData.carPrice;
    } else if (vehicle === 'moto' && gigData?.scooterPrice) {
      additionalPrice = gigData.scooterPrice;
    }
    const newTotalPrice = gigData?.price * hours + additionalPrice;
    setTotalPrice(newTotalPrice);
  };

  // Update price when data changes
  useEffect(() => {
    if (gigData?.price) {
      calculateTotalPrice(hours, selectedVehicle);
    }
  }, [gigData, selectedVehicle, hours]);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  // Handle time slot selection
  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!currentUser) {
      toast.error(
          <div>
            Vous devez avoir un compte pour réserver.
            <br />
            <a href="/login">Connexion</a> ou
            <a href="/register"> Inscription</a>
          </div>,
          { autoClose: false }
      );
      return;
    }

    if (!privacyAccepted) {
      toast.error("Veuillez accepter les conditions de confidentialité.");
      return;
    }

    // if (!selectedTimeSlot) {
    //   toast.error("Veuillez sélectionner un créneau horaire.");
    //   return;
    // }

    // Save booking details to session storage
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      id,
      totalPrice,
      GuestId: currentUserId,
      price: gigData?.price,
      city: gigData?.city,
      country: gigData?.country,
      carPrice: gigData?.carPrice || 0,
      scooterPrice: gigData?.scooterPrice || 0,
      hours,
      selectedVehicle,
      date: selectedDate.toISOString(),
      timeSlot: selectedTimeSlot
    }));

    toast.success("Redirection vers le paiement...");
    navigate(`/pay/${id}`);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Ajouté aux favoris !");
    } else {
      toast.info("Retiré des favoris");
    }
  };

  // Share experience
  const shareExperience = () => {
    if (navigator.share) {
      navigator.share({
        title: gigData?.title,
        text: gigData?.shortDesc,
        url: window.location.href,
      })
          .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  // Next image
  const nextImage = () => {
    if (gigData?.images && gigData.images.length > 0) {
      setImageIndex((prevIndex) => (prevIndex + 1) % gigData.images.length);
    }
  };

  // Previous image
  const prevImage = () => {
    if (gigData?.images && gigData.images.length > 0) {
      setImageIndex((prevIndex) => (prevIndex - 1 + gigData.images.length) % gigData.images.length);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const availableTimes = gigData?.availabilityTimes || {
      morning: true,
      afternoon: true,
      evening: true
    };

    if (availableTimes.morning) {
      for (let i = 9; i <= 11; i++) {
        slots.push(`${i}:00`);
      }
    }

    if (availableTimes.afternoon) {
      for (let i = 12; i <= 16; i++) {
        slots.push(`${i}:00`);
      }
    }

    if (availableTimes.evening) {
      for (let i = 17; i <= 20; i++) {
        slots.push(`${i}:00`);
      }
    }

    return slots;
  };

  if (isLoading || isLoadingUser) return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des expériences...</p>
      </div>
  );

  if (error || errorUser) return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Oups ! Une erreur s'est produite</h3>
        <p>Nous n'avons pas pu charger cette expérience. Veuillez réessayer plus tard.</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
  );

  return (
      <div className="gig-page">
        <div className="gig-container">
          {/* Header section */}
          <div className="gig-header">
            <div className="breadcrumbs">
              <FaMapMarkerAlt /> {gigData?.country} <span>›</span> {gigData?.city}
            </div>
            <h1>{gigData?.title || `Expérience à ${gigData?.city}`}</h1>
            <div className="gig-actions">
              <button className={`favorite-button ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                <FaHeart /> {isFavorite ? 'Enregistré' : 'Enregistrer'}
              </button>
              <button className="share-button" onClick={shareExperience}>
                <FaShare /> Partager
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="gig-content">
            {/* Left column */}
            <div className="gig-left">
              {/* Image gallery */}
              {/*<div className="gig-gallery">*/}
              {/*  {gigData?.images && gigData.images.length > 0 ? (*/}
              {/*      <div className="gallery-container">*/}
              {/*        <div className="main-image">*/}
              {/*          <img src={gigData.images[imageIndex]} alt={gigData.title} />*/}
              {/*          {gigData.images.length > 1 && (*/}
              {/*              <>*/}
              {/*                <button className="gallery-nav prev" onClick={prevImage}>*/}
              {/*                  <FaChevronLeft />*/}
              {/*                </button>*/}
              {/*                <button className="gallery-nav next" onClick={nextImage}>*/}
              {/*                  <FaChevronRight />*/}
              {/*                </button>*/}
              {/*                <div className="image-counter">*/}
              {/*                  {imageIndex + 1}/{gigData.images.length}*/}
              {/*                </div>*/}
              {/*              </>*/}
              {/*          )}*/}
              {/*        </div>*/}
              {/*        {gigData.images.length > 1 && (*/}
              {/*            <div className="thumbnail-row">*/}
              {/*              {gigData.images.map((img, index) => (*/}
              {/*                  <div*/}
              {/*                      key={index}*/}
              {/*                      className={`thumbnail ${index === imageIndex ? 'active' : ''}`}*/}
              {/*                      onClick={() => setImageIndex(index)}*/}
              {/*                  >*/}
              {/*                    <img src={img} alt={`Thumbnail ${index + 1}`} />*/}
              {/*                  </div>*/}
              {/*              ))}*/}
              {/*            </div>*/}
              {/*        )}*/}
              {/*      </div>*/}
              {/*  ) : (*/}
              {/*      <div className="no-images">*/}
              {/*        <div className="no-image-icon">*/}
              {/*          <FaInfoCircle />*/}
              {/*        </div>*/}
              {/*        <p>Aucune image disponible pour cette expérience</p>*/}
              {/*      </div>*/}
              {/*  )}*/}
              {/*</div>*/}

              {/* Ambassador profile */}
              <div className="ambassador-profile">
                <div className="profile-header">
                  <img
                      className="ambassador-avatar"
                      src={userData?.img || "/img/noavatar.jpg"}
                      alt={userData?.username || "Ambassador"}
                  />
                  <div className="ambassador-info">
                    <h3>{userData?.username}</h3>
                    <p className="ambassador-title">Ambassadeur Local</p>
                    <div className="rating">
                      {Array.from({length: 5}, (_, i) => (
                          <FaStar key={i} className={i < starRating ? 'active' : 'inactive'} />
                      ))}
                      <span>{starRating} ({gigData?.starNumber || 0} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="ambassador-bio">
                  <p>{userData?.desc || "Aucune description disponible"}</p>
                </div>
              </div>

              {/* Experience details */}
              <div className="experience-details">
                <h2><FaInfoCircle /> Détails de l'expérience</h2>
                <div className="detail-content">
                  <p className="experience-description">{gigData?.desc}</p>

                  <div className="key-details">
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <h4>Lieu</h4>
                        <p>{gigData?.city}, {gigData?.country}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaRegClock />
                      <div>
                        <h4>Durée</h4>
                        <p>Jusqu'à {gigData?.deliveryTime || 3} heures</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FontAwesomeIcon icon={faUsers} />
                      <div>
                        <h4>Taille du groupe</h4>
                        <p>Jusqu'à {gigData?.revisionNumber || 4} personnes</p>
                      </div>
                    </div>
                  </div>

                  {/* Points of interest */}
                  {gigData?.poi && gigData.poi.length > 0 && (
                      <div className="points-of-interest">
                        <h3><FontAwesomeIcon icon={faMapMarkedAlt} /> Points d'intérêt</h3>
                        <div className="poi-tags">
                          {gigData.poi.map((point, index) => {
                            // Si point est un objet avec des propriétés name et image
                            if (typeof point === 'object' && point !== null && point.name) {
                              return (
                                  <div key={index} className="poi-tag-with-image">
                                    {point.image && (
                                        <img
                                            src={point.image}
                                            alt={point.name}
                                            className="poi-thumbnail"
                                        />
                                    )}
                                    <span>{point.name}</span>
                                  </div>
                              );
                            }
                            // Si c'est juste une chaîne de caractères ou autre chose
                            return (
                                <span key={index} className="poi-tag">{String(point)}</span>
                            );
                          })}
                        </div>
                      </div>
                  )}



                  {/* Features */}
                  {gigData?.features && gigData.features.length > 0 && (
                      <div className="features-section">
                        <h3><FaCheck /> Ce qui est inclus</h3>
                        <ul className="features-list">
                          {gigData.features.map((feature, index) => (
                              <li key={index}><FaCheck /> {feature}</li>
                          ))}
                        </ul>
                      </div>
                  )}

                  {/* Languages */}
                  <div className="languages-section">
                    <h3><FaLanguage /> Langues</h3>
                    <div className="language-badges">
                      {userData?.languages && userData.languages.length > 0 ? (
                          userData.languages.map((lang, index) => {
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
                </div>
              </div>

              {/* Reviews section */}
              <div className="reviews-section">
                <Reviews gigId={id} />
              </div>
            </div>

            {/* Right column - Booking */}
            <div className="gig-right">
              <div className="booking-card">
                <h2>Réserver cette expérience</h2>

                <div className="price-info">
                  <span className="price-amount">{gigData?.price}€<small>/heure</small></span>
                  {gigData?.sales > 0 && (
                      <span className="sales-info">{gigData.sales} réservations</span>
                  )}
                </div>

                {/* Date selection */}
                <div className="booking-section date-section">
                  <h3><FaRegCalendarAlt /> Sélectionnez une date</h3>
                  <div className="date-picker">
                    <div className="date-display" onClick={() => setShowCalendar(!showCalendar)}>
                      <span>{selectedDate.toLocaleDateString()}</span>
                      <FaRegCalendarAlt />
                    </div>
                    {showCalendar && (
                        <div className="calendar-popup">
                          <Calendar
                              onChange={handleDateChange}
                              value={selectedDate}
                              minDate={new Date()}
                          />
                        </div>
                    )}
                  </div>
                </div>

                {/* Time slot selection */}
                {/*<div className="booking-section time-section">*/}
                {/*  <h3><FaRegClock /> Choisissez un horaire</h3>*/}
                {/*  <div className="time-slots">*/}
                {/*    {generateTimeSlots().map((slot, index) => (*/}
                {/*        <div*/}
                {/*            key={index}*/}
                {/*            className={`time-slot ${selectedTimeSlot === slot ? 'active' : ''}`}*/}
                {/*            onClick={() => setSelectedTimeSlot(slot)}*/}
                {/*        >*/}
                {/*          {slot}*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/* Duration selection */}
                <div className="booking-section">
                  <h3><FaRegClock /> Durée</h3>
                  <div className="duration-selector">
                    <button
                        className={`duration-btn ${hours === 1 ? 'active' : ''}`}
                        onClick={() => {
                          setHours(1);
                          calculateTotalPrice(1, selectedVehicle);
                        }}
                    >
                      1h
                    </button>
                    <button
                        className={`duration-btn ${hours === 2 ? 'active' : ''}`}
                        onClick={() => {
                          setHours(2);
                          calculateTotalPrice(2, selectedVehicle);
                        }}
                    >
                      2h
                    </button>
                    <button
                        className={`duration-btn ${hours === 3 ? 'active' : ''}`}
                        onClick={() => {
                          setHours(3);
                          calculateTotalPrice(3, selectedVehicle);
                        }}
                    >
                      3h
                    </button>
                    <button
                        className={`duration-btn ${hours === 4 ? 'active' : ''}`}
                        onClick={() => {
                          setHours(4);
                          calculateTotalPrice(4, selectedVehicle);
                        }}
                    >
                      4h
                    </button>
                  </div>
                </div>

                {/* Transport options */}
                <div className="booking-section">
                  <h3><FontAwesomeIcon icon={faCar} /> Transport</h3>
                  <div className="transport-options">
                    <div
                        className={`transport-option ${selectedVehicle === '' ? 'active' : ''}`}
                        onClick={() => handleVehicleChange({ target: { value: '' } })}
                    >
                      <FontAwesomeIcon icon={faUsers} className="transport-icon" />
                      <span className="transport-name">À pied</span>
                      <span className="transport-price">Inclus</span>
                    </div>

                    {gigData?.hasCar && gigData?.carPrice > 0 && (
                        <div
                            className={`transport-option ${selectedVehicle === 'car' ? 'active' : ''}`}
                            onClick={() => handleVehicleChange({ target: { value: 'car' } })}
                        >
                          <FontAwesomeIcon icon={faCar} className="transport-icon" />
                          <span className="transport-name">En voiture</span>
                          <span className="transport-price">+{gigData.carPrice}€</span>
                        </div>
                    )}

                    {gigData?.hasScooter && gigData?.scooterPrice > 0 && (
                        <div
                            className={`transport-option ${selectedVehicle === 'moto' ? 'active' : ''}`}
                            onClick={() => handleVehicleChange({ target: { value: 'moto' } })}
                        >
                          <FontAwesomeIcon icon={faMotorcycle} className="transport-icon" />
                          <span className="transport-name">En scooter</span>
                          <span className="transport-price">+{gigData.scooterPrice}€</span>
                        </div>
                    )}
                  </div>
                </div>

                {/* Total price */}
                <div className="total-price">
                  <div className="price-breakdown">
                    <div className="price-item">
                      <span>Prix de base ({hours} heure{hours > 1 ? 's' : ''})</span>
                      <span>{gigData?.price * hours}€</span>
                    </div>
                    {selectedVehicle && (
                        <div className="price-item">
                          <span>Transport ({selectedVehicle === 'car' ? 'En voiture' :
                              selectedVehicle === 'moto' ? 'En scooter' : 'À pied'})</span>
                          <span>
                            {selectedVehicle === 'car' ? gigData?.carPrice :
                                selectedVehicle === 'moto' ? gigData?.scooterPrice : 0}€
                          </span>
                        </div>
                    )}
                  </div>
                  <div className="total-row">
                    <span>Total</span>
                    <span className="total-amount">{totalPrice}€</span>
                  </div>
                </div>

                {/* Privacy agreement */}
                <div className="privacy-agreement">
                  <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={() => setPrivacyAccepted(!privacyAccepted)}
                    />
                    <span className="checkmark"></span>
                    J'accepte les conditions de confidentialité et les directives de visite
                  </label>
                </div>

                {/* Book button */}
                <button
                    className="book-button"
                    onClick={handleConfirmBooking}
                    disabled={!privacyAccepted }
                >
                  Réserver maintenant
                </button>

                <div className="security-note">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>Réservation sécurisée - aucun frais pour le moment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
  );
}

export default Gig;
