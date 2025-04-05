import React, { useEffect } from 'react';
import Footer from '../../components/footer/Footer';
import './AboutUs.scss';
import { FaMapMarkerAlt, FaEye, FaHeart, FaUsers, FaGlobeAmericas, FaLeaf } from 'react-icons/fa';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-us-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">Discover Our Story</h1>
                            <p className="hero-subtitle">Connecting travelers with authentic experiences since 2014</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="title-area text-center">
                    <h2 className="sec-title">About Us</h2>
                    <div className="sec-line"></div>
                    <p className="sec-subtitle">Learn more about our journey and what makes us different</p>
                </div>

                <div className="about-content mt-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="image-box1">
                                <img src="public/img/LogoBlaBlaTrip.jpg" alt="About Us" className="img1" />
                                <div className="media-box1">
                                    <div className="media-info">10+</div>
                                    <p className="media-text">Years Experience</p>
                                </div>
                                <div className="media-box2">
                                    <div className="media-info">5K+</div>
                                    <p className="media-text">Happy Travelers</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-content">
                                <h3 className="title-area mb-4">We're Dedicated To Making Travel Better</h3>
                                <p className="lead">BlaBlaTrip is a platform that connects travelers with reliable transportation and unforgettable experiences. Our mission is to make travel accessible, affordable, and enjoyable for everyone.</p>

                                <ul className="about-list1 mt-4 mb-4">
                                    <li><span className="check-icon">✓</span> Transparent pricing with no hidden fees</li>
                                    <li><span className="check-icon">✓</span> Verified drivers and accommodation providers</li>
                                    <li><span className="check-icon">✓</span> 24/7 customer support</li>
                                    <li><span className="check-icon">✓</span> Eco-friendly travel options</li>
                                    <li><span className="check-icon">✓</span> Customizable itineraries</li>
                                    <li><span className="check-icon">✓</span> Local experiences and authentic adventures</li>
                                </ul>

                                <p>Founded with a passion for exploration and connection, BlaBlaTrip has grown into a trusted travel platform serving thousands of travelers worldwide. We believe that travel should be more than just moving from one place to another—it should be about creating meaningful connections and memories that last a lifetime.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="values-section my-5 py-4">
                    <div className="row">
                        <div className="col-12 text-center mb-4">
                            <h3 className="values-title">Our Core Values</h3>
                            <div className="sec-line mx-auto"></div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-lg-4">
                            <div className="contact-box">
                                <div className="contact-box_icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <h4 className="contact-box__title">Our Mission</h4>
                                <p className="contact-box__text">To connect travelers with authentic experiences and reliable transportation options while promoting sustainable tourism.</p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="contact-box">
                                <div className="contact-box_icon">
                                    <FaEye />
                                </div>
                                <h4 className="contact-box__title">Our Vision</h4>
                                <p className="contact-box__text">To become the most trusted platform for travel experiences, known for our reliability, transparency, and positive impact.</p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="contact-box">
                                <div className="contact-box_icon">
                                    <FaHeart />
                                </div>
                                <h4 className="contact-box__title">Our Values</h4>
                                <p className="contact-box__text">Integrity, innovation, sustainability, and creating meaningful connections between travelers and communities.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                {/*<div className="team-section my-5">*/}
                {/*    <div className="row">*/}
                {/*        <div className="col-12 text-center mb-4">*/}
                {/*            <h3 className="team-title">Meet Our Team</h3>*/}
                {/*            <div className="sec-line mx-auto"></div>*/}
                {/*            <p className="team-subtitle">The passionate people behind BlaBlaTrip</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="row">*/}
                {/*        <div className="col-lg-3 col-md-6">*/}
                {/*            <div className="team-member">*/}
                {/*                <div className="team-image">*/}
                {/*                    <img src="/assets/img/team/team-1.jpg" alt="Team Member" />*/}
                {/*                    <div className="team-social">*/}
                {/*                        <a href="#"><i className="fab fa-linkedin"></i></a>*/}
                {/*                        <a href="#"><i className="fab fa-twitter"></i></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <h4>Soukaina Rami</h4>*/}
                {/*                <p>Co-Founder & CEO</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <div className="col-lg-3 col-md-6">*/}
                {/*            <div className="team-member">*/}
                {/*                <div className="team-image">*/}
                {/*                    <img src="/assets/img/team/team-2.jpg" alt="Team Member" />*/}
                {/*                    <div className="team-social">*/}
                {/*                        <a href="#"><i className="fab fa-linkedin"></i></a>*/}
                {/*                        <a href="#"><i className="fab fa-twitter"></i></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <h4>Michael Chen</h4>*/}
                {/*                <p>Co-Founder & CTO</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <div className="col-lg-3 col-md-6">*/}
                {/*            <div className="team-member">*/}
                {/*                <div className="team-image">*/}
                {/*                    <img src="/assets/img/team/team-3.jpg" alt="Team Member" />*/}
                {/*                    <div className="team-social">*/}
                {/*                        <a href="#"><i className="fab fa-linkedin"></i></a>*/}
                {/*                        <a href="#"><i className="fab fa-twitter"></i></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <h4>Elena Rodriguez</h4>*/}
                {/*                <p>Head of Operations</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <div className="col-lg-3 col-md-6">*/}
                {/*            <div className="team-member">*/}
                {/*                <div className="team-image">*/}
                {/*                    <img src="/assets/img/team/team-4.jpg" alt="Team Member" />*/}
                {/*                    <div className="team-social">*/}
                {/*                        <a href="#"><i className="fab fa-linkedin"></i></a>*/}
                {/*                        <a href="#"><i className="fab fa-twitter"></i></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <h4>David Kim</h4>*/}
                {/*                <p>Customer Experience</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Stats Section */}
                <div className="stats-section py-5 my-5">
                    <div className="row">
                        <div className="col-md-3 col-6">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaUsers />
                                </div>
                                <h3>5,000+</h3>
                                <p>Happy Travelers</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaGlobeAmericas />
                                </div>
                                <h3>50+</h3>
                                <p>Countries</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaLeaf />
                                </div>
                                <h3>100%</h3>
                                <p>Carbon Offset</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaHeart />
                                </div>
                                <h3>10+</h3>
                                <p>Years of Service</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="company-info-section mt-5 mb-5">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="company-info">
                                <h4>Company Information</h4>
                                <p>
                                    <strong>StarkX LLC</strong><br />
                                    30 N Gould St Ste R<br />
                                    Sheridan, WY 82801<br />
                                    <strong>EIN:</strong> 98-1845762
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;