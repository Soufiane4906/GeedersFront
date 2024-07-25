import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { format, parseISO } from 'date-fns';

// Fonction de formatage
const formatDate = (dateString) => {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
};

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  return (
    <div className="gigCard">
      <div className="topSection">
        <img src={item.cover} alt="" className="coverImage" />
        <div className="userInfo">
          <div className="user">
            {isLoading ? (
              "loading"
            ) : error ? (
              "Something went wrong!"
            ) : (
              <>
                <img src={data.img || "/img/noavatar.jpg"} alt="" className="userAvatar" />
                <div className="userDetails">
                  <span className="username">{data.username}</span>
                  {data.isVerified && (
                    <div className="verified">
                      <FaCheckCircle color="green" />
                      <span>This guide is verified</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <p className="description">{item.desc}</p>
          <div className="rating">
            <img src="./img/star.png" alt="Star Icon" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
          <div className="availability">
            <h4>Availability:</h4>
            <ul>
              {item.availabilityTimes.map((time, index) => (
                <li key={index}>{formatDate(time)}</li>
              ))}
            </ul>
          </div>
          <div className="languages">
            <h4>Languages Spoken:</h4>
            {/* <div className="flags">
              {data.languages.map((lang, index) => (
                <img
                  key={index}
                  src={`https://www.countryflags.io/${lang}/flat/32.png`}
                  alt={lang}
                  className="flagIcon"
                />
              ))}
            </div> */}
          </div>
        </div>
        <div className="detailsSection">
          <hr />
          <div className="detail">
            <div className="price">
              <span>STARTING AT</span>
              <h2>$ {item.price}</h2>
            </div>
            <div className="features">
              {item.hasCar && (
                <div className="feature">
                  <img src="./img/car.png" alt="Car Icon" />
                  <span>Car: ${item.carPrice}</span>
                </div>
              )}
              {item.hasScooter && (
                <div className="feature">
                  <img src="./img/scooter.png" alt="Scooter Icon" />
                  <span>Scooter: ${item.scooterPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button className="detailsButton">
          <Link to={`/gig/${item._id}`}>More Details / Book</Link>
        </button>
      </div>
    </div>
  );
};

export default GigCard;
