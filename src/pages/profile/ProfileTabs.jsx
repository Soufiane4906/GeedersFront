import React from 'react';
import { FaUser, FaEdit, FaLock } from 'react-icons/fa';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="dashboard-tabs">
            <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
            >
                <FaUser /> View Profile
            </button>
            <button
                className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit')}
            >
                <FaEdit /> Edit Profile
            </button>
            <button
                className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
            >
                <FaLock /> Change Password
            </button>
        </div>
    );
};

export default ProfileTabs;