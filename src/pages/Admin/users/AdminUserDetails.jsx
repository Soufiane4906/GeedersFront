import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import './AdminUsers.scss';
import './AdminUserDetails.scss';

const AdminUserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchUserDetails();
    }, [userId, navigate]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get(`/adminUsers/users/${userId}`);

            setUser(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Failed to load user details");
            setLoading(false);
        }
    };

    const handleVerifyUser = async (isVerified) => {
        try {
            await newRequest.patch(`/adminUsers/users/${userId}/verify`, { isVerified });
            fetchUserDetails(); // Refresh user data
        } catch (err) {
            console.error("Error updating user verification status:", err);
            setError("Failed to update verification status");
        }
    };

    const handleUserTypeChange = async (userType) => {
        const isAmbassador = userType === 'ambassador';
        const isAdmin = userType === 'admin';

        try {
            await newRequest.patch(`/adminUsers/users/${userId}/type`, {
                isAmbassador,
                isAdmin,
                userType
            });
            fetchUserDetails(); // Refresh user data
        } catch (err) {
            console.error("Error updating user type:", err);
            setError("Failed to update user type");
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await newRequest.delete(`/adminUsers/users/${userId}`);
                navigate('/admin/users'); // Navigate back to users list
            } catch (err) {
                console.error("Error deleting user:", err);
                setError("Failed to delete user");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await newRequest.put(`/adminUsers/users/${userId}`, formData);
            setIsEditing(false);
            fetchUserDetails(); // Refresh with updated data
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Failed to update user information");
        }
    };

    const handleCancelEdit = () => {
        setFormData(user); // Reset form data to original user data
        setIsEditing(false);
    };

    if (loading) return <div className="admin-loading">Loading user details...</div>;
    if (error) return <div className="admin-error">{error}</div>;
    if (!user) return <div className="admin-error">User not found</div>;

    return (
        <div className="admin-user-details">
            <div className="container">
                <div className="admin-header">
                    <h1>User Details</h1>
                    <div className="header-actions">
                        <button className="back-btn" onClick={() => navigate('/adminUsers/users')}>
                            Back to Users
                        </button>
                        {!isEditing ? (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                Edit User
                            </button>
                        ) : (
                            <>
                                <button className="save-btn" onClick={handleSaveChanges}>
                                    Save Changes
                                </button>
                                <button className="cancel-btn" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="user-details-container">
                    <div className="user-profile-section">
                        <div className="user-header">
                            <h2>{user.username}</h2>
                            <div className="user-status">
                                <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                                <span className="user-type-badge">
                                    {user.isAdmin ? 'Admin' : (user.isAmbassador ? 'Ambassador' : 'Guest')}
                                </span>
                            </div>
                        </div>

                        {user.img && (
                            <div className="user-image">
                                <img src={user.img} alt={`${user.username}'s profile`} />
                            </div>
                        )}

                        <div className="user-actions">
                            <button
                                className={`verify-btn ${user.isVerified ? 'unverify' : 'verify'}`}
                                onClick={() => handleVerifyUser(!user.isVerified)}
                            >
                                {user.isVerified ? 'Unverify User' : 'Verify User'}
                            </button>
                            <button
                                className="delete-btn"
                                onClick={handleDeleteUser}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>

                    <div className="user-details-section">
                        <h3>Account Information</h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <label>User ID:</label>
                                <div>{user._id}</div>
                            </div>

                            <div className="detail-item">
                                <label>User Type:</label>
                                {isEditing ? (
                                    <select
                                        name="userType"
                                        value={formData.userType || (user.isAdmin ? 'admin' : (user.isAmbassador ? 'ambassador' : 'guest'))}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleUserTypeChange(e.target.value);
                                        }}
                                    >
                                        <option value="guest">Guest</option>
                                        <option value="ambassador">Ambassador</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    <div>{user.isAdmin ? 'Admin' : (user.isAmbassador ? 'Ambassador' : 'Guest')}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Email:</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.email}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Username:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.username}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>First Name:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.firstName || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Last Name:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.lastName || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Country:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.country || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>City:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.city || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Phone:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.phone || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item">
                                <label>Age:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <div>{user.age || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="detail-item full-width">
                                <label>Description:</label>
                                {isEditing ? (
                                    <textarea
                                        name="desc"
                                        value={formData.desc || ''}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
                                ) : (
                                    <div className="user-description">{user.desc || 'No description provided'}</div>
                                )}
                            </div>
                        </div>

                        {user.isAmbassador && (
                            <>
                                <h3>Ambassador Information</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <label>Languages:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="languages"
                                                value={formData.languages ? formData.languages.join(', ') : ''}
                                                onChange={(e) => {
                                                    const langArray = e.target.value.split(',').map(lang => lang.trim());
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        languages: langArray
                                                    }));
                                                }}
                                                placeholder="Comma separated languages"
                                            />
                                        ) : (
                                            <div>{user.languages ? user.languages.join(', ') : 'No languages specified'}</div>
                                        )}
                                    </div>

                                    <div className="detail-item">
                                        <label>Payment Method:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="paymentMethod"
                                                value={formData.paymentMethod || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div>{user.paymentMethod || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="detail-item">
                                        <label>Account Number:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={formData.accountNumber || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div>{user.accountNumber || 'Not provided'}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <h3>Verification Documents</h3>
                        <div className="verification-images">
                            {user.imgRecto ? (
                                <div className="document-image">
                                    <h4>ID Front</h4>
                                    <img src={user.imgRecto} alt="ID Front" />
                                </div>
                            ) : (
                                <div className="document-missing">No ID Front uploaded</div>
                            )}

                            {user.imgVerso ? (
                                <div className="document-image">
                                    <h4>ID Back</h4>
                                    <img src={user.imgVerso} alt="ID Back" />
                                </div>
                            ) : (
                                <div className="document-missing">No ID Back uploaded</div>
                            )}

                            {user.imgPassport ? (
                                <div className="document-image">
                                    <h4>Passport</h4>
                                    <img src={user.imgPassport} alt="Passport" />
                                </div>
                            ) : (
                                <div className="document-missing">No Passport uploaded</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetails;