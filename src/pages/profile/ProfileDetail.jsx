import React from 'react';
import './ProfileDetail.scss';

const ProfileDetail = ({ user }) => {
  return (
    <div className="profile-detail">
      <h2>Profile Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Country:</strong> {user.country}</p>
      <p><strong>Languages:</strong> {user.languages.join(', ')}</p>
      <p><strong>City:</strong> {user.city}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Description:</strong> {user.desc}</p>
      <p><strong>Bank Card Number:</strong> {user.bankCardNumber}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <div className="images">
        <p><strong>Identity Images:</strong></p>
        <img src={user.imgRecto} alt="Identity Front" />
        <img src={user.imgVerso} alt="Identity Back" />
        <img src={user.imgPassport} alt="Passport" />
      </div>
    </div>
  );
};

export default ProfileDetail;
