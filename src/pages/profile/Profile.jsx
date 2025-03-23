import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import newRequest from '../../utils/newRequest.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Import sub-components
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfileDetail from './ProfileDetail';
import ProfileEdit from './ProfileEdit';
import ProfilePassword from './ProfilePassword';

// Import styles
import './ProfileStyles.scss';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await newRequest.get(`/users/${currentUser._id}`);
        setUser(response.data);
        console.log('User data loaded:', response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to fetch user data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser._id]);

  const handleUpdate = async (updatedData) => {
    try {
      await newRequest.put(`/users/${currentUser._id}`, updatedData);
      setUser((prev) => ({ ...prev, ...updatedData, isComplete: true }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleUpdatePassword = async (passwords) => {
    try {
      await newRequest.put(`/users/${currentUser._id}/update-password`, passwords);
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.response?.data || "Failed to update password.");
    }
  };

  if (isLoading) return <div className="loading">Loading your profile...</div>;
  if (!user) return <div className="error-message">Could not load profile. Please refresh the page.</div>;

  return (
      <div className="container profile-dashboard">
        <ToastContainer position="top-right" autoClose={3000} />

        <ProfileHeader user={user} />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tab-content">
          {activeTab === 'profile' && (
              <div className="dashboard-section">
                <ProfileDetail user={user} />
              </div>
          )}

          {activeTab === 'edit' && (
              <div className="dashboard-section">
                <ProfileEdit user={user} onUpdate={handleUpdate} />
              </div>
          )}

          {activeTab === 'password' && (
              <div className="dashboard-section">
                <ProfilePassword onUpdatePassword={handleUpdatePassword} />
              </div>
          )}
        </div>
      </div>
  );
};

export default Profile;