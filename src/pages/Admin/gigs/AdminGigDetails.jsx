import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import './AdminGigs.scss';

const AdminGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchGigs();
        fetchCountries();
    }, [navigate]);

    const fetchGigs = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get("/admin/gigs");
            setGigs(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching gigs:", err);
            setError("Failed to load services");
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await newRequest.get("/countries");
            setCountries(response.data.map(country => country.name));
        } catch (err) {
            console.error("Error fetching countries:", err);
        }
    };

    const handleDeleteGig = async (gigId) => {
        if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            try {
                await newRequest.delete(`/admin/gigs/${gigId}`);
                fetchGigs(); // Refresh the gig list
            } catch (err) {
                console.error("Error deleting gig:", err);
                setError("Failed to delete service");
            }
        }
    };

    const handleFeaturedToggle = async (gigId, isFeatured) => {
        try {
            await newRequest.patch(`/admin/gigs/${gigId}/featured`, { isFeatured });
            fetchGigs(); // Refresh the gig list
        } catch (err) {
            console.error("Error updating gig featured status:", err);
            setError("Failed to update service status");
        }
    };

    const filteredGigs = gigs.filter(gig => {
        // Apply country filter
        if (countryFilter && gig.country !== countryFilter) return false;

        // Apply search query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            gig.title?.toLowerCase().includes(query) ||
            gig.country?.toLowerCase().includes(query) ||
            gig.city?.toLowerCase().includes(query) ||
            gig.userId?.toLowerCase().includes(query)
        );
    });

    if (loading) return <div className="admin-loading">Loading services...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-gigs">
            <div className="container">
                <div className="admin-header">
                    <h1>Service Management</h1>
                    <button className="back-btn" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="filters-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="country-filter">
                        <select
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            className="country-select"
                        >
                            <option value="">All Countries</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="gigs-table-container">
                    <table className="gigs-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Ambassador</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Sales</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredGigs.map(gig => (
                            <tr key={gig._id}>
                                <td>{gig._id.substring(0, 8)}...</td>
                                <td>{gig.title}</td>
                                <td>{gig.username || 'Unknown'}</td>
                                <td>${gig.price}</td>
                                <td>{`${gig.city}, ${gig.country}`}</td>
                                <td>{gig.sales}</td>
                                <td>
                                    <div className="featured-toggle">
                                        <input
                                            type="checkbox"
                                            id={`featured-${gig._id}`}
                                            checked={gig.isFeatured || false}
                                            onChange={() => handleFeaturedToggle(gig._id, !gig.isFeatured)}
                                        />
                                        <label htmlFor={`featured-${gig._id}`}>
                                            {gig.isFeatured ? 'Yes' : 'No'}
                                        </label>
                                    </div>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/admin/gigs/${gig._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/admin/gigs/${gig._id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteGig(gig._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredGigs.length === 0 && (
                    <div className="no-results">No services found matching your criteria</div>
                )}
            </div>
        </div>
    );
};

export default AdminGigs;