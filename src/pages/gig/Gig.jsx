import React, { useState , useEffect} from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkerAlt, FaCheck, FaStar, FaRegCalendarAlt, FaRegClock, FaRegFlag } from "react-icons/fa";
import { format, parseISO } from 'date-fns';
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const formatDate = (dateString) => {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, 'dd/MM/yyyy ');
};

function Gig() {
  const { id } = useParams();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hours, setHours] = useState(1); // Default to 1 hour

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => res.data),
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
    const pricePerHour = data?.price || 10; // Default price if not provided
    let additionalPrice = 0;

    // Calculate base price based on hours
    let basePrice = pricePerHour * hours;

    // Apply discount logic
    if (hours > 7) {
      basePrice -= pricePerHour * 2; // Discount for more than 7 hours
    } else if (hours > 5) {
      basePrice -= pricePerHour; // Discount for 6-7 hours
    }

    // Add vehicle-specific costs
    let vehiclePricePerHour = 0;
    if (vehicle === "car") {
      vehiclePricePerHour = data.carPrice || 10;
    } else if (vehicle === "moto") {
      vehiclePricePerHour = data.scooterPrice || 10;
    }
    additionalPrice = vehiclePricePerHour * hours;

    // Set the total price
    setTotalPrice(basePrice + additionalPrice);
  };

  useEffect(() => {
    // Initialize totalPrice with data?.price if data is available
    if (data?.price) {
      calculateTotalPrice(hours, selectedVehicle);
    }
  }, [data, selectedVehicle, hours]);

  if (isLoading || isLoadingUser) return <div>Loading...</div>;
  if (error || errorUser) return <div>Something went wrong!</div>;

  return (
    <div className="gig container">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">
            <FaMapMarkerAlt /> {data.country} {">"} {data.city}
          </span>
          {isLoadingUser ? (
            "Loading..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img
                className="pp"
                src={dataUser.img || "/img/noavatar.jpg"}
                alt=""
              />
              <span className="ml-3">{dataUser.username}</span>
              {!isNaN(data.totalStars / data.starNumber) && (
                <div className="stars">
                  {Array(Math.round(data.totalStars / data.starNumber))
                    .fill()
                    .map((item, i) => (
                      <FaStar key={i} />
                    ))}
                  <span>{Math.round(data.totalStars / data.starNumber)}</span>
                </div>
              )}
            </div>
          )}
          <h2>About This Post</h2>
          <p>{data.shortDesc}</p>
          {isLoadingUser ? (
            "Loading..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="seller">
              <h2>About The Guide</h2>
              <div className="user">
                <div className="info">
                  <span>{dataUser.username}</span>
                  {!isNaN(data.totalStars / data.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((item, i) => (
                          <FaStar key={i} />
                        ))}
                      <span>
                        {Math.round(data.totalStars / data.starNumber)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">
                      <FaRegFlag /> {dataUser.country}
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
                      {dataUser.languages?.join(", ")}
                    </span>
                  </div>
                </div>
                <hr />
                <p>{dataUser.desc}</p>
              </div>
            </div>
          )}
          <Reviews gigId={id} />
        </div>
        <div className="right">
          <div className="price">
            <h3>Total Price:</h3>
            <h2>$ {totalPrice.toFixed(2)}</h2>
          </div>
          <div className="details">
            <div className="item">
              <FaRegClock style={{ color: 'green', fontSize: '1rem' }} />
              <span>Available At:</span>
              <ul>
                {data.availabilityTimes.map((time, index) => (
                  <li key={index}>{formatDate(time)}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="features">
            <h3>Features:</h3>
            {data.features.map((feature) => (
              <div className="item" key={feature}>
                <FaCheck />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="vehicle-select">
          <h3>
  <FontAwesomeIcon icon={faCar} style={{ marginInlineEnd: '10px' }} />
  With Transport Option:
</h3>
            <select onChange={handleVehicleChange}>
              <option value="">None</option>
              <option value="car">Car (+${data.carPrice || "not availabale"})</option>
              <option value="moto">Moto (+${data.scooterPrice || "not availabale"})</option>
            </select>
          </div>
          <div className="hours-select">
            <h3>Number of Hours:</h3>
            <input
              type="number"
              min="1"
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
          <Link to={`/pay/${id}`}>
            <button className="btn btn-success" disabled={!privacyAccepted}>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Gig;