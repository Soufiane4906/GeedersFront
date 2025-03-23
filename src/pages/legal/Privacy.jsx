import React from 'react';
import Footer from '../../components/footer/Footer';
import './Privacy.scss';

const Privacy = () => {
    return (
        <div className="privacy-page">
            <div className="container">
                <div className="title-area text-center">
                    <h2 className="sec-title">Privacy Policy</h2>
                    <div className="sec-line"></div>
                    <p className="sec-text">Last Updated: March 23, 2025</p>
                </div>

                <div className="privacy-content mt-5">
                    <div className="privacy-section">
                        <h3>1. Introduction</h3>
                        <p>At BlaBlaTrip, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, website, or mobile application. Please read this policy carefully to understand our practices regarding your personal data.</p>
                    </div>

                    <div className="privacy-section">
                        <h3>2. Information We Collect</h3>
                        <p>We may collect the following types of information:</p>
                        <ul className="about-list1">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, billing address, payment information, and other identifiers</li>
                            <li><strong>Profile Information:</strong> Profile photos, preferences, and travel history</li>
                            <li><strong>Communication Data:</strong> Messages exchanged with other users or our customer support team</li>
                            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                            <li><strong>Location Data:</strong> Precise or approximate location when you use location-based features</li>
                            <li><strong>Usage Information:</strong> How you interact with our Services, including clicks, views, and search queries</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <h3>3. How We Use Your Information</h3>
                        <p>We use your information for the following purposes:</p>
                        <ul className="about-list1">
                            <li>Providing, maintaining, and improving our Services</li>
                            <li>Processing transactions and managing your account</li>
                            <li>Communicating with you about our Services</li>
                            <li>Personalizing your experience</li>
                            <li>Ensuring safety and security</li>
                            <li>Complying with legal obligations</li>
                            <li>For our Ambassador Program, including tracking referrals and calculating rewards</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <h3>4. Sharing Your Information</h3>
                        <p>We may share your information with:</p>
                        <ul className="about-list1">
                            <li>Service providers who perform services on our behalf</li>
                            <li>Other users, as necessary to facilitate bookings</li>
                            <li>Business partners, with your consent</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </div>

                    <div className="privacy-section">
                        <h3>5. Your Rights and Choices</h3>
                        <p>Depending on your location, you may have the right to:</p>
                        <ul className="about-list1">
                            <li>Access, correct, or delete your personal information</li>
                            <li>Object to certain processing of your data</li>
                            <li>Withdraw consent where applicable</li>
                            <li>Request portability of your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                        <p>To exercise these rights, please contact us using the information provided at the end of this policy.</p>
                    </div>

                    <div className="privacy-section">
                        <h3>6. Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                    </div>

                    <div className="privacy-section">
                        <h3>7. Changes to This Policy</h3>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </div>

                    <div className="privacy-section">
                        <h3>8. Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:<br />
                            <strong>StarkX LLC</strong><br />
                            30 N Gould St Ste R<br />
                            Sheridan, WY 82801<br />
                            <strong>EIN:</strong> 98-1845762<br />
                            <strong>Email:</strong> privacy@blablatrip.com
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Privacy;