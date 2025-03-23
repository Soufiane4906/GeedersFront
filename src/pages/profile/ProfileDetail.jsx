import React from 'react';
import {
    FaUserCircle,
    FaEnvelope,
    FaGlobe,
    FaMapMarkerAlt,
    FaFileAlt,
    FaLanguage,
    FaPhone,
    FaIdCard,
    FaCreditCard
} from 'react-icons/fa';

const ProfileDetail = ({ user }) => {
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

                <div className="info-item">
                    <FaLanguage className="icon" />
                    <span className="label">Languages:</span>
                    <span className="value">
            {user.languages && user.languages.length > 0
                ? user.languages.join(', ')
                : 'None specified'}
          </span>
                </div>

                <div className="info-item">
                    <FaPhone className="icon" />
                    <span className="label">Phone:</span>
                    <span className="value">{user.phone || 'Not specified'}</span>
                </div>

                <div className="info-item">
                    <FaIdCard className="icon" />
                    <span className="label">Description:</span>
                    <span className="value">{user.desc || 'No description provided'}</span>
                </div>

                <div className="info-item">
                    <FaCreditCard className="icon" />
                    <span className="label">Payment Method:</span>
                    <span className="value">{user.paymentMethod || 'Not specified'}</span>
                </div>

                {user.paymentMethod && (
                    <div className="info-item">
                        <FaCreditCard className="icon" />
                        <span className="label">Account Number:</span>
                        <span className="value">
              {user.accountNumber ? '••••' + user.accountNumber.slice(-4) : 'Not provided'}
            </span>
                    </div>
                )}
            </div>

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