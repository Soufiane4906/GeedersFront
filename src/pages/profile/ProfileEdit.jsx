import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaGlobe, FaFileAlt, FaCity, FaPhone, FaCreditCard, FaImage, FaLanguage, FaChevronDown } from 'react-icons/fa';
import upload from "../../utils/upload.js";
import ImageUpload from './ImageUpload';
import newRequest from "../../utils/newRequest.js";

const ProfileEdit = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        country: user.country || '',
        languages: user.languages || [],
        city: user.city || '',
        phone: user.phone || '',
        desc: user.desc || '',
        accountNumber: user.accountNumber || '',
        paymentMethod: user.paymentMethod || '',
        location: user.location || '',
        imgRecto: user.imgRecto || '',
        imgVerso: user.imgVerso || '',
        imgPassport: user.imgPassport || '',
        img: user.img || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch languages from API
    useEffect(() => {
        const fetchLanguages = async () => {
            setIsLoading(true);
            try {
                const languagesResponse = await newRequest.get("/languages");
                setLanguages(languagesResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch languages", error);
                setError("Failed to load languages");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    // Function to get flag URL from language flag code
    const getFlagUrl = (flagCode) => {
        // If it's already a full URL, return it
        if (flagCode?.startsWith('http')) {
            return flagCode;
        }

        // Otherwise, assume it's a country code and build the flag URL
        const code = flagCode?.toLowerCase();
        return code ? `https://flagcdn.com/w320/${code}.png` : '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Toggle language selection
    const toggleLanguage = (languageId) => {
        setFormData(prevData => {
            const updatedLanguages = prevData.languages.includes(languageId)
                ? prevData.languages.filter(id => id !== languageId)
                : [...prevData.languages, languageId];

            return {
                ...prevData,
                languages: updatedLanguages
            };
        });
    };

    const handleFileChange = async (e) => {
        try {
            const { name, files } = e.target;
            if (files.length > 0) {
                const uploadedUrl = await upload(files[0]);
                setFormData((prev) => ({ ...prev, [name]: uploadedUrl }));
                return uploadedUrl;
            }
        } catch (error) {
            toast.error("Failed to upload file. Please try again.");
            console.error("Upload error:", error);
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onUpdate(formData);
        } catch (err) {
            toast.error("Failed to update profile. Please try again.");
            console.error("Update error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            country: user.country || '',
            languages: user.languages || [],
            city: user.city || '',
            phone: user.phone || '',
            desc: user.desc || '',
            accountNumber: user.accountNumber || '',
            paymentMethod: user.paymentMethod || '',
            location: user.location || '',
            imgRecto: user.imgRecto || '',
            imgVerso: user.imgVerso || '',
            imgPassport: user.imgPassport || '',
            img: user.img || '',
        });
        toast.info("Form has been reset to original values");
    };

    // Helper function to get language name by ID
    const getLanguageNameById = (languageId) => {
        const language = languages.find(l => l._id === languageId);
        return language ? language.langue : languageId;
    };

    // Helper function to get language flag by ID
    const getLanguageFlagById = (languageId) => {
        const language = languages.find(l => l._id === languageId);
        return language ? getFlagUrl(language.flag) : null;
    };

    // Handle checkbox click directly
    const handleCheckboxClick = (e, id) => {
        e.stopPropagation();
        toggleLanguage(id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.language-dropdown-container')) {
                setShowLanguageDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Form className="profile-edit" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>

            <div className="form-section">
                <h3>Personal Information</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label><FaUser /> Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label><FaEnvelope /> Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label><FaGlobe /> Country</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter your country"
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label><FaCity /> City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label><FaPhone /> Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </Form.Group>

                    {/* Language Selection Dropdown with Flags - Similar to Hero.jsx */}
                    <Form.Group as={Col} md="6" className="language-dropdown-container">
                        <Form.Label><FaLanguage /> Languages</Form.Label>
                        <div className="position-relative">
                            <button
                                type="button"
                                className="form-control text-start d-flex justify-content-between align-items-center"
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                            >
                                <span className="truncate">
                                    {formData.languages.length === 0
                                        ? "Select languages"
                                        : `${formData.languages.length} language(s) selected`}
                                </span>
                                <FaChevronDown className="dropdown-toggle" />
                            </button>

                            {showLanguageDropdown && (
                                <div
                                    className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow"
                                    style={{ maxHeight: "200px", overflowY: "auto" }}
                                >
                                    {isLoading ? (
                                        <div className="text-center py-3">Loading languages...</div>
                                    ) : (
                                        languages.map((lang) => (
                                            <div
                                                key={lang._id}
                                                className="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light"
                                                onClick={() => toggleLanguage(lang._id)}
                                            >
                                                <div className="form-check mb-0 w-100 d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={formData.languages.includes(lang._id)}
                                                        onChange={(e) => handleCheckboxClick(e, lang._id)}
                                                        id={`lang-${lang._id}`}
                                                    />
                                                    <label className="form-check-label ms-2 w-100 d-flex align-items-center" htmlFor={`lang-${lang._id}`}>
                                                        <img
                                                            src={getFlagUrl(lang.flag)}
                                                            alt={lang.langue}
                                                            className="me-2"
                                                            style={{ width: '20px', height: 'auto' }}
                                                        />
                                                        {lang.langue}
                                                    </label>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {!isLoading && languages.length === 0 && (
                                        <div className="text-center py-3">No languages available</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Display selected languages with flags */}
                        {formData.languages.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap selected-languages">
                                {formData.languages.map(languageId => {
                                    const flagUrl = getLanguageFlagById(languageId);
                                    return (
                                        <span
                                            key={languageId}
                                            className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                                        >
                                            {flagUrl && (
                                                <img
                                                    src={flagUrl}
                                                    alt=""
                                                    width="16"
                                                    height="16"
                                                    className="me-1"
                                                />
                                            )}
                                            <span className="lang-name">{getLanguageNameById(languageId)}</span>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white ms-2"
                                                onClick={() => toggleLanguage(languageId)}
                                            ></button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="12">
                        <Form.Label><FaFileAlt /> Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            placeholder="Write a brief description about yourself"
                        />
                    </Form.Group>
                </Row>
            </div>

            <div className="form-section">
                <h3>Payment Information</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>
                            <FaCreditCard /> Payment Method
                        </Form.Label>
                        <Form.Select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="paypal">PayPal</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Select your preferred method for receiving payments.
                        </Form.Text>
                    </Form.Group>

                    {formData.paymentMethod && (
                        <Form.Group as={Col} md="6">
                            <Form.Label>
                                <FaCreditCard /> Account Number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder={`Enter your ${formData.paymentMethod === 'paypal' ? 'PayPal email' :
                                    formData.paymentMethod === 'credit_card' ? 'card number' : 'bank account number'}`}
                            />
                            <Form.Text className="text-muted">
                                {formData.paymentMethod === 'credit_card' && 'Your card information is securely stored.'}
                                {formData.paymentMethod === 'bank_transfer' && 'Please provide your complete bank account details.'}
                                {formData.paymentMethod === 'paypal' && 'Enter the email associated with your PayPal account.'}
                            </Form.Text>
                        </Form.Group>
                    )}
                </Row>
            </div>

            <div className="form-section">
                <h3>Profile & Identity Images</h3>
                <p className="section-description">
                    Upload a profile picture and identity documents to verify your account.
                    Verification improves your account security and unlocks additional features.
                </p>

                <Row className="mb-3">
                    <Col md={6}>
                        <ImageUpload
                            label="Profile Picture"
                            name="img"
                            currentImage={formData.img}
                            onChange={handleFileChange}
                            description="This image will be displayed on your profile"
                        />
                    </Col>
                </Row>

                <div className="identity-documents">
                    <h4>Identity Verification Documents</h4>
                    <p className="verification-note">
                        Please provide clear, unobstructed images of your identification documents.
                        At least one form of ID is required for account verification.
                    </p>

                    <Row className="mb-3">
                        <Col md={4}>
                            <ImageUpload
                                label="ID Card (Front)"
                                name="imgRecto"
                                currentImage={formData.imgRecto}
                                onChange={handleFileChange}
                                description="Front side of your ID card"
                            />
                        </Col>

                        <Col md={4}>
                            <ImageUpload
                                label="ID Card (Back)"
                                name="imgVerso"
                                currentImage={formData.imgVerso}
                                onChange={handleFileChange}
                                description="Back side of your ID card"
                            />
                        </Col>

                        <Col md={4}>
                            <ImageUpload
                                label="Passport"
                                name="imgPassport"
                                currentImage={formData.imgPassport}
                                onChange={handleFileChange}
                                description="Main page of your passport"
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="form-actions">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="secondary" className="ms-2" onClick={resetForm}>
                    Cancel
                </Button>
            </div>
        </Form>
    );
};

export default ProfileEdit;
