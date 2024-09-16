import React, { useState } from "react";
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
} from "react-icons/fa";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isUserLoggedIn = !!currentUser;

  // Ensure data is available and check for properties before accessing
  const userData = data || {};
  const languages = userData.languages || [];
  const rating = !isNaN(item.totalStars / item.starNumber)
    ? Math.round(item.totalStars / item.starNumber)
    : 0;

  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="gigCard">
      <div className="topSection">
        {/* <img src={userData.img} alt="" className="coverImage" /> */}
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
                      <span>This guide is verified</span>
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

          <div className="languages">
            <h4>Languages Spoken:</h4>
            <div className="flags">
              {languages.length > 0
                ? languages.join(", ")
                : "No languages specified"}
            </div>
          </div>
        </div>
        <div className="detailsSection">
          <hr />
          <div className="detail">
            <div className="price">
              <span>STARTING AT</span>
              <h2 style={{ color: "green" }}>$ {item.price} / hour</h2>
            </div>
            <div className="features">
              {item.hasCar ? (
                <div className="feature">
                  <FaCar />
                  <span>Car: ${item.carPrice} / hour</span>
                </div>
              ) : item.hasScooter ? (
                <div className="feature">
                  <FaMotorcycle />
                  <span>Scooter: ${item.scooterPrice} / hour</span>
                </div>
              ) : (
                <div className="noOptions">
                  <FaBan />
                  <span>No options available</span>
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
            <Link to={`/gig/${item._id}`}>More Details / Book</Link>
          ) : (
            <span className="linkText">More Details / Book</span>
          )}
          {!isUserLoggedIn && showMessage && (
            <div className="tooltip">You should login first or create an account.</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default GigCard;
