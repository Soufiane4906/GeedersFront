import React, { useState, useEffect } from 'react';
import Footer from '../../components/footer/Footer';
import './Contact.scss';
import { toast } from 'react-toastify';
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhoneAlt,
    FaClock,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn
} from 'react-icons/fa';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true);

            // Simulate form submission
            setTimeout(() => {
                toast.success('Your message has been sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setIsSubmitting(false);
            }, 1500);
        }
    };

    const contactInfo = [
        {
            icon: <FaMapMarkerAlt />,
            title: 'Our Location',
            details: ['30 N Gould St Ste R', 'Sheridan, WY 82801', 'United States']
        },
        {
            icon: <FaEnvelope />,
            title: 'Email Us',
            details: ['contact@blablatrip.com', 'support@blablatrip.com']
        },
        {
            icon: <FaPhoneAlt />,
            title: 'Call Us',
            details: ['+1 (307) 123-4567', '+1 (307) 765-4321']
        },
        {
            icon: <FaClock />,
            title: 'Working Hours',
            details: ['Monday - Friday: 9AM - 5PM', 'Saturday: 10AM - 2PM', 'Sunday: Closed']
        }
    ];

    const faqs = [
        {
            question: 'How do I book a service?',
            answer: 'You can browse our services, select the one you need, choose your preferred date and time, and proceed to checkout. You\'ll receive a confirmation email once your booking is confirmed.'
        },
        {
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel your booking up to 48 hours before the scheduled service for a full refund. Cancellations made within 48 hours may be subject to our cancellation policy.'
        },
        {
            question: 'How can I become a service provider?',
            answer: 'If you\'re interested in becoming a service provider on our platform, please visit the "Become a Host" section on our website and follow the registration process.'
        },
        {
            question: 'Is my payment information secure?',
            answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your full credit card details on our servers.'
        }
    ];

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <div className="contact-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">Contact Us</h1>
                            <p className="hero-subtitle">We'd love to hear from you. Get in touch with our team.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Contact Information */}
                <div className="contact-info-section">
                    <div className="row">
                        {contactInfo.map((info, index) => (
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="contact-info-card">
                                    <div className="icon">{info.icon}</div>
                                    <h3>{info.title}</h3>
                                    <div className="details">
                                        {info.details.map((detail, i) => (
                                            <p key={i}>{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form and Map */}
                <div className="contact-form-section">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-wrapper">
                                <h2>Send Us a Message</h2>
                                <p>Fill out the form below and we'll get back to you as soon as possible.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={formErrors.name ? 'error' : ''}
                                        />
                                        {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Your Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={formErrors.email ? 'error' : ''}
                                        />
                                        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={formErrors.subject ? 'error' : ''}
                                        />
                                        {formErrors.subject && <div className="error-message">{formErrors.subject}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={formErrors.message ? 'error' : ''}
                                        ></textarea>
                                        {formErrors.message && <div className="error-message">{formErrors.message}</div>}
                                    </div>

                                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="map-wrapper">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.5967474023386!2d-106.95600452392038!3d44.79776797107246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5335fabc2a6e8b7d%3A0xb6ac33f5e1fb7228!2s30%20N%20Gould%20St%20%23R%2C%20Sheridan%2C%20WY%2082801%2C%20USA!5e0!3m2!1sen!2s!4v1713048527292!5m2!1sen!2s"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="BlaBlaTrip Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <div className="sec-line mx-auto"></div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-lg-8 mx-auto">
                            <div className="faq-wrapper">
                                {faqs.map((faq, index) => (
                                    <div className="faq-item" key={index}>
                                        <h3>{faq.question}</h3>
                                        <p>{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="social-section">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2>Connect With Us</h2>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;