import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import newRequest from '../../../utils/newRequest.js';
import './AdminGigs.scss';

const AdminGigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState(null);
    const [stats, setStats] = useState({
        views: 0,
        orders: 0,
        revenue: 0,
        averageRating: 0
    });
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('details');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchGigData();
    }, [id]);

    const fetchGigData = async () => {
        try {
            setLoading(true);

            // Fetch gig details
            const gigResponse = await newRequest.get(`/admin/gigs/${id}`);
            setGig(gigResponse.data);

            // Fetch gig owner
            const ownerResponse = await newRequest.get(`/users/${gigResponse.data.userId}`);
            setOwner(ownerResponse.data);

            // Fetch gig stats
            const statsResponse = await newRequest.get(`/admin/gigs/${id}/stats`);
            setStats(statsResponse.data);

            // Fetch reviews
            const reviewsResponse = await newRequest.get(`/admin/gigs/${id}/reviews`);
            setReviews(reviewsResponse.data);

            // Fetch orders
            const ordersResponse = await newRequest.get(`/admin/gigs/${id}/orders`);
            setOrders(ordersResponse.data);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch gig details");
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        try {
            await newRequest.patch(`/admin/gigs/${id}/status`, {
                isActive: !gig.isActive
            });
            setGig(prev => ({
                ...prev,
                isActive: !prev.isActive
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleFeaturedToggle = async () => {
        try {
            await newRequest.patch(`/admin/gigs/${id}/featured`, {
                isFeatured: !gig.isFeatured
            });
            setGig(prev => ({
                ...prev,
                isFeatured: !prev.isFeatured
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update featured status");
        }
    };

    const handleDeleteGig = async () => {
        try {
            await newRequest.delete(`/admin/gigs/${id}`);
            navigate('/admin/gigs');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete gig");
            setConfirmModalOpen(false);
        }
    };

    const ConfirmModal = () => {
        if (!confirmModalOpen) return null;

        return (
            <div className="confirm-modal">
                <div className="confirm-modal-content">
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to delete this service? This action cannot be undone.</p>
                    <div className="confirm-modal-actions">
                        <button className="cancel-btn" onClick={() => setConfirmModalOpen(false)}>Cancel</button>
                        <button className="confirm-btn" onClick={handleDeleteGig}>Delete</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="admin-gig-details">
                <div className="container">
                    <div className="loading">Loading gig details...</div>
                </div>
            </div>
        );
    }

    if (!gig) {
        return (
            <div className="admin-gig-details">
                <div className="container">
                    <div className="error-message">Service not found</div>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/admin/gigs')}
                    >
                        Back to Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-gig-details">
            <div className="container">
                <div className="admin-header">
                    <h1>Service Details</h1>
                    <div className="header-actions">
                        <button
                            className="edit-btn"
                            onClick={() => navigate(`/admin/gigs/${id}/edit`)}
                        >
                            Edit Service
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

                <div className="gig-header">
                    <div className="gig-title-section">
                        <h2>{gig.title}</h2>
                        <div className="gig-badges">
                            <span
                                className={`status-badge ${gig.isActive ? 'active' : 'inactive'}`}
                                onClick={handleStatusToggle}
                            >
                                {gig.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span
                                className={`featured-badge ${gig.isFeatured ? 'featured' : ''}`}
                                onClick={handleFeaturedToggle}
                            >
                                {gig.isFeatured ? 'Featured' : 'Regular'}
                            </span>
                        </div>
                    </div>

                    <div className="gig-meta">
                        <div className="meta-item">
                            <span className="meta-label">ID:</span>
                            <span className="meta-value">{gig._id}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">{format(new Date(gig.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Price:</span>
                            <span className="meta-value">${gig.price}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">{gig.cat}</span>
                        </div>
                    </div>
                </div>

                <div className="gig-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
                        onClick={() => setActiveTab('images')}
                    >
                        Images
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews ({reviews.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders ({orders.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'details' && (
                        <div className="details-tab">
                            <div className="details-grid">
                                <div className="details-col">
                                    <div className="details-section">
                                        <h3>Service Information</h3>
                                        <div className="detail-item">
                                            <h4>Description</h4>
                                            <p>{gig.desc}</p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Package Details</h4>
                                            <p><strong>Title:</strong> {gig.shortTitle}</p>
                                            <p><strong>Description:</strong> {gig.shortDesc}</p>
                                            <p><strong>Delivery Time:</strong> {gig.deliveryTime} days</p>
                                            <p><strong>Revisions:</strong> {gig.revisionNumber}</p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Features</h4>
                                            {gig.features && gig.features.length > 0 ? (
                                                <ul className="features-list">
                                                    {gig.features.map((feature, index) => (
                                                        <li key={index}>{feature}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No features listed</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="details-col">
                                    <div className="details-section">
                                        <h3>Owner Information</h3>
                                        {owner ? (
                                            <>
                                                <div className="owner-info">
                                                    <img
                                                        src={owner.img || "/img/noavatar.jpg"}
                                                        alt={owner.username}
                                                        className="owner-avatar"
                                                    />
                                                    <div>
                                                        <h4>{owner.username}</h4>
                                                        <p>{owner.email}</p>
                                                        <Link to={`/admin/users/${owner._id}`} className="view-user-link">
                                                            View User Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p>Loading owner information...</p>
                                        )}
                                    </div>

                                    <div className="details-section">
                                        <h3>Performance Statistics</h3>
                                        <div className="stats-grid">
                                            <div className="stat-box">
                                                <span className="stat-value">{stats.views}</span>
                                                <span className="stat-label">Views</span>
                                            </div>
                                            <div className="stat-box">
                                                <span className="stat-value">{stats.orders}</span>
                                                <span className="stat-label">Orders</span>
                                            </div>
                                            <div className="stat-box">
                                                <span className="stat-value">${stats.revenue}</span>
                                                <span className="stat-label">Revenue</span>
                                            </div>
                                            <div className="stat-box">
                                                <span className="stat-value">{stats.averageRating.toFixed(1)}</span>
                                                <span className="stat-label">Avg. Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="danger-zone">
                                <h3>Danger Zone</h3>
                                <p>Once you delete a service, there is no going back. Please be certain.</p>
                                <button
                                    className="delete-btn"
                                    onClick={() => setConfirmModalOpen(true)}
                                >
                                    Delete Service
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="images-tab">
                            <h3>Service Images</h3>
                            <div className="images-gallery">
                                {gig.images && gig.images.length > 0 ? (
                                    gig.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`gallery-item ${image === gig.cover ? 'cover' : ''}`}
                                        >
                                            <img src={image} alt={`Service image ${index + 1}`} />
                                            {image === gig.cover && (
                                                <span className="cover-badge">Cover Image</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-tab">
                            <h3>Service Reviews</h3>
                            {reviews.length > 0 ? (
                                <div className="reviews-list">
                                    {reviews.map(review => (
                                        <div key={review._id} className="review-item">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <img
                                                        src={review.user?.img || "/img/noavatar.jpg"}
                                                        alt={review.user?.username}
                                                    />
                                                    <div>
                                                        <h4>{review.user?.username || "Anonymous"}</h4>
                                                        <span className="review-date">
                                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {Array(5).fill().map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`star ${i < review.star ? 'filled' : ''}`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                    <span className="rating-value">{review.star}</span>
                                                </div>
                                            </div>
                                            <p className="review-desc">{review.desc}</p>
                                            <div className="review-actions">
                                                <Link to={`/admin/reviews/${review._id}`} className="view-review-link">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No reviews yet</p>
                            )}
                        </div>

                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-tab">
                            <h3>Service Orders</h3>
                            {orders.length > 0 ? (
                                <div className="orders-table-wrapper">
                                    <table className="orders-table">
                                        <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Buyer</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order._id.substring(0, 8)}...</td>
                                                <td>{order.buyer?.username || "Unknown"}</td>
                                                <td>{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                                                <td>${order.price}</td>
                                                <td>
                                                        <span className={`status-pill ${order.status}`}>
                                                            {order.status}
                                                        </span>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/orders/${order._id}`} className="view-link">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No orders yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal />
        </div>
    );
};

export default AdminGigDetails;
