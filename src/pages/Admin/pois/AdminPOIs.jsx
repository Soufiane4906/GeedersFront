import React, { useState, useEffect } from "react";
import newRequest from "../../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminPOIs.scss';

const AdminPOIs = () => {
    const [pois, setPOIs] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        _id: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch POIs
    const fetchPOIs = async () => {
        setIsLoading(true);
        try {
            const response = await newRequest.get("/pois");
            setPOIs(response.data.pois || []);
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch POIs');
            setIsLoading(false);
            toast.error('Failed to load Points of Interest');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = formData._id ? 'put' : 'post';
            const url = formData._id ? `/pois/${formData._id}` : '/pois';

            const requestBody = {
                name: formData.name,
                image: formData.image
            };

            await newRequest[method](url, requestBody);
            toast.success(`POI ${formData._id ? 'updated' : 'created'} successfully`);

            await fetchPOIs();
            // Reset form
            setFormData({
                name: '',
                image: '',
                _id: null
            });
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit POI');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit POI
    const handleEditPOI = (poi) => {
        setFormData({
            name: poi.name,
            image: poi.image,
            _id: poi._id
        });
    };

    // Delete POI
    const handleDeletePOI = async (poiId) => {
        try {
            await newRequest.delete(`/pois/${poiId}`);
            toast.success('POI deleted successfully');
            await fetchPOIs();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete POI');
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchPOIs();
    }, []);

    if (isLoading) return (
        <div className="admin-pois__loading">
            Loading Points of Interest...
        </div>
    );

    if (error) return (
        <div className="admin-pois__error">
            Error: {error}
        </div>
    );

    return (
        <div className="admin-pois">
            <ToastContainer />
            <h1 className="section-title">Manage Points of Interest</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="POI Name"
                    required
                    className="form-input"
                />
                <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                    required
                    className="form-input"
                />
                <div className="form-buttons">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {formData._id ? 'Update POI' : 'Create POI'}
                    </button>
                    {formData._id && (
                        <button
                            type="button"
                            onClick={() => setFormData({
                                name: '',
                                image: '',
                                _id: null
                            })}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* POI List */}
            <div className="pois-list">
                {pois.length === 0 ? (
                    <div className="empty-message">No POIs found</div>
                ) : (
                    pois.map(poi => (
                        <div key={poi._id} className="poi-item">
                            <div className="poi-header">
                                <img
                                    src={poi.image}
                                    alt={poi.name}
                                    className="poi-image"
                                />
                                <h3>{poi.name}</h3>
                                <div className="poi-actions">
                                    <button
                                        onClick={() => handleEditPOI(poi)}
                                        className="btn btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePOI(poi._id)}
                                        className="btn btn-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPOIs;