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
  FaMoneyBillWave
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUsers, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/reviews/Reviews';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Gig.scss';

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hours, setHours] = useState(1);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const currentUserId = currentUser._id;

  const {
    isLoading,
    error,
    data: gigData
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = gigData?.userId;
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const handleVehicleChange = (e) => {
    const vehicle = e.target.value;
    setSelectedVehicle(vehicle);
    calculateTotalPrice(hours, vehicle);
  };

  const calculateStarRating = (totalStars, starNumber) => {
    // Ensure we have valid numbers and avoid NaN
    const rating = totalStars && starNumber
        ? Math.round(totalStars / starNumber)
        : 0;

    // Limit star rating between 0 and 5
    return Math.min(Math.max(rating, 0), 5);
  };

  // In the rendering section, replace the existing star rating with:
  const starRating = calculateStarRating(gigData?.totalStars, gigData?.starNumber);



  const handleHoursChange = (e) => {
    const selectedHours = parseInt(e.target.value, 10) || 1;
    setHours(selectedHours);
    calculateTotalPrice(selectedHours, selectedVehicle);
  };

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

  useEffect(() => {
    if (gigData?.price) {
      calculateTotalPrice(hours, selectedVehicle);
    }
  }, [gigData, selectedVehicle, hours]);

  const handleConfirmBooking = () => {
    if (!currentUser) {
      toast.error(
          <div>
            You need to have an account to book.
            <br />
            <a href="/login">Login</a> or
            <a href="/register"> Register</a>
          </div>,
          { autoClose: false }
      );
      return;
    }


    if (!privacyAccepted) {
      toast.error("Please accept the privacy conditions.");
      return;
    }

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
    }));

    toast.success("Redirecting to payment...");
    navigate(`/pay/${id}`);
  };

  if (isLoading || isLoadingUser) return <div className="loading-spinner">Loading...</div>;
  if (error || errorUser) return <div className="error-message">Something went wrong!</div>;

  return (
      <div className="gig container">
        <div className="container">
          <div className="left">
            <div className="gig-header">
            <span className="breadcrumbs">
              <FaMapMarkerAlt /> {gigData?.country} {">"} {gigData?.city}
            </span>
              <h1>{gigData?.title}</h1>
            </div>

            <div className="gig-details">
              <div className="user-profile">
                <img
                    className="avatar"
                    src={userData?.img || "/img/noavatar.jpg"}
                    alt={userData?.username || "User Avatar"}
                />
                <div className="user-info">
                  <h3>{userData?.username}</h3>
                  <div className="rating">
                    {Array.from({length: starRating}, (_, i) => (
                        <FaStar key={i}/>
                    ))}
                    <span>{starRating}</span>
                  </div>
                </div>
              </div>

              <div className="additional-details">
                <div className="detail-section">
                  <h3><FaInfoCircle/> Experience Details</h3>
                  <p>{gigData?.shortDesc}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <FaRegFlag /> <strong>Country:</strong> {gigData?.country}
                  </div>
                  <div className="detail-item">
                    <FaLanguage /> <strong>Languages:</strong> {userData?.languages?.join(", ")}
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faUsers} /> <strong>Group Size:</strong> {gigData?.groupSize || 'Not specified'}
                  </div>
                  <div className="detail-item">
                    <FaMoneyBillWave /> <strong>Base Price:</strong> ${gigData?.price}/hour
                  </div>
                </div>
              </div>
            </div>

            <Reviews gigId={id} />
          </div>

          <div className="right">
            <div className="booking-section">
              <h2 className="section-title">Book Your Experience</h2>

              <div className="price-summary">
                <h3>Total Price</h3>
                <div className="price-display">
                  <span>$ {totalPrice.toFixed(2)}</span>
                  <small>for {hours} hour(s)</small>
                </div>
              </div>

              <div className="booking-options">
                <div className="transport-option">
                  <h3>
                    <FontAwesomeIcon icon={faCar} /> Transport Option
                  </h3>
                  <select
                      onChange={handleVehicleChange}
                      disabled={!gigData?.carPrice && !gigData?.scooterPrice}
                  >
                    <option value="">No Transport</option>
                    {gigData?.carPrice && (
                        <option value="car">
                          Car (+${gigData.carPrice})
                        </option>
                    )}
                    {gigData?.scooterPrice && (
                        <option value="moto">
                          Moto (+${gigData.scooterPrice})
                        </option>
                    )}
                  </select>
                </div>

                <div className="hours-selection">
                  <h3>
                    <FontAwesomeIcon icon={faCalendarCheck} /> Duration
                  </h3>
                  <input
                      type="number"
                      min="1"
                      max="7"
                      value={hours}
                      onChange={handleHoursChange}
                  />
                </div>

                <div className="privacy-agreement">
                  <input
                      type="checkbox"
                      id="privacy-check"
                      checked={privacyAccepted}
                      onChange={() => setPrivacyAccepted(!privacyAccepted)}
                  />
                  <label htmlFor="privacy-check">
                    I accept privacy conditions and tour guidelines
                  </label>
                </div>
              </div>

              <div className="booking-actions">
                <button
                    className="book-button"
                    disabled={!privacyAccepted}
                    onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
  );
}

export default Gig;