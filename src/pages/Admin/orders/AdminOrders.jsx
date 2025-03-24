import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import { format } from 'date-fns';
import { generateOrdersPDF, generateOrdersExcel } from './utils/orderExport.js';
import './AdminOrders.scss';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchOrders();
    }, [navigate, currentPage, ordersPerPage, statusFilter, sortConfig]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get("/adminOrders", {
                params: {
                    page: currentPage,
                    limit: ordersPerPage,
                    status: statusFilter,
                    sort: sortConfig.key,
                    direction: sortConfig.direction
                }
            });

            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
            setTotalOrders(response.data.total);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders");
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                await newRequest.delete(`/adminOrders/${orderId}`);
                fetchOrders(); // Refresh the order list
            } catch (err) {
                console.error("Error deleting order:", err);
                setError("Failed to delete order");
            }
        }
    };

    const handleStatusToggle = async (orderId, isCompleted) => {
        try {
            await newRequest.patch(`/adminOrders/${orderId}/status`, { isCompleted });
            fetchOrders(); // Refresh the order list
        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update order status");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleExportPDF = () => {
        // Get all orders for export
        const fetchAllForExport = async () => {
            try {
                setLoading(true);
                const response = await newRequest.get("/adminOrders/export", {
                    params: {
                        status: statusFilter
                    }
                });
                generateOrdersPDF(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error exporting orders:", err);
                setError("Failed to export orders");
                setLoading(false);
            }
        };
        fetchAllForExport();
    };

    const handleExportExcel = () => {
        // Get all orders for export
        const fetchAllForExport = async () => {
            try {
                setLoading(true);
                const response = await newRequest.get("/adminOrders/export", {
                    params: {
                        status: statusFilter
                    }
                });
                generateOrdersExcel(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error exporting orders:", err);
                setError("Failed to export orders");
                setLoading(false);
            }
        };
        fetchAllForExport();
    };

    const filteredOrders = orders.filter(order => {
        // Apply search query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.title?.toLowerCase().includes(query) ||
            order.payment_intent?.toLowerCase().includes(query) ||
            order.location?.toLowerCase().includes(query) ||
            order._id?.toLowerCase().includes(query)
        );
    });

    if (loading) return <div className="admin-loading">Loading orders...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-orders">
            <div className="container">
                <div className="admin-header">
                    <h1>Order Management</h1>
                    <button className="back-btn" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="filters-container">
                    <div className="search-container">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-btn">Search</button>
                        </form>
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('')}
                        >
                            All Orders
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('pending')}
                        >
                            Pending
                        </button>
                    </div>
                </div>

                <div className="export-controls">
                    <div className="results-info">
                        Showing {orders.length} of {totalOrders} orders
                    </div>
                    <div className="export-buttons">
                        <button className="export-btn excel" onClick={handleExportExcel}>
                            Export to Excel
                        </button>
                        <button className="export-btn pdf" onClick={handleExportPDF}>
                            Export to PDF
                        </button>
                    </div>
                </div>

                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                        <tr>
                            <th onClick={() => handleSort('_id')}>
                                ID {sortConfig.key === '_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('title')}>
                                Service {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('location')}>
                                Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('price')}>
                                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('createdAt')}>
                                Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('isCompleted')}>
                                Status {sortConfig.key === 'isCompleted' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id.substring(0, 8)}...</td>
                                <td>{order.title}</td>
                                <td>{order.location || 'N/A'}</td>
                                <td>${order.totalprice || order.price}</td>
                                <td>{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                                <td>
                                    <span className={`status-badge ${order.isCompleted ? 'completed' : 'pending'}`}>
                                        {order.isCompleted ? 'Completed' : 'Pending'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className={`status-btn ${order.isCompleted ? 'mark-pending' : 'mark-completed'}`}
                                        onClick={() => handleStatusToggle(order._id, !order.isCompleted)}
                                    >
                                        {order.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                                    </button>
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteOrder(order._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="no-results">No orders found matching your criteria</div>
                )}

                <div className="pagination-controls">
                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="pagination-buttons">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            First
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map(pageNum => (
                            <button
                                key={pageNum + 1}
                                className={`pagination-btn ${currentPage === pageNum + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(pageNum + 1)}
                            >
                                {pageNum + 1}
                            </button>
                        )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            Last
                        </button>
                    </div>
                    <div className="per-page-controls">
                        <select
                            value={ordersPerPage}
                            onChange={(e) => setOrdersPerPage(Number(e.target.value))}
                            className="per-page-select"
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;