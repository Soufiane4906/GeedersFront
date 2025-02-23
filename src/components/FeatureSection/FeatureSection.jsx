import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import "../../style.scss";

const FeatureSection = () => {
  const features = [
    {
      title: "Special Activities",
      imgSrc: "assets/img/features/features-1-1.png",
      description: "Blablatrip connects you with local Ambassadors who offer exclusive activities, ensuring unique and authentic experiences in every destination."
    },
    {
      title: "Expert Guidance",
      imgSrc: "assets/img/features/features-1-2.png",
      description: "Explore cities like a local with guidance from passionate Ambassadors who share insider tips, hidden gems, and cultural insights."
    },
    {
      title: "Seamless Travel Planning",
      imgSrc: "assets/img/features/features-1-3.png",
      description: "Easily plan your journey with Blablatrip’s flexible booking system, allowing you to customize your experiences based on your interests."
    },
    {
      title: "Local Coordination",
      imgSrc: "assets/img/features/features-1-4.png",
      description: "Our platform helps you connect with trusted Ambassadors who manage logistics, ensuring a smooth and hassle-free travel experience."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="relative bg-gray-100 p-6 rounded-lg shadow-lg">
              <div className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('assets/img/shape/features.png')" }}></div>
              <div className="relative z-10">
                <img src={feature.imgSrc} alt={feature.title} className="w-full mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
