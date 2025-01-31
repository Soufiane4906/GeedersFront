import React, { useState, useEffect } from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCheckCircle, FaMapPin, FaClock, FaSearchPlus, FaQuestionCircle } from 'react-icons/fa';
import { projects } from "../../data.js";

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
      <div className="home">
        {/* City Image Slider */}
        <div className="city-slider">
          <Slider {...sliderSettings}>
            {[
              { name: "Paris", image: "./img/paris.jpg" },
              { name: "New York", image: "./img/newyork.jpg" },
              { name: "Tokyo", image: "./img/tokyo.jpg" },
              { name: "London", image: "./img/london.jpg" },
            ].map((city, index) => (
                <div key={index} className="slider-item">
                  <img src={city.image} alt={city.name} />
                  <div className="slider-overlay">
                    <h2>{city.name}</h2>
                    <p>Explore the best of {city.name} with BlaBlaTrip</p>
                  </div>
                </div>
            ))}
          </Slider>
        </div>

        <Featured />
        <TrustedBy />

        <div className="features">
          <div className="container">
            <div className="item">
              <h1>Discover BlaBlaTrip Like You and Me</h1>
              <div className="title">
                <FaCheckCircle className="check-icon" />
                Connect with local BlaBlaTrip who share your interests
              </div>
              <p>
                Our BlaBlaTrip are passionate individuals who want to share their love for their country with you. They offer personalized experiences and local insights, so you can explore destinations like never before.
              </p>
              <div className="title">
                <FaCheckCircle className="check-icon" />
                Multilingual BlaBlaTrip
              </div>
              <p>
                Thanks to our platform, you'll be connected with BlaBlaTrip who speak your language and understand your culture, ensuring a seamless and enriching experience.
              </p>
              <div className="title">
                <FaCheckCircle className="check-icon" />
                Vehicles for Every Need
              </div>
              <p>
                Whether you need a car or a scooter, our BlaBlaTrip offer a range of transportation options to make your journey comfortable and convenient.
              </p>
              <div className="title">
                <FaCheckCircle className="check-icon" />
                Personalized and Secure
              </div>
              <p>
                Our platform ensures that your booking and payment are handled securely. You can book with confidence, knowing that you're getting a BlaBlaTrip who meets your needs and preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="BlaBlaTrip-info">
          <div className="container">
            <div className="text-content">
              <h1>More To Explore with BlaBlaTrip <FaSearchPlus /></h1>
              <p>
                <strong>What is a BlaBlaTrip? <FaQuestionCircle /></strong> A BlaBlaTrip is a person just like you and me who loves their city and wants to share it with tourists. Anyone can become a BlaBlaTrip in their own city, showcasing the best spots such as monuments, restaurants, clubs, museums, and more, during their free time. A BlaBlaTrip operates independently, not tied to a tour agency with fixed schedules and programs. The tourist chooses what they want to do and where they want to go, and the BlaBlaTrip adapts accordingly.
              </p>
              <p>
                <strong><FaMapPin /> Wherever you are in any city around the globe</strong> You can find a BlaBlaTrip to accompany you on your journey for an hour or as long as you need. Simply choose one from the BlaBlaTrip profiles, selecting based on your interests and the language you speak. Our BlaBlaTrip are everyday people who want to share the best spots for your vacation and make some extra money by becoming BlaBlaTrip in their spare time.
              </p>
              <p>
                <strong><FaClock /> No more getting up at 5 AM</strong> For long, endless excursions to places you may not want to visit. With our BlaBlaTrip, you can manage your schedule and destinations according to your preferences.
              </p>
            </div>
            <div className="image-collage">
              <img src="https://www.southampton.ac.uk/assets/imported/transforms/content-block/CB_RImg/220A8AAF34C54AD6AAC8FD7912AFF34E/tour%20guide.jpg_SIA_JPG_fit_to_width_INLINE.jpg" alt="Tour Guide" />
              <img src="https://www.careerguide.com/career/wp-content/uploads/2021/05/2-11-1024x576.jpg" alt="Tour Guide 2" />
              <img src="https://www.careerguide.com/career/wp-content/uploads/2021/05/1-10.jpg" alt="Tour Guide 3" />
              <img src="https://t4.ftcdn.net/jpg/06/46/09/33/360_F_646093387_Su5tngR44Ew6sTfI2fwg8Nsq9Di7ij2g.jpg" alt="Tour Guide 4" />
            </div>
          </div>
        </div>

        <div className="explore">
          <div className="container">
            <h1>Explore Points of Interest with Our BlaBlaTrip</h1>
            <div className="items">
              {[
                { icon: "https://img.icons8.com/ios/50/000000/museum.png", label: "Museum" },
                { icon: "https://img.icons8.com/ios/50/000000/beach.png", label: "Beach" },
                { icon: "https://img.icons8.com/?size=100&id=60357&format=png&color=000000", label: "Night Club" },
                { icon: "https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000", label: "Park" },
                { icon: "https://img.icons8.com/ios/50/000000/shopping-mall.png", label: "Shopping Mall" },
                { icon: "https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000", label: "Theatre" },
                { icon: "https://img.icons8.com/?size=100&id=25053&format=png&color=000000", label: "Amusement Park" },
                { icon: "https://img.icons8.com/ios/50/000000/restaurant.png", label: "Restaurant" },
                { icon: "https://img.icons8.com/?size=100&id=9844&format=png&color=000000", label: "Hiking" },
                { icon: "https://img.icons8.com/ios/50/000000/waterfall.png", label: "Waterfall" },
              ].map((item, index) => (
                  <div className="item" key={index}>
                    <img src={item.icon} alt={item.label} />
                    <div className="line"></div>
                    <span>{item.label}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;