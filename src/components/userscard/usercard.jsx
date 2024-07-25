import React from "react";
import "./usercard.scss";

const UserCard = ({ item }) => {
  return (
    <div className="userCard">
      <img src={item.img} alt={item.username} />
      <h2>{item.username}</h2>
      <p>{item.desc}</p>
      <span>{item.country}</span>
    </div>
  );
};

export default UserCard;
