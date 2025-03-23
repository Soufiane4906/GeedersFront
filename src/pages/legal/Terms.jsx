import React from 'react';
import Footer from '../../components/footer/Footer';
import './Terms.scss';

const Terms = () => {
    return (
        <div className="terms-page">
            <div className="container">
                <div className="title-area text-center">
                    <h2 className="sec-title">Terms and Conditions</h2>
                    <div className="sec-line"></div>
                    <p className="sec-text">Last Updated: March 23, 2025</p>
                </div>

                <div className="terms-content mt-5">
                    <div className="terms-section">
                        <h3>1. Acceptance of Terms</h3>
                        <p>By accessing or using BlaBlaTrip's services, website, or mobile application (collectively, the "Services"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Services.</p>
                    </div>

                    <div className="terms-section">
                        <h3>2. User Accounts</h3>
                        <p>To use certain features of our Services, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update such information as necessary.</p>
                    </div>

                    <div className="terms-section">
                        <h3>3. User Conduct</h3>
                        <p>When using our Services, you agree not to:</p>
                        <ul className="about-list1">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on the rights of others</li>
                            <li>Post false, misleading, or fraudulent content</li>
                            <li>Attempt to access or tamper with non-public areas of our Services</li>
                            <li>Use our Services for any illegal or unauthorized purpose</li>
                            <li>Harass, abuse, or harm another person</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h3>4. Ambassador Program</h3>
                        <p>BlaBlaTrip offers an Ambassador Program subject to the following terms:</p>
                        <ul className="about-list1">
                            <li>Ambassadors must accurately represent BlaBlaTrip's services</li>
                            <li>Compensation is based on successful referrals as defined in the Ambassador Agreement</li>
                            <li>BlaBlaTrip reserves the right to terminate ambassador status at any time</li>
                            <li>Ambassadors must comply with all applicable laws regarding disclosures and endorsements</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h3>5. Bookings and Transactions</h3>
                        <p>When you make a booking through our Services, you agree to pay all fees and charges associated with that booking. Prices and availability are subject to change without notice. Cancellation policies vary depending on the service provider and will be clearly displayed before you complete your booking.</p>
                    </div>

                    <div className="terms-section">
                        <h3>6. Limitation of Liability</h3>
                        <p>To the maximum extent permitted by law, BlaBlaTrip and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your access to or use of our Services.</p>
                    </div>

                    <div className="terms-section">
                        <h3>7. Modifications to Terms</h3>
                        <p>BlaBlaTrip reserves the right to modify these Terms and Conditions at any time. We will provide notice of significant changes by posting the updated terms on our website or through other communications. Your continued use of our Services after such changes constitutes your acceptance of the new terms.</p>
                    </div>

                    <div className="terms-section">
                        <h3>8. Contact Information</h3>
                        <p>
                            If you have any questions about these Terms and Conditions, please contact us at:<br />
                            <strong>StarkX LLC</strong><br />
                            30 N Gould St Ste R<br />
                            Sheridan, WY 82801<br />
                            <strong>EIN:</strong> 98-1845762<br />
                            <strong>Email:</strong> support@blablatrip.com
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;