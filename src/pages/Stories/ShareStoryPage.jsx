import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";

import "../../style.scss";
import newRequest from "../../utils/newRequest.js";

const ShareStoryPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        title: "",
        location: "",
        ambassadorName: "",
        category: "",
        date: "",
        content: "",
        image: null,
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const categories = [
        { value: "adventure", label: "Adventure" },
        { value: "food", label: "Food & Culinary" },
        { value: "nightlife", label: "Nightlife" },
        { value: "history", label: "History & Culture" },
        { value: "nature", label: "Nature & Outdoors" },
        { value: "spiritual", label: "Spiritual Journey" },
        { value: "shopping", label: "Shopping" },
        { value: "family", label: "Family Experience" },
        { value: "other", label: "Other" }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error when field is changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.title.trim()) newErrors.title = "Story title is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.ambassadorName.trim()) newErrors.ambassadorName = "Ambassador name is required";
        if (!formData.category) newErrors.category = "Please select a category";
        if (!formData.date) newErrors.date = "Date of experience is required";
        if (!formData.content.trim() || formData.content.length < 50) {
            newErrors.content = "Please share your story (minimum 50 characters)";
        }
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

        return newErrors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo(0, 0);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data
            const storyData = new FormData();
            for (const key in formData) {
                storyData.append(key, formData[key]);
            }

            // Send data to backend using newRequest
            const response = await newRequest.post("/story", storyData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200 || response.status === 201) {
                setSubmitSuccess(true);
                window.scrollTo(0, 0);

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/stories');
                }, 3000);
            } else {
                setErrors({ form: "Something went wrong. Please try again." });
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            setErrors({
                form: error.response?.data === 'You are not authenticated!'
                    ? 'You are not authenticated'
                    : "There was a problem submitting your story. Please try again later."            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <section className="vs-blog-wrapper" style={{ padding: "80px 0", background: "#fff5f0" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div style={{
                                background: "#ffffff",
                                borderRadius: "15px",
                                padding: "40px",
                                textAlign: "center",
                                border: "1px solid #ffccb1",
                                boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
                            }}>
                                <div style={{ marginBottom: "20px" }}>
                                    <i className="fas fa-check-circle" style={{ fontSize: "60px", color: "#28a745" }}></i>
                                </div>
                                <h2 style={{ marginBottom: "20px", color: "#1c1c1c" }}>Thank You For Sharing Your Story!</h2>
                                <p style={{ marginBottom: "20px", color: "#505050" }}>
                                    We've received your submission and our team will review it shortly.
                                    Your story will help inspire other travelers to connect with local Ambassadors!
                                </p>
                                <p style={{ color: "#505050" }}>
                                    You will be redirected to the stories page in a few seconds...
                                </p>
                                <Link to="/stories" className="vs-btn" style={{
                                    background: "#ff681a",
                                    color: "#fff",
                                    padding: "10px 25px",
                                    textDecoration: "none",
                                    borderRadius: "5px",
                                    marginTop: "20px",
                                    display: "inline-block"
                                }}>
                                    View All Stories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="vs-blog-wrapper" style={{ padding: "80px 0", background: "#fff5f0" }}>
            <div className="container">
                <div className="row" style={{ justifyContent: "center", textAlign: "center", marginBottom: "40px" }}>
                    <div className="col-xl-8 col-lg-10">
                        <div className="title-area">
                            <span className="sec-subtitle" style={{ color: "#ff681a" }}>Your Experience Matters</span>
                            <h2 className="sec-title" style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Share Your Blablatrip Story</h2>
                            <p className="sec-text">
                                Your experience with a Blablatrip Ambassador could inspire fellow travelers! Tell us about your journey,
                                the moments that made it special, and how your Ambassador helped create an authentic travel experience.
                            </p>
                        </div>
                    </div>
                </div>

                {errors.form && (
                    <div className="row justify-content-center mb-4">
                        <div className="col-lg-8">
                            <div className="alert alert-danger" role="alert">
                                {errors.form}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "15px",
                            padding: "40px",
                            border: "1px solid #ffccb1",
                            boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
                        }}>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="name" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="email" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label htmlFor="title" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Story Title *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Give your story a catchy title"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="location" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, Country"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="ambassadorName" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Ambassador Name *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.ambassadorName ? 'is-invalid' : ''}`}
                                            id="ambassadorName"
                                            name="ambassadorName"
                                            value={formData.ambassadorName}
                                            onChange={handleChange}
                                            placeholder="Your Blablatrip Ambassador"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.ambassadorName && <div className="invalid-feedback">{errors.ambassadorName}</div>}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="category" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Experience Category *
                                        </label>
                                        <select
                                            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd",
                                                height: "auto"
                                            }}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label htmlFor="date" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Date of Experience *
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label htmlFor="content" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Your Story *
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                                            id="content"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            rows="8"
                                            placeholder="Share the details of your experience with the Ambassador"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        ></textarea>
                                        {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label htmlFor="image" className="form-label" style={{ fontWeight: "500", marginBottom: "8px" }}>
                                            Photo from Your Experience (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            onChange={handleChange}
                                            accept="image/*"
                                            style={{
                                                padding: "12px 15px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                        <div className="form-text" style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                                            Upload a photo that captures your experience (max 5MB)
                                        </div>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <div className="form-check">
                                            <input
                                                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                                type="checkbox"
                                                id="agreeTerms"
                                                name="agreeTerms"
                                                checked={formData.agreeTerms}
                                                onChange={handleChange}
                                                style={{ width: "20px", height: "20px" }}
                                            />
                                            <label className="form-check-label" htmlFor="agreeTerms" style={{ marginLeft: "10px" }}>
                                                I agree that Blablatrip may use my story and photos on their website and social media *
                                            </label>
                                            {errors.agreeTerms && <div className="invalid-feedback">{errors.agreeTerms}</div>}
                                        </div>
                                    </div>

                                    <div className="col-12 text-center">
                                        <button
                                            type="submit"
                                            className="vs-btn"
                                            disabled={isSubmitting}
                                            style={{
                                                background: "#ff681a",
                                                color: "#fff",
                                                padding: "12px 35px",
                                                border: "none",
                                                borderRadius: "5px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                                opacity: isSubmitting ? "0.7" : "1"
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : "Share Your Story"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShareStoryPage;