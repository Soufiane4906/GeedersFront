import React, { useState, useEffect } from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import Slide from "../../components/slide/Slide";
import Loading from '../../components/loading/Loading';

import { FaArrowCircleRight, FaCheckCircle, FaPlaceOfWorship, FaPlayCircle, FaQuestionCircle, FaSearchPlus, FaStamp, FaStopwatch } from 'react-icons/fa';
import { FaMapPin, FaGlobe, FaClock } from 'react-icons/fa';
import { FaCartPlus } from "react-icons/fa6";

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
      <Featured />
      <TrustedBy />
      <div className="features">
  <div className="container">
    <div className="item">
      <h1 style={{textAlign:'center'}} > Discover Geeders Like You and Me</h1>
      <div className="title">
        <FaCheckCircle className="check-icon" />
        Connect with local Geeders who share your interests
      </div>
      <p>
        Our Geeders are passionate individuals who want to share their love for their country with you. They offer personalized experiences and local insights, so you can explore destinations like never before.
      </p>
      <div className="title">
        <FaCheckCircle className="check-icon" />
        Multilingual Geeders
      </div>
      <p>
        Thanks to our platform, you'll be connected with Geeders who speak your language and understand your culture, ensuring a seamless and enriching experience.
      </p>
      <div className="title">
        <FaCheckCircle className="check-icon" />
        Vehicles for Every Need
      </div>
      <p>
        Whether you need a car or a scooter, our Geeders offer a range of transportation options to make your journey comfortable and convenient.
      </p>
      <div className="title">
        <FaCheckCircle className="check-icon" />
        Personalized and Secure
      </div>
      <p>
        Our platform ensures that your booking and payment are handled securely. You can book with confidence, knowing that you're getting a guide who meets your needs and preferences.
      </p>
    </div>
    {/* Uncomment if you have video content */}
    {/* <div className="item">
      <FaPlayCircle className="video-icon" />
      <video src="./img/video.mp4" controls />
    </div> */}
  </div>
</div>

      <div className="geeders-info">
      <div className="container">
        <div className="text-content">
          <h1> More To Explore with Geeders <FaSearchPlus /></h1>
          <p>
            <strong> What is a Geeders <FaQuestionCircle /> </strong> A Geeders is a person just like you and me who loves their city and wants to share it with tourists. Anyone can become a Geeders in their own city, showcasing the best spots such as monuments, restaurants, clubs, museums, and more, during their free time. A Geeders operates independently, not tied to a tour agency with fixed schedules and programs. The tourist chooses what they want to do and where they want to go, and the Geeders adapts accordingly.
          </p>
          <p>
            <strong><FaMapPin /> Wherever you are in any city around the globe</strong> You can find a Geeders to accompany you on your journey for an hour or as long as you need. Simply choose one from the Geeders profiles, selecting based on your interests and the language you speak. Our Geeders are everyday people who want to share the best spots for your vacation and make some extra money by becoming Geeders in their spare time.
          </p>
          <p>
            <strong><FaClock /> No more getting up at 5 AM  </strong> For long, endless excursions to places you may not want to visit. With our Geeders, you can manage your schedule and destinations according to your preferences.
          </p>
        </div>
        <div className="image-collage">
          <img src="data:image/jpeg;base64,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" alt="Image 1" />
          <img src="https://www.southampton.ac.uk/assets/imported/transforms/content-block/CB_RImg/220A8AAF34C54AD6AAC8FD7912AFF34E/tour%20guide.jpg_SIA_JPG_fit_to_width_INLINE.jpg" alt="Image 2" />
          <img src="https://www.careerguide.com/career/wp-content/uploads/2021/05/2-11-1024x576.jpg" alt="Image 3" />
          <img src="https://www.careerguide.com/career/wp-content/uploads/2021/05/1-10.jpg" alt="Image 4" />
          <img src="https://t4.ftcdn.net/jpg/06/46/09/33/360_F_646093387_Su5tngR44Ew6sTfI2fwg8Nsq9Di7ij2g.jpg" alt="Image 5" />
        </div>
      </div>
    </div>

      <div className="explore">
        <div className="container">
          <h1>Explore Points of Interest with Our Geeders</h1>
          <div className="items">
            <div className="item">
              <img src="https://img.icons8.com/ios/50/000000/museum.png" alt="Museum" />
              <div className="line"></div>
              <span>Museum</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/50/000000/beach.png" alt="Beach" />
              <div className="line"></div>
              <span>Beach</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/?size=100&id=60357&format=png&color=000000" alt="Night Club" />
              <div className="line"></div>
              <span>Night Club</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000" alt="Park" />
              <div className="line"></div>
              <span>Park</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/50/000000/shopping-mall.png" alt="Shopping Mall" />
              <div className="line"></div>
              <span>Shopping Mall</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000" alt="Theatre" />
              <div className="line"></div>
              <span>Theatre</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/?size=100&id=25053&format=png&color=000000" alt="Amusement Park" />
              <div className="line"></div>
              <span>Amusement Park</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/50/000000/restaurant.png" alt="Restaurant" />
              <div className="line"></div>
              <span>Restaurant</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/?size=100&id=9844&format=png&color=000000" alt="Hiking" />
              <div className="line"></div>
              <span>Hiking</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/50/000000/waterfall.png" alt="Waterfall" />
              <div className="line"></div>
              <span>Waterfall</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>geed<span>ers</span> <i>travel</i></h1>
            <h1>Your ultimate solution for <i>exploring</i></h1>
            <p>Upgrade to a curated travel experience with tools and benefits, dedicated to explorers</p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Connect with Geeders who have proven travel expertise
            </div>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Get matched with the perfect guide by our travel success manager
            </div>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Manage your trips and boost your travel experience with our powerful platform
            </div>
            {/* <button>Explore Guideers Travel</button> */}
          </div>
          <div className="item">
            <img
              src="https://travelerwp.com/wp-content/uploads/2023/05/Why-Tour-Photos-Make-the-Best-Souvenirs-Image-6.jpg"
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
