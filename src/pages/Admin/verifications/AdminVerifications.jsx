import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';

const AdminVerifications = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, guests, ambassadors, admins
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get("/adminUsers/users");
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users");
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId, isVerified) => {
        try {
            await newRequest.patch(`/adminUsers/users/${userId}/verify`, { isVerified });
            fetchUsers(); // Refresh the user list
        } catch (err) {
            console.error("Error updating user verification status:", err);
            setError("Failed to update verification status");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await newRequest.delete(`/adminUsers/users/${userId}`);
                fetchUsers(); // Refresh the user list
            } catch (err) {
                console.error("Error deleting user:", err);
                setError("Failed to delete user");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        // Apply type filter
        if (filter === 'guests' && !user.isAmbassador && !user.isAdmin) return true;
        if (filter === 'ambassadors' && user.isAmbassador) return true;
        if (filter === 'admins' && user.isAdmin) return true;
        if (filter === 'all') return true;
        return false;
    }).filter(user => {
        // Apply search query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.username?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.country?.toLowerCase().includes(query)
        );
    });

    const handleUserTypeChange = async (userId, isAmbassador, isAdmin) => {
        try {
            await newRequest.patch(`/adminUsers/users/${userId}/type`, {
                isAmbassador,
                isAdmin,
                userType: isAdmin ? 'admin' : (isAmbassador ? 'ambassador' : 'guest')
            });
            fetchUsers(); // Refresh the user list
        } catch (err) {
            console.error("Error updating user type:", err);
            setError("Failed to update user type");
        }
    };

    if (loading) return <div className="admin-loading">Loading users...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-users">
            <div className="container">
                <div className="admin-header">
                    <h1>User Management</h1>
                    <button className="back-btn" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="filters-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Users
                        </button>
                        <button
                            className={`filter-btn ${filter === 'guests' ? 'active' : ''}`}
                            onClick={() => setFilter('guests')}
                        >
                            Guests
                        </button>
                        <button
                            className={`filter-btn ${filter === 'ambassadors' ? 'active' : ''}`}
                            onClick={() => setFilter('ambassadors')}
                        >
                            Ambassadors
                        </button>
                        <button
                            className={`filter-btn ${filter === 'admins' ? 'active' : ''}`}
                            onClick={() => setFilter('admins')}
                        >
                            Admins
                        </button>
                    </div>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Country</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user._id.substring(0, 8)}...</td>
                                <td>{user.username}</td>
                                <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.isAdmin ? 'admin' : (user.isAmbassador ? 'ambassador' : 'guest')}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleUserTypeChange(
                                                user._id,
                                                value === 'ambassador',
                                                value === 'admin'
                                            );
                                        }}
                                    >
                                        <option value="guest">Guest</option>
                                        <option value="ambassador">Ambassador</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>{user.country || 'N/A'}</td>
                                <td>
                    <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className={`verify-btn ${user.isVerified ? 'unverify' : 'verify'}`}
                                        onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                                    >
                                        {user.isVerified ? 'Unverify' : 'Verify'}
                                    </button>
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/adminUsers/users/${user._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="no-results">No users found matching your criteria</div>
                )}
            </div>
        </div>
    );
};

export default AdminVerifications;