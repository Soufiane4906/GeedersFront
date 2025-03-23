import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { languageOptions } from '../../utils/options.js';
import upload from "../../utils/upload.js";
import {
    FaUser,
    FaEnvelope,
    FaGlobe,
    FaFileAlt,
    FaCity,
    FaPhone,
    FaCreditCard,
    FaImage
} from 'react-icons/fa';

import ImageUpload from './ImageUpload';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData((prev) => ({
            ...prev,
            languages: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
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
            toast.success("Profile updated successfully!");
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

                    <Form.Group as={Col} md="6">
                        <Form.Label><FaFileAlt /> Languages</Form.Label>
                        <Select
                            name="languages"
                            options={languageOptions}
                            isMulti
                            value={formData.languages.map(lang => languageOptions.find(option => option.value === lang) || { value: lang, label: lang })}
                            onChange={handleSelectChange}
                            placeholder="Select languages you speak"
                            className="language-select"
                        />
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