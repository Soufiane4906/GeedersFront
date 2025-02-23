import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style.scss";

const FeaturesSection = () => {
  useEffect(() => {
    // Apply background images dynamically
    document.querySelectorAll(".features-bg").forEach((element) => {
      const bgSrc = element.getAttribute("data-bg-src");
      if (bgSrc) {
        element.style.backgroundImage = `url(${bgSrc})`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
      }
    });
  }, []);

  const features = [
    {
      img: "features-1-1.png",
      title: "Special Activities",
      description:
        "Blablatrip offers exclusive local experiences led by passionate Ambassadors, ensuring every trip is unique and unforgettable.",
    },
    {
      img: "features-1-2.png",
      title: "Expert Guidance",
      description:
        "Get insider knowledge and travel tips from experienced local Ambassadors who know the city like no one else.",
    },
    {
      img: "features-1-3.png",
      title: "Seamless Travel Planning",
      description:
        "Plan and book personalized experiences effortlessly with Blablatrip’s flexible platform that caters to your interests.",
    },
    {
      img: "features-1-4.png",
      title: "Local Coordination",
      description:
        "Ambassadors manage logistics, transportation, and scheduling to ensure a smooth and hassle-free travel experience.",
    },
  ];

  return (
    <section className="space-extra-bottom">
      <div className="container">
        <div className="row">
          {features.map((feature, index) => (
            <div className="col-xl-3 col-md-6 col-sm-6 col-12" key={index}>
              <div className="features-style1">
                <div
                  className="features-bg"
                  data-bg-src="assets/img/shape/features.png"
                ></div>
                <div className="features-image">
                  <img
                    src={`assets/img/features/${feature.img}`}
                    alt={feature.title}
                  />
                </div>
                <div className="features-content">
                  <h3 className="features-title">{feature.title}</h3>
                  <p className="features-text">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
