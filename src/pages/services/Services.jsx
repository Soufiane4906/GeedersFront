import React, { useEffect } from 'react';
import Footer from '../../components/footer/Footer';
import './Services.scss';
import { Link } from 'react-router-dom';
import {
    FaRoute,
    FaHotel,
    FaUtensils,
    FaMapMarkedAlt,
    FaUserFriends,
    FaLanguage,
    FaShieldAlt,
    FaHandsHelping,
    FaPhoneAlt
} from 'react-icons/fa';

const Services = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            id: 1,
            icon: <FaRoute />,
            title: "Transportation",
            description: "Reliable and comfortable transportation options for all your travel needs, from airport transfers to city-to-city travel.",
            link: "/gigs?category=transportation"
        },
        {
            id: 2,
            icon: <FaHotel />,
            title: "Accommodation",
            description: "Curated selection of unique stays, from boutique hotels to local homestays, ensuring comfort and authentic experiences.",
            link: "/gigs?category=accommodation"
        },
        {
            id: 3,
            icon: <FaUtensils />,
            title: "Food Experiences",
            description: "Discover local cuisine through cooking classes, food tours, and dining experiences with local hosts.",
            link: "/gigs?category=food"
        },
        {
            id: 4,
            icon: <FaMapMarkedAlt />,
            title: "Guided Tours",
            description: "Expert-led tours that take you beyond the tourist spots to discover hidden gems and local favorites.",
            link: "/gigs?category=tours"
        },
        {
            id: 5,
            icon: <FaUserFriends />,
            title: "Local Experiences",
            description: "Connect with locals for authentic experiences that showcase the true culture and lifestyle of your destination.",
            link: "/gigs?category=experiences"
        },
        {
            id: 6,
            icon: <FaLanguage />,
            title: "Translation Services",
            description: "Break language barriers with our on-demand translation services to enhance your travel experience.",
            link: "/gigs?category=translation"
        }
    ];

    const features = [
        {
            icon: <FaShieldAlt />,
            title: "Verified Providers",
            description: "All our service providers undergo a thorough verification process to ensure quality and reliability."
        },
        {
            icon: <FaHandsHelping />,
            title: "24/7 Support",
            description: "Our customer support team is available around the clock to assist with any issues or questions."
        },
        {
            icon: <FaPhoneAlt />,
            title: "Easy Booking",
            description: "Simple and secure booking process with instant confirmation and clear communication."
        }
    ];

    return (
        <div className="services-page">
            {/* Hero Section */}
            <div className="services-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">Our Services</h1>
                            <p className="hero-subtitle">Discover how we can enhance your travel experience</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Services Introduction */}
                <div className="services-intro text-center">
                    <h2 className="sec-title">What We Offer</h2>
                    <div className="sec-line mx-auto"></div>
                    <p className="intro-text">
                        At BlaBlaTrip, we provide a comprehensive range of services designed to make your travel experience
                        seamless, enjoyable, and authentic. From transportation to unique local experiences, we've got you covered.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="services-grid">
                    <div className="row">
                        {services.map(service => (
                            <div className="col-lg-4 col-md-6" key={service.id}>
                                <Link to={service.link} className="service-card">
                                    <div className="service-icon">{service.icon}</div>
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                    <div className="service-link">Learn More</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="how-it-works">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2 className="sec-title">How It Works</h2>
                            <div className="sec-line mx-auto"></div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h3>Browse & Choose</h3>
                                <p>Explore our wide range of services and select the ones that match your travel needs and preferences.</p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h3>Book & Confirm</h3>
                                <p>Make your booking through our secure platform and receive instant confirmation with all the details.</p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h3>Enjoy & Review</h3>
                                <p>Experience the service and share your feedback to help our community make informed decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2 className="sec-title">Why Choose Us</h2>
                            <div className="sec-line mx-auto"></div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        {features.map((feature, index) => (
                            <div className="col-lg-4" key={index}>
                                <div className="feature-card">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h2>Ready to Start Your Journey?</h2>
                            <p>Explore our services and find the perfect match for your travel needs.</p>
                            <Link to="/gigs" className="cta-button">Explore Services</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Services;