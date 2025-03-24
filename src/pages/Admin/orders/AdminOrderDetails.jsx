import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import { format } from 'date-fns';
import {
    generateOrderPDF,
    generateOrderExcel,
    printOrder
} from './utils/orderExport.js';
import './AdminOrdersDetails.scss';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [ambassador, setAmbassador] = useState(null);
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchOrderDetails();
    }, [navigate, id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportDropdownOpen && !event.target.closest('.export-dropdown')) {
                setExportDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [exportDropdownOpen]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get(`/adminOrders/${id}`);
            setOrder(response.data.order);
            setAmbassador(response.data.ambassador);
            setGuest(response.data.guest);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError("Failed to load order details");
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        try {
            await newRequest.patch(`/adminOrders/${id}/status`, {
                isCompleted: !order.isCompleted
            });
            setOrder({
                ...order,
                isCompleted: !order.isCompleted
            });
        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update order status");
        }
    };

    const handleDeleteOrder = async () => {
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                await newRequest.delete(`/adminOrders/${id}`);
                navigate('/admin/orders');
            } catch (err) {
                console.error("Error deleting order:", err);
                setError("Failed to delete order");
            }
        }
    };

    const handleExportPDF = () => {
        if (order) {
            generateOrderPDF(order, ambassador, guest);
            setExportDropdownOpen(false);
        }
    };

    const handleExportExcel = () => {
        if (order) {
            generateOrderExcel(order, ambassador, guest);
            setExportDropdownOpen(false);
        }
    };

    const handlePrintOrder = () => {
        if (order) {
            printOrder(order, ambassador, guest);
            setExportDropdownOpen(false);
        }
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    if (loading) return <div className="admin-loading">Loading order details...</div>;
    if (error) return <div className="admin-error">{error}</div>;
    if (!order) return <div className="admin-error">Order not found</div>;

    return (
        <div className="admin-order-details">
            <div className="container">
                <div className="admin-header">
                    <h1>Order Details</h1>
                    <div className="header-buttons">
                        <button className="back-btn" onClick={() => navigate('/admin/orders')}>
                            Back to Orders
                        </button>
                        <div className="export-dropdown">
                            <button className="dropdown-toggle" onClick={toggleExportDropdown}>
                                <i className="fas fa-file-export"></i> Export
                            </button>
                            <div className={`dropdown-menu ${exportDropdownOpen ? 'show' : ''}`}>
                                <button onClick={handleExportPDF}>
                                    <i className="fas fa-file-pdf"></i> Export as PDF
                                </button>
                                <button onClick={handleExportExcel}>
                                    <i className="fas fa-file-excel"></i> Export as Excel
                                </button>
                                <button onClick={handlePrintOrder}>
                                    <i className="fas fa-print"></i> Print Order
                                </button>
                            </div>
                        </div>
                        <button
                            className="delete-btn"
                            onClick={handleDeleteOrder}
                        >
                            <i className="fas fa-trash"></i> Delete Order
                        </button>
                    </div>
                </div>

                <div className="order-details-card">
                    <div className="card-header">
                        <h2>{order.title}</h2>
                        <div className={`status-badge ${order.isCompleted ? 'completed' : 'pending'}`}>
                            {order.isCompleted ? 'Completed' : 'Pending'}
                        </div>
                    </div>

                    <div className="order-info">
                        <div className="order-row">
                            <span className="label">Order ID:</span>
                            <span className="value">{order._id}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Payment ID:</span>
                            <span className="value">{order.payment_intent || 'N/A'}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Created:</span>
                            <span className="value">{format(new Date(order.createdAt), 'PPP')}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Location:</span>
                            <span className="value">{order.location || 'Not specified'}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Duration:</span>
                            <span className="value">{order.duration ? `${order.duration} hours` : 'Not specified'}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Base Price:</span>
                            <span className="value">${order.price}</span>
                        </div>
                        <div className="order-row">
                            <span className="label">Total Price:</span>
                            <span className="value">${order.totalprice || order.price}</span>
                        </div>
                        <div className="order-row full-width">
                            <span className="label">Options:</span>
                            <span className="value">
                                {order.options && Object.entries(order.options).some(([key, value]) => value) ? (
                                    <ul>
                                        {order.options.car && <li>Car included</li>}
                                        {order.options.scooter && <li>Scooter included</li>}
                                        {/* Add any other options that might be available */}
                                    </ul>
                                ) : 'No additional options'}
                            </span>
                        </div>
                    </div>

                    <div className="status-toggle-container">
                        <button
                            className={`toggle-btn ${order.isCompleted ? 'completed' : 'pending'}`}
                            onClick={handleStatusToggle}
                        >
                            Mark as {order.isCompleted ? 'Pending' : 'Completed'}
                        </button>
                    </div>

                    <div className="user-details-container">
                        <div className="user-card">
                            <h3>Ambassador Details</h3>
                            {ambassador ? (
                                <div className="user-info">
                                    <div className="user-info-row">
                                        <span className="label">Username:</span>
                                        <span className="value">{ambassador.username}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Email:</span>
                                        <span className="value">{ambassador.email}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Country:</span>
                                        <span className="value">{ambassador.country}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Phone:</span>
                                        <span className="value">{ambassador.phone || 'Not provided'}</span>
                                    </div>
                                    <button
                                        className="view-profile-btn"
                                        onClick={() => navigate(`/admin/users/${ambassador._id}`)}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="no-data">Ambassador details not available</div>
                            )}
                        </div>

                        <div className="user-card">
                            <h3>Guest Details</h3>
                            {guest ? (
                                <div className="user-info">
                                    <div className="user-info-row">
                                        <span className="label">Username:</span>
                                        <span className="value">{guest.username}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Email:</span>
                                        <span className="value">{guest.email}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Country:</span>
                                        <span className="value">{guest.country}</span>
                                    </div>
                                    <div className="user-info-row">
                                        <span className="label">Phone:</span>
                                        <span className="value">{guest.phone || 'Not provided'}</span>
                                    </div>
                                    <button
                                        className="view-profile-btn"
                                        onClick={() => navigate(`/admin/users/${guest._id}`)}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="no-data">Guest details not available</div>
                            )}
                        </div>
                    </div>

                    {order.img && (
                        <div className="gig-image">
                            <h3>Service Image</h3>
                            <img src={order.img} alt={order.title} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;