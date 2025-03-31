import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import './AdminGigs.scss';

const AdminGigEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: 0,
        coverImage: '',
        images: [],
        shortTitle: '',
        shortDescription: '',
        deliveryTime: 0,
        revisionNumber: 0,
        features: [],
        isActive: true,
        isFeatured: false,
        country: ''
    });

    const [categories, setCategories] = useState([]);
    const [newFeature, setNewFeature] = useState('');
    const [newImage, setNewImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchGigData();
        fetchCategories();
    }, [id]);

    const fetchGigData = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get(`/admin/gigs/${id}`);
            setFormData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch gig details");
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await newRequest.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleAddFeature = () => {
        if (newFeature.trim() !== '') {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleAddImage = () => {
        if (newImage.trim() !== '') {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImage.trim()]
            }));
            setNewImage('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSetCoverImage = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            coverImage: imageUrl
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadingImage(true);
            const res = await newRequest.post('/upload', formData);
            const imageUrl = res.data.url;

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageUrl]
            }));

            // If no cover image is set, set this as cover
            if (!formData.coverImage) {
                setFormData(prev => ({
                    ...prev,
                    coverImage: imageUrl
                }));
            }

            setUploadingImage(false);
        } catch (err) {
            setError("Error uploading image. Please try again.");
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await newRequest.put(`/admin/gigs/${id}`, formData);
            setSuccess("Gig updated successfully!");
            setLoading(false);

            // Redirect after short delay
            setTimeout(() => {
                navigate(`/admin/gigs/${id}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update gig");
            setLoading(false);
        }
    };

    if (loading && !formData.title) {
        return (
            <div className="admin-gig-edit">
                <div className="container">
                    <div className="loading">Loading gig data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-gig-edit">
            <div className="container">
                <div className="admin-header">
                    <h1>Edit Service</h1>
                    <div className="header-actions">
                        <button
                            className="secondary-btn"
                            onClick={() => navigate(`/admin/gigs/${id}`)}
                        >
                            Cancel
                        </button>
                        <button
                            className="back-btn"
                            onClick={() => navigate('/admin/gigs')}
                        >
                            Back to Services
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="gig-edit-form">
                    <div className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleNumberChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="deliveryTime">Delivery Time (days)</label>
                                <input
                                    type="number"
                                    id="deliveryTime"
                                    name="deliveryTime"
                                    value={formData.deliveryTime}
                                    onChange={handleNumberChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="revisionNumber">Revisions</label>
                                <input
                                    type="number"
                                    id="revisionNumber"
                                    name="revisionNumber"
                                    value={formData.revisionNumber}
                                    onChange={handleNumberChange}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Service Package</h2>

                        <div className="form-group">
                            <label htmlFor="shortTitle">Package Title</label>
                            <input
                                type="text"
                                id="shortTitle"
                                name="shortTitle"
                                value={formData.shortTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="shortDescription">Package Description</label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Features</label>
                            <div className="add-item-input">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Add a feature"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="add-btn"
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="items-list">
                                {formData.features.map((feature, index) => (
                                    <li key={index}>
                                        <span>{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Images</h2>

                        <div className="form-group">
                            <label>Upload Image</label>
                            <div className="file-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                                {uploadingImage && <span>Uploading...</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Add Image URL</label>
                            <div className="add-item-input">
                                <input
                                    type="text"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    placeholder="Image URL"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="add-btn"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="images-grid">
                            {formData.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`image-item ${image === formData.coverImage ? 'cover' : ''}`}
                                >
                                    <img src={image} alt={`Service image ${index + 1}`} />
                                    <div className="image-actions">
                                        {image !== formData.coverImage && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetCoverImage(image)}
                                                className="cover-btn"
                                            >
                                                Set as Cover
                                            </button>
                                        )}
                                        {image === formData.coverImage && (
                                            <span className="cover-badge">Cover Image</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Status</h2>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            <label htmlFor="isActive">Active</label>
                        </div>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            <label htmlFor="isFeatured">Featured</label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(`/admin/gigs/${id}`)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminGigEdit;
