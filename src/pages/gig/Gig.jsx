import React, { useState } from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkerAlt, FaCheck, FaStar, FaRegCalendarAlt, FaRegClock, FaRegFlag } from "react-icons/fa";
import { format, parseISO } from 'date-fns';

const formatDate = (dateString) => {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
};

function Gig() {
  const { id } = useParams();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

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
    let additionalPrice = 0;

    if (vehicle === "car") {
      additionalPrice = data.carPrice || 0; // Default to 0 if not provided
    } else if (vehicle === "moto") {
      additionalPrice = data.scooterPrice || 0; // Default to 0 if not provided
    }

    setTotalPrice(data.price + additionalPrice);
  };

  if (isLoading || isLoadingUser) return <div>Loading...</div>;
  if (error || errorUser) return <div>Something went wrong!</div>;

  return (
    <div className="gig container">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
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
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
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
              <h2>$ {totalPrice}</h2>
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
              <h3>With Vehicle Option:</h3>
              <select onChange={handleVehicleChange}>
                <option value="">None</option>
                <option value="car">Car (+${data.carPrice || 100})</option>
                <option value="moto">Moto (+${data.scooterPrice || 50})</option>
              </select>
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
      )}
    </div>
  );
}

export default Gig;