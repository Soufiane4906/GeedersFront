import React, { useState, useEffect } from "react";
import "./Home.scss";
import Featured from "../featured/Featured.jsx";
import TrustedBy from "../trustedBy/TrustedBy.jsx";
import Footer from "../footer/Footer";
import Loading from '../loading/Loading.jsx';
import { FaCheckCircle, FaMapPin, FaClock, FaSearchPlus, FaQuestionCircle } from 'react-icons/fa';
import Hero from "../Hero/Hero.jsx";
import Card from "../Card/card.jsx"
import Card1 from "../Card1/Card1.jsx"
import FeatureSection from "../FeatureSection/FeatureSection.jsx";
import SpecialOfferSection from "../SpecialOfferSection/SpecialOfferSection.jsx";
import UnforgettableCitiesSection from "../UnforgettableCitiesSection/UnforgettableCitiesSection.jsx";
import Testimonial from "../Testimonial/Testimonial.jsx"
import Blog from "../Blog/blog.jsx"
function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
      <div className="home">
 
        <Hero />
        <TrustedBy />
        <Card />
        
        {/* <FeatureSection /> */}

        <UnforgettableCitiesSection />
        <Testimonial />
        <Blog />
        <Footer />
      </div>
  );
}

export default Home;