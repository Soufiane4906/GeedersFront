// @ts-ignore
import React from "react";
import "./../style.scss";
import { Link } from 'react-router-dom';

const HeroProfile = () => {
  return (
    <div
      className="breadcumb-wrapper"
      style={{
        backgroundImage: "url('img/people.jpg')",
        backgroundSize: "contain",
        backgroundRepeat: "repeat",

      }}
    >
      <div className="container z-index-common" style={{    background: "#ff7b00"}}>
        <div className="breadcumb-content">


        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
