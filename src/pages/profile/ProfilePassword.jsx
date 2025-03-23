import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePassword = ({ onUpdatePassword }) => {
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePasswords = () => {
        if (!passwords.oldPassword) {
            toast.error("Current password is required");
            return false;
        }

        if (!passwords.newPassword) {
            toast.error("New password is required");
            return false;
        }

        if (passwords.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return false;
        }

        if (passwords.oldPassword === passwords.newPassword) {
            toast.error("New password must be different from current password");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onUpdatePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            toast.success("Password updated successfully!");
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.response?.data || "Failed to update password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="profile-password" onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            <p className="section-description">
                Protect your account by creating a strong, unique password.
                Make sure to use a combination of uppercase letters, lowercase letters, numbers, and special characters.
            </p>

            <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                </ul>
            </div>

            <div className="form-group">
                <label htmlFor="oldPassword">
                    <FaLock /> Current Password
                </label>
                <div className="password-input-container">
                    <input
                        name="oldPassword"
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className="form-control"
                        value={passwords.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password-visibility"
                        onClick={() => togglePasswordVisibility('oldPassword')}
                    >
                        {showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="newPassword">
                    <FaLock /> New Password
                </label>
                <div className="password-input-container">
                    <input
                        name="newPassword"
                        type={showPasswords.newPassword ? "text" : "password"}
                        className="form-control"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password-visibility"
                        onClick={() => togglePasswordVisibility('newPassword')}
                    >
                        {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">
                    <FaLock /> Confirm New Password
                </label>
                <div className="password-input-container">
                    <input
                        name="confirmPassword"
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        className="form-control"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password-visibility"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                        {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Updating..." : "Update Password"}
            </button>
        </form>
    );
};

export default ProfilePassword;