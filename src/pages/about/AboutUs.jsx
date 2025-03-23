import React from 'react';
import Footer from '../../components/footer/Footer';
import './AboutUs.scss';

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <div className="container">
                <div className="title-area text-center">
                    <h2 className="sec-title">About Us</h2>
                    <div className="sec-line"></div>
                </div>

                <div className="about-content mt-5">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="image-box1">
                                <img src="/assets/img/about/about-1.jpg" alt="About Us" className="img1" />
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
                                <p>BlaBlaTrip is a platform that connects travelers with reliable transportation and unforgettable experiences. Our mission is to make travel accessible, affordable, and enjoyable for everyone.</p>

                                <ul className="about-list1 mt-4 mb-4">
                                    <li>Transparent pricing with no hidden fees</li>
                                    <li>Verified drivers and accommodation providers</li>
                                    <li>24/7 customer support</li>
                                    <li>Eco-friendly travel options</li>
                                    <li>Customizable itineraries</li>
                                    <li>Local experiences and authentic adventures</li>
                                </ul>

                                <p>Founded with a passion for exploration and connection, BlaBlaTrip has grown into a trusted travel platform serving thousands of travelers worldwide.</p>

                                <div className="company-info mt-5">
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

                <div className="row mt-5 mb-5">
                    <div className="col-lg-4">
                        <div className="contact-box">
                            <div className="contact-box_icon">
                                <i className="fal fa-map-marker-alt"></i>
                            </div>
                            <h4 className="contact-box__title">Our Mission</h4>
                            <p className="contact-box__text">To connect travelers with authentic experiences and reliable transportation options while promoting sustainable tourism.</p>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="contact-box">
                            <div className="contact-box_icon">
                                <i className="fal fa-eye"></i>
                            </div>
                            <h4 className="contact-box__title">Our Vision</h4>
                            <p className="contact-box__text">To become the most trusted platform for travel experiences, known for our reliability, transparency, and positive impact.</p>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="contact-box">
                            <div className="contact-box_icon">
                                <i className="fal fa-heart"></i>
                            </div>
                            <h4 className="contact-box__title">Our Values</h4>
                            <p className="contact-box__text">Integrity, innovation, sustainability, and creating meaningful connections between travelers and communities.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;