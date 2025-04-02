import React, { useState, useEffect } from "react";
import newRequest from "../../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminLanguages.scss';

const AdminLanguages = () => {
    const [languages, setLanguages] = useState([]);
    const [formData, setFormData] = useState({
        langue: '',
        flag: '',
        _id: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to get flag URL from language code
    const getFlagUrl = (flagCode) => {
        // If it's already a full URL, return it
        if (flagCode.startsWith('http')) {
            return flagCode;
        }

        // Otherwise, assume it's a country code and build the flag URL
        // Using flagcdn.com which accepts 2-letter country codes
        const code = flagCode.toLowerCase();
        return `https://flagcdn.com/w320/${code}.png`;
    };

    // Fetch Languages
    const fetchLanguages = async () => {
        setIsLoading(true);
        try {
            const response = await newRequest.get("/languages");
            setLanguages(response.data || []);
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch languages');
            setIsLoading(false);
            toast.error('Failed to load languages');
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
            const url = formData._id ? `/languages/${formData._id}` : '/languages';

            const requestBody = {
                langue: formData.langue,
                flag: formData.flag // Store as entered (can be code or URL)
            };

            await newRequest[method](url, requestBody);
            toast.success(`Language ${formData._id ? 'updated' : 'created'} successfully`);

            await fetchLanguages();
            // Reset form
            setFormData({
                langue: '',
                flag: '',
                _id: null
            });
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit language');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit Language
    const handleEditLanguage = (language) => {
        setFormData({
            langue: language.langue,
            flag: language.flag,
            _id: language._id
        });
    };

    // Delete Language
    const handleDeleteLanguage = async (languageId) => {
        try {
            await newRequest.delete(`/languages/${languageId}`);
            toast.success('Language deleted successfully');
            await fetchLanguages();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete language');
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchLanguages();
    }, []);

    if (isLoading) return (
        <div className="admin-languages__loading">
            Loading Languages...
        </div>
    );

    if (error) return (
        <div className="admin-languages__error">
            Error: {error}
        </div>
    );

    return (
        <div className="admin-languages">
            <ToastContainer />
            <h1 className="section-title">Manage Languages</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    name="langue"
                    value={formData.langue}
                    onChange={handleChange}
                    placeholder="Language Name (e.g. English, Français)"
                    required
                    className="form-input"
                />
                <input
                    name="flag"
                    value={formData.flag}
                    onChange={handleChange}
                    placeholder="Flag code (e.g. us, fr) or full URL"
                    required
                    className="form-input"
                />
                {formData.flag && (
                    <div className="flag-preview">
                        <p>Flag Preview:</p>
                        <img
                            src={getFlagUrl(formData.flag)}
                            alt="Flag preview"
                            className="preview-img"

                        />
                    </div>
                )}
                <div className="form-buttons">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {formData._id ? 'Update Language' : 'Create Language'}
                    </button>
                    {formData._id && (
                        <button
                            type="button"
                            onClick={() => setFormData({
                                langue: '',
                                flag: '',
                                _id: null
                            })}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Language List */}
            <div className="languages-list">
                {languages.length === 0 ? (
                    <div className="empty-message">No languages found</div>
                ) : (
                    languages.map(language => (
                        <div key={language._id} className="language-item">
                            <div className="language-header">
                                <div className="language-flag">
                                    <img
                                        src={getFlagUrl(language.flag)}
                                        alt={language.langue}
                                        className="flag-icon"

                                    />
                                </div>
                                <h3>{language.langue}</h3>
                                <div className="language-actions">
                                    <button
                                        onClick={() => handleEditLanguage(language)}
                                        className="btn btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLanguage(language._id)}
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

export default AdminLanguages;