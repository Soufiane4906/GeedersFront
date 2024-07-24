import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";
import { FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

function Home() {
  return (
    <div className="home">
      <Featured />
      <TrustedBy />
      {/* <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide> */}
      <div className="features">
      <div className="container">
          <div className="item">
            <h1>Discover Expert Guides from Around the World</h1>
            <div className="title">
              <FaCheckCircle className="check-icon" />
              Guides for Every Destination
            </div>
            <p>
              Access knowledgeable and experienced guides for any location. Whether you're exploring a city or a remote area, we've got you covered.
            </p>
            <div className="title">
              <FaCheckCircle className="check-icon" />
              Tailored Experiences
            </div>
            <p>
              Find guides who can offer personalized tours and experiences based on your interests and needs.
            </p>
            <div className="title">
              <FaCheckCircle className="check-icon" />
              Secure Booking and Payments
            </div>
            <p>
              Book your guide with confidence. Payments are processed securely, and you only pay once you're satisfied with the service.
            </p>
            <div className="title">
              <FaCheckCircle className="check-icon" />
              24/7 Customer Support
            </div>
            <p>
              Get assistance anytime you need it. Our support team is available around the clock to help with any issues or questions.
            </p>
          </div>

          <div className="item">
            <FaPlayCircle className="video-icon" />
            <video src="./img/video.mp4" controls />
          </div>
        </div>
      </div>
      <div className="explore">
      <div className="container">
  <h1>Explore Points of Interest with Our Guides</h1>
  <div className="items">
    <div className="item">
      <img
        src="https://img.icons8.com/ios/50/000000/museum.png"
        alt="Museum"
      />
      <div className="line"></div>
      <span>Museum</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/ios/50/000000/beach.png"
        alt="Beach"
      />
      <div className="line"></div>
      <span>Beach</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/?size=100&id=60357&format=png&color=000000"
        alt="Night Club"
      />
      <div className="line"></div>
      <span>Night Club</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000"
        alt="Park"
      />
      <div className="line"></div>
      <span>Park</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/ios/50/000000/shopping-mall.png"
        alt="Shopping Mall"
      />
      <div className="line"></div>
      <span>Shopping Mall</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000"
        alt="Theatre"
      />
      <div className="line"></div>
      <span>Theatre</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/?size=100&id=25053&format=png&color=000000"
        alt="Amusement Park"
      />
      <div className="line"></div>
      <span>Amusement Park</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/ios/50/000000/restaurant.png"
        alt="Restaurant"
      />
      <div className="line"></div>
      <span>Restaurant</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/?size=100&id=9844&format=png&color=000000"
        alt="Hiking"
      />
      <div className="line"></div>
      <span>Hiking</span>
    </div>
    <div className="item">
      <img
        src="https://img.icons8.com/ios/50/000000/waterfall.png"
        alt="Waterfall"
      />
      <div className="line"></div>
      <span>Waterfall</span>
    </div>
  </div>
</div>

      </div>
      <div className="features dark">
      <div className="container">
  <div className="item">
    <h1>
      guide<span>ers</span> <i>travel</i>
    </h1>
    <h1>
      Your ultimate solution for <i>exploring</i>
    </h1>
    <p>
      Upgrade to a curated travel experience with tools and benefits,
      dedicated to explorers
    </p>
    <div className="title">
      <img src="./img/check.png" alt="" />
      Connect with guides who have proven travel expertise
    </div>

    <div className="title">
      <img src="./img/check.png" alt="" />
      Get matched with the perfect guide by our travel success manager
    </div>

    <div className="title">
      <img src="./img/check.png" alt="" />
      Manage your trips and boost your travel experience with our powerful platform
    </div>
    <button>Explore Guideers Travel</button>
  </div>
  <div className="item">
    <img
      src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
      alt="Travel platform"
    />
  </div>
</div>

      </div>
      {/* <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </Slide> */}
    </div>
  );
}

export default Home;
