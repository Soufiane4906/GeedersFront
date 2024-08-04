import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Updated import
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { FaMapMarkerAlt, FaStar, FaRegFlag, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/reviews/Reviews';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Gig.scss';

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hours, setHours] = useState(1);

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;
  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const handleVehicleChange = (e) => {
    const vehicle = e.target.value;
    setSelectedVehicle(vehicle);
    calculateTotalPrice(hours, vehicle);
  };

  const handleHoursChange = (e) => {
    const selectedHours = parseInt(e.target.value, 10) || 1;
    setHours(selectedHours);
    calculateTotalPrice(selectedHours, selectedVehicle);
  };

  const calculateTotalPrice = (hours, vehicle) => {
    let additionalPrice = 0;
    if (vehicle === 'car' && data?.carPrice) {
      additionalPrice = data.carPrice;
    } else if (vehicle === 'moto' && data?.scooterPrice) {
      additionalPrice = data.scooterPrice;
    }
    const newTotalPrice = data?.price * hours + additionalPrice;
    setTotalPrice(newTotalPrice);
  };

  useEffect(() => {
    if (data?.price) {
      calculateTotalPrice(hours, selectedVehicle);
    }
  }, [data, selectedVehicle, hours]);

  const handleConfirmBooking = () => {
    if (!privacyAccepted) {
      toast.error("Please accept the privacy conditions.");
      return;
    }

    // Store booking details in sessionStorage
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      id,
      totalPrice,
      price : data?.price,
      city: data?.city,
      country: data?.country,
      carPrice: data?.carPrice || 0,
      scooterPrice: data?.scooterPrice || 0,
      hours,
      selectedVehicle, // Add selected vehicle
    }));

    toast.success("Redirecting to payment...");
    navigate(`/pay/${id}`); // Use navigate instead of history.push
  };

  if (isLoading || isLoadingUser) return <div>Loading...</div>;
  if (error || errorUser) return <div>Something went wrong!</div>;
  return (
    <div className="gig container">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">
            <FaMapMarkerAlt /> {data?.country} {">"} {data?.city}
          </span>
          {isLoadingUser ? (
            "Loading..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img
                className="pp"
                src={dataUser?.img || "/img/noavatar.jpg"}
                alt={dataUser?.username || "User Avatar"}
              />
              <span className="ml-3">{dataUser?.username}</span>
              {!isNaN(data?.totalStars / data?.starNumber) && (
                <div className="stars">
                  {Array(Math.round(data.totalStars / data.starNumber))
                    .fill()
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  <span>{Math.round(data.totalStars / data.starNumber)}</span>
                </div>
              )}
            </div>
          )}
          <h2>About This Post</h2>
          <p>{data?.shortDesc}</p>
          {isLoadingUser ? (
            "Loading..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="seller">
              <h2>About The Guide</h2>
              <div className="user">
                <div className="info">
                  <span>{dataUser?.username}</span>
                  {!isNaN(data?.totalStars / data?.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      <span>{Math.round(data.totalStars / data.starNumber)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">
                      <FaRegFlag /> {dataUser?.country}
                    </span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">
                      <FaRegCalendarAlt /> Aug 2022
                    </span>
                  </div>
                  <div className="item">
                    <span className="title">Avg. response time</span>
                    <span className="desc">
                      <FaRegClock /> 4 hours
                    </span>
                  </div>
                  <div className="item">
                    <span className="title">Last Tour</span>
                    <span className="desc">
                      <FaRegCalendarAlt /> 1 day
                    </span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">
                      {dataUser?.languages?.join(", ")}
                    </span>
                  </div>
                </div>
                <hr />
                <p>{dataUser?.desc}</p>
              </div>
            </div>
          )}
          <Reviews gigId={id} />
        </div>
        <div className="right">
          <h2 className='headerTitle'>Booking Informations</h2>
          <div className="price">
            <h3>Total Price:</h3>
            <h2>$ {totalPrice.toFixed(2)}</h2>
          </div>
          <div className="vehicle-select">
            <h3>
              <FontAwesomeIcon icon={faCar} style={{ marginInlineEnd: '10px' }} />
              With Transport Option:
            </h3>
            <select onChange={handleVehicleChange}>
              <option value="">None</option>
              <option value="car" disabled={!data?.carPrice}>
                Car (+${data?.carPrice || "not available"})
              </option>
              <option value="moto" disabled={!data?.scooterPrice}>
                Moto (+${data?.scooterPrice || "not available"})
              </option>
            </select>
          </div>
          <div className="hours-select">
            <h3>Number of Hours:</h3>
            <input
              type="number"
              min="1"
              max="7"
              value={hours}
              onChange={handleHoursChange}
              style={{ fontSize: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
            />
          </div>
          <div className="privacy">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={() => setPrivacyAccepted(!privacyAccepted)}
            />
            <label>I accept all privacy conditions</label>
          </div>
           <div className="booking-info">
            <h3>Booking Details</h3>
            <p>
              Payment will be made directly to the guide. If the tour is canceled
              by the guide, please contact us for a refund.
            </p>
            <button
          className="btn btn-success"
          disabled={!privacyAccepted}
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Gig;
