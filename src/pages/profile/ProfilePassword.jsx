import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import './ProfilePassword.scss';

const ProfilePassword = ({ onUpdatePassword }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdatePassword(passwords);
  };

  return (
    <form className="profile-password" onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      <div className="form-group">
        <label htmlFor="oldPassword"><FaLock /> Old Password</label>
        <input
          name="oldPassword"
          type="password"
          className="form-control"
          value={passwords.oldPassword}
          onChange={handleChange}
          placeholder="Current Password"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword"><FaLock /> New Password</label>
        <input
          name="newPassword"
          type="password"
          className="form-control"
          value={passwords.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">Change Password</button>
      <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => setPasswords({ oldPassword: '', newPassword: '' })}>Cancel</button>
    </form>
  );
};

export default ProfilePassword;
