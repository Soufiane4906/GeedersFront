import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import { format } from 'date-fns';
import './AdminGigs.scss';

const AdminGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [countries, setCountries] = useState([]);
    const [selectedGigs, setSelectedGigs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        featured: 0
    });
    const [bulkActionType, setBulkActionType] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [gigToAction, setGigToAction] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchGigs();
        fetchStats();
    }, [currentPage, sortField, sortDirection, statusFilter, countryFilter, searchQuery]);

    const fetchGigs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('sort', sortField);
            params.append('direction', sortDirection);

            if (statusFilter) params.append('status', statusFilter);
            if (countryFilter) params.append('country', countryFilter);
            if (searchQuery) params.append('search', searchQuery);

            const response = await newRequest.get(`/gigs/admin?${params.toString()}`);
            setGigs(response.data.gigs);
            setTotalPages(response.data.totalPages);

            // Extract unique countries for filter
            const uniqueCountries = [...new Set(response.data.gigs.map(gig => gig.country).filter(Boolean))];
            setCountries(uniqueCountries);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data || "Something went wrong!");
            setLoading(false);
        }
    };
    const fetchStats = async () => {
        try {
            const response = await newRequest.get('/gigs/admin/stats');
            setStats(response.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchGigs();
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleCountryFilter = (e) => {
        setCountryFilter(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleGigSelect = (gigId) => {
        if (selectedGigs.includes(gigId)) {
            setSelectedGigs(selectedGigs.filter(id => id !== gigId));
        } else {
            setSelectedGigs([...selectedGigs, gigId]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedGigs([]);
        } else {
            setSelectedGigs(gigs.map(gig => gig._id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkAction = () => {
        if (selectedGigs.length === 0) return;

        switch (bulkActionType) {
            case 'delete':
                setConfirmMessage(`Are you sure you want to delete ${selectedGigs.length} selected services?`);
                setConfirmAction(() => performBulkDelete);
                setConfirmModalOpen(true);
                break;
            case 'activate':
                performBulkStatusUpdate(true);
                break;
            case 'deactivate':
                performBulkStatusUpdate(false);
                break;
            case 'feature':
                performBulkFeaturedUpdate(true);
                break;
            case 'unfeature':
                performBulkFeaturedUpdate(false);
                break;
            default:
                break;
        }
    };

    const performBulkDelete = async () => {
        try {
            await newRequest.post('/gigs/admin/bulk-delete', { ids: selectedGigs });
            setSelectedGigs([]);
            setSelectAll(false);
            fetchGigs();
            fetchStats();
        } catch (err) {
            setError(err.response?.data || "Failed to delete services");
        }
    };

    const performBulkStatusUpdate = async (isActive) => {
        try {
            await newRequest.post('/gigs/admin/bulk-status', {
                ids: selectedGigs,
                isActive
            });
            fetchGigs();
            fetchStats();
        } catch (err) {
            setError(err.response?.data || "Failed to update service status");
        }
    };

    const performBulkFeaturedUpdate = async (isFeatured) => {
        try {
            await newRequest.post('/gigs/admin/bulk-featured', {
                ids: selectedGigs,
                isFeatured
            });
            fetchGigs();
            fetchStats();
        } catch (err) {
            setError(err.response?.data || "Failed to update featured status");
        }
    };

    const handleDeleteGig = (gig) => {
        setGigToAction(gig);
        setConfirmMessage(`Are you sure you want to delete "${gig.title}"?`);
        setConfirmAction(() => async () => {
            try {
                await newRequest.delete(`/gigs/admin/${gig._id}`);
                fetchGigs();
                fetchStats();
                setConfirmModalOpen(false);
            } catch (err) {
                setError(err.response?.data || "Failed to delete service");
            }
        });
        setConfirmModalOpen(true);
    };

    const handleStatusToggle = async (gig) => {
        try {
            await newRequest.patch(`/gigs/admin/${gig._id}/status`, {
                isActive: !gig.isActive
            });
            fetchGigs();
            fetchStats();
        } catch (err) {
            setError(err.response?.data || "Failed to update service status");
        }
    };

    const handleFeaturedToggle = async (gig) => {
        try {
            await newRequest.patch(`/gigs/admin/${gig._id}/featured`, {
                isFeatured: !gig.isFeatured
            });
            fetchGigs();
            fetchStats();
        } catch (err) {
            setError(err.response?.data || "Failed to update featured status");
        }
    };

    const handleViewGig = (gigId) => {
        navigate(`/admin/gigs/${gigId}`);
    };

    const handleEditGig = (gigId) => {
        navigate(`/gigs/admin/${gigId}/edit`);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {startPage > 1 && (
                    <>
                        <button onClick={() => handlePageChange(1)}>1</button>
                        {startPage > 2 && <span className="ellipsis">...</span>}
                    </>
                )}
                {pages}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="ellipsis">...</span>}
                        <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </>
                )}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const ConfirmModal = () => {
        if (!confirmModalOpen) return null;

        return (
            <div className="confirm-modal">
                <div className="confirm-modal-content">
                    <h3>Confirm Action</h3>
                    <p>{confirmMessage}</p>
                    <div className="confirm-modal-actions">
                        <button className="cancel-btn" onClick={() => setConfirmModalOpen(false)}>Cancel</button>
                        <button className="confirm-btn" onClick={() => {
                            confirmAction();
                            setConfirmModalOpen(false);
                        }}>Confirm</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-gigs">
            <div className="container">
                <div className="admin-header">
                    <h1>Service Management</h1>
                    <button className="back-btn" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="admin-navigation">
                    <ul className="admin-nav-links">
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/gigs') ? 'active' : ''}`}>
                            <Link to="/admin/gigs">Services</Link>
                        </li>
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/users') ? 'active' : ''}`}>
                            <Link to="/admin/users">Users</Link>
                        </li>
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/orders') ? 'active' : ''}`}>
                            <Link to="/admin/orders">Orders</Link>
                        </li>
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/reviews') ? 'active' : ''}`}>
                            <Link to="/admin/reviews">Reviews</Link>
                        </li>
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/messages') ? 'active' : ''}`}>
                            <Link to="/admin/messages">Messages</Link>
                        </li>
                        <li className={`admin-nav-item ${location.pathname.includes('/admin/settings') ? 'active' : ''}`}>
                            <Link to="/admin/settings">Settings</Link>
                        </li>
                    </ul>
                </div>

                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Total Services</h3>
                        <p>{stats.total}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active</h3>
                        <p>{stats.active}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Inactive</h3>
                        <p>{stats.inactive}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Featured</h3>
                        <p>{stats.featured}</p>
                    </div>
                </div>

                <div className="admin-filters">
                    <div className="filter-group">
                        <button
                            className={statusFilter === '' ? 'active' : ''}
                            onClick={() => handleStatusFilter('')}
                        >
                            All
                        </button>
                        <button
                            className={statusFilter === 'active' ? 'active' : ''}
                            onClick={() => handleStatusFilter('active')}
                        >
                            Active
                        </button>
                        <button
                            className={statusFilter === 'inactive' ? 'active' : ''}
                            onClick={() => handleStatusFilter('inactive')}
                        >
                            Inactive
                        </button>
                        <button
                            className={statusFilter === 'featured' ? 'active' : ''}
                            onClick={() => handleStatusFilter('featured')}
                        >
                            Featured
                        </button>
                    </div>

                    <div className="filter-group">
                        <select
                            value={countryFilter}
                            onChange={handleCountryFilter}
                        >
                            <option value="">All Countries</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>

                {selectedGigs.length > 0 && (
                    <div className="bulk-actions">
                        <select
                            value={bulkActionType}
                            onChange={(e) => setBulkActionType(e.target.value)}
                        >
                            <option value="">Bulk Actions</option>
                            <option value="delete">Delete</option>
                            <option value="activate">Activate</option>
                            <option value="deactivate">Deactivate</option>
                            <option value="feature">Feature</option>
                            <option value="unfeature">Unfeature</option>
                        </select>
                        <button
                            onClick={handleBulkAction}
                            disabled={!bulkActionType}
                        >
                            Apply
                        </button>
                        <span>{selectedGigs.length} services selected</span>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading services...</div>
                ) : (
                    <>
                        {gigs.length === 0 ? (
                            <div className="no-results">No services found</div>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th onClick={() => handleSort('title')}>
                                            Title
                                            {sortField === 'title' && (
                                                <span className="sort-icon">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </th>
                                        <th onClick={() => handleSort('username')}>
                                            Owner
                                            {sortField === 'username' && (
                                                <span className="sort-icon">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </th>
                                        <th onClick={() => handleSort('country')}>
                                            Country
                                            {sortField === 'country' && (
                                                <span className="sort-icon">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </th>
                                        <th onClick={() => handleSort('price')}>
                                            Price
                                            {sortField === 'price' && (
                                                <span className="sort-icon">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </th>
                                        <th onClick={() => handleSort('createdAt')}>
                                            Created
                                            {sortField === 'createdAt' && (
                                                <span className="sort-icon">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {gigs.map((gig) => (
                                        <tr key={gig._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGigs.includes(gig._id)}
                                                    onChange={() => handleGigSelect(gig._id)}
                                                />
                                            </td>
                                            <td>{gig.title}</td>
                                            <td>{gig.username}</td>
                                            <td>{gig.country}</td>
                                            <td>${gig.price}</td>
                                            <td>{format(new Date(gig.createdAt), 'MMM d, yyyy')}</td>
                                            <td>
                                                    <span
                                                        className={`status-badge ${gig.isActive ? 'active' : 'inactive'}`}
                                                        onClick={() => handleStatusToggle(gig)}
                                                    >
                                                        {gig.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                            </td>
                                            <td>
                                                    <span
                                                        className={`featured-badge ${gig.isFeatured ? 'featured' : ''}`}
                                                        onClick={() => handleFeaturedToggle(gig)}
                                                    >
                                                        {gig.isFeatured ? 'Featured' : 'Regular'}
                                                    </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => handleViewGig(gig._id)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEditGig(gig._id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteGig(gig)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {totalPages > 1 && renderPagination()}
                    </>
                )}

                <ConfirmModal />
            </div>
        </div>
    );
};

export default AdminGigs;
