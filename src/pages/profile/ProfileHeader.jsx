import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileHeader = ({ user }) => {
    return (
        <div className="profile-header">
            <div className="profile-avatar">
                {user.img ? (
                    <img
                        src={user.img}
                        alt={`${user.username}'s avatar`}
                        className="img-fluid rounded-circle"
                    />
                ) : (
                    <FaUserCircle className="img-fluid rounded-circle" />
                )}
            </div>
            <h1>{user.username}</h1>
            {user.isAmbassador && (
                <div className="user-badge">
                    <span>Ambassador</span>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;