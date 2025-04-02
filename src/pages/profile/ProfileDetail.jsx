import React, { useState, useEffect } from 'react';
import {
    FaUserCircle,
    FaEnvelope,
    FaGlobe,
    FaMapMarkerAlt,
    FaFileAlt,
    FaLanguage,
    FaPhone,
    FaIdCard,
    FaCreditCard,
    FaQuoteLeft,
    FaQuoteRight
} from 'react-icons/fa';
import newRequest from "../../utils/newRequest.js";

const ProfileDetail = ({ user }) => {
    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch languages from API
    useEffect(() => {
        const fetchLanguages = async () => {
            setIsLoading(true);
            try {
                const languagesResponse = await newRequest.get("/languages");
                setLanguages(languagesResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch languages", error);
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

    // Get language details by ID
    const getLanguageById = (languageId) => {
        return languages.find(lang => lang._id === languageId) || { langue: languageId, flag: null };
    };

    return (
        <div className="profile-detail">
            <h2>Profile Details</h2>
            <div className="profile-info">
                <div className="info-item">
                    <FaUserCircle className="icon" />
                    <span className="label">Username:</span>
                    <span className="value">{user.username}</span>
                </div>

                <div className="info-item">
                    <FaEnvelope className="icon" />
                    <span className="label">Email:</span>
                    <span className="value">{user.email}</span>
                </div>

                <div className="info-item">
                    <FaGlobe className="icon" />
                    <span className="label">Country:</span>
                    <span className="value">{user.country || 'Not specified'}</span>
                </div>

                <div className="info-item">
                    <FaMapMarkerAlt className="icon" />
                    <span className="label">City:</span>
                    <span className="value">{user.city || 'Not specified'}</span>
                </div>

                <div className="info-item">
                    <FaFileAlt className="icon" />
                    <span className="label">Role:</span>
                    <span className="value">{user.isAmbassador ? 'Ambassador' : 'Guest'}</span>
                </div>

                <div className="info-item phone-item">
                    <FaPhone className="icon" />
                    <span className="label">Phone:</span>
                    <span className="value">{user.phone || 'Not specified'}</span>
                </div>

                <div className="info-item payment-item">
                    <FaCreditCard className="icon" />
                    <span className="label">Payment Method:</span>
                    <span className="value">{user.paymentMethod || 'Not specified'}</span>
                </div>

                {user.paymentMethod && (
                    <div className="info-item account-item">
                        <FaCreditCard className="icon" />
                        <span className="label">Account Number:</span>
                        <span className="value">
                            {user.accountNumber ? '••••' + user.accountNumber.slice(-4) : 'Not provided'}
                        </span>
                    </div>
                )}
            </div>

            {/* Languages with flags - new section */}
            <div className="languages-section">
                <h3><FaLanguage className="section-icon" /> Languages</h3>
                {isLoading ? (
                    <div className="loading-languages">Loading languages...</div>
                ) : user.languages && user.languages.length > 0 ? (
                    <div className="language-flags-container">
                        {user.languages.map(langId => {
                            const language = getLanguageById(langId);
                            return (
                                <div key={langId} className="language-badge">
                                    {language.flag && (
                                        <img
                                            src={getFlagUrl(language.flag)}
                                            alt={language.langue}
                                            className="language-flag"
                                        />
                                    )}
                                    <span className="language-name">{language.langue}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-languages">No languages specified</div>
                )}
            </div>

            {/* Description with cool styling */}
            {user.desc && (
                <div className="description-section">
                    <h3><FaIdCard className="section-icon" /> About Me</h3>
                    <div className="description-content">
                        <FaQuoteLeft className="quote-icon quote-left" />
                        <div className="description-text">{user.desc}</div>
                        <FaQuoteRight className="quote-icon quote-right" />
                    </div>
                </div>
            )}

            <div className="identity-verification-section">
                <h3>Identity Verification</h3>

                {user.imgRecto || user.imgVerso || user.imgPassport ? (
                    <div className="identity-images">
                        {user.imgRecto && (
                            <div className="id-image-container">
                                <h4>ID Card (Front)</h4>
                                <img src={user.imgRecto} alt="Identity Card Front" />
                            </div>
                        )}

                        {user.imgVerso && (
                            <div className="id-image-container">
                                <h4>ID Card (Back)</h4>
                                <img src={user.imgVerso} alt="Identity Card Back" />
                            </div>
                        )}

                        {user.imgPassport && (
                            <div className="id-image-container">
                                <h4>Passport</h4>
                                <img src={user.imgPassport} alt="Passport" />
                            </div>
                        )}

                        <div className="verification-status">
                            <div className="status-badge verified">Verification Submitted</div>
                            <p>Your identity documents are being reviewed. This process typically takes 1-3 business days.</p>
                        </div>
                    </div>
                ) : (
                    <div className="verification-notice">
                        <div className="status-badge pending">Verification Required</div>
                        <p>Your account is not yet verified. Please upload at least one form of identification (ID card front/back or passport) to access all features and ensure account security.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => document.querySelector('[data-tab="edit"]').click()}
                        >
                            Upload Identity Documents
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDetail;
