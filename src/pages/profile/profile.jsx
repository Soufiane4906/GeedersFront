import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import newRequest from '../../utils/newRequest.js';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import './profile.scss';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { FaLanguage, FaLock } from 'react-icons/fa';
import { FaUser, FaEdit, FaEnvelope, FaGlobe, FaCity, FaPhone, FaFileAlt, FaCreditCard, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaIdCard } from 'react-icons/fa';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import {languageOptions} from '../../utils/options.js';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [activeTab, setActiveTab] = useState('profile');

  // Keep your original data fetching logic
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await newRequest.get(`/users/${currentUser._id}`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch user data.');
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
      toast.error('Failed to update profile.');
    }
  };

  const handleUpdatePassword = async (passwords) => {
    try {
      await newRequest.put(`/users/${currentUser._id}/update-password`, passwords);
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error('Failed to update password.');
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="container profile-dashboard">
      <ToastContainer />
      
      {/* User profile header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.img ? (
            <img
              src={user.img}
              alt="User Avatar"
              className="img-fluid rounded-circle"
              style={{ width: '150px', height: '150px' }}
            />
          ) : (
            <FaUserCircle size={150} className="img-fluid rounded-circle" />
          )}
        </div>
        <h1>{user.username}</h1>
      </div>
      
      {/* Navigation tabs */}
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
      
      {/* Tab content */}
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

// Keep your existing component definitions
const ProfileDetail = ({ user }) => {
  return (
    <div className="profile-detail">
      <h2>Profile Details</h2>
      <div className="profile-info">
        <p><FaUserCircle className="icon" /> <strong>Username :</strong> {user.username}</p>
        <p><FaEnvelope className="icon" /> <strong>Email :</strong> {user.email}</p>
        <p><FaGlobe className="icon" /> <strong>Country :</strong> {user.country}</p>
        <p><FaMapMarkerAlt className="icon" /> <strong>City :</strong> {user.city}</p>
        <p><FaFileAlt className="icon" /> <strong>Role :</strong> {user.isAmbassador ? 'Ambassador' : 'Guest'}</p>
        <p><FaLanguage className="icon" /> <strong>Languages:</strong> {user.languages.join(', ')}</p>
        <p><FaPhone className="icon" /> <strong>Phone :</strong> {user.phone}</p>
        <p><FaIdCard className="icon" /> <strong>Description:</strong> {user.desc}</p>
        <p><FaCreditCard className="icon" /> <strong>Payment Method :</strong>  {user.paymentMethod}</p>
        <p><FaCreditCard className="icon" /> <strong>Account Number :</strong> {user.accountNumber}</p>
      </div>
      <div className="images">
        <p><strong>Identity Images:</strong></p>
        {user.imgRecto || user.imgVerso || user.imgPassport ? (
          <>
            {user.imgRecto ? <img src={user.imgRecto} alt="Identity Front" /> : <p>Identity front image not available.</p>}
            {user.imgVerso ? <img src={user.imgVerso} alt="Identity Back" /> : <p>Identity back image not available.</p>}
            {user.imgPassport ? <img src={user.imgPassport} alt="Passport" /> : <p>Passport image not available.</p>}
          </>
        ) : (
          <div className="warning">
            <p>No identity images available. Your account will not be verified without valid identity images. Please upload a front, back, or passport image.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileEdit = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    country: user.country || '',
    languages: user.languages || [],
    city: user.city || '',
    phone: user.phone || '',
    desc: user.desc || '',
    accountNumber: user.accountNumber || '',
    paymentMethod: user.paymentMethod || '',
    location: user.location || '',
    imgRecto: user.imgRecto || '',
    imgVerso: user.imgVerso || '',
    imgPassport: user.imgPassport || '',
  });

  const [files, setFiles] = useState({
    imgRecto: null,
    imgVerso: null,
    imgPassport: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      languages: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0], // Store the file
    }));
  };

  const upload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await newRequest.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadFile = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        const response = await newRequest.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.url;
      };

      const imgRectoUrl = files.imgRecto ? await uploadFile(files.imgRecto) : formData.imgRecto;
      const imgVersoUrl = files.imgVerso ? await uploadFile(files.imgVerso) : formData.imgVerso;
      const imgPassportUrl = files.imgPassport ? await uploadFile(files.imgPassport) : formData.imgPassport;

      const updatedData = {
        ...formData,
        imgRecto: imgRectoUrl,
        imgVerso: imgVersoUrl,
        imgPassport: imgPassportUrl,
      };

      await onUpdate(updatedData);
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Form className="profile-edit" onSubmit={handleSubmit}>
      <h2 className="mb-4">Edit Profile</h2>
      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          <Form.Label><FaUser /> Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </Form.Group>

        <Form.Group as={Col} md="6">
          <Form.Label><FaEnvelope /> Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          <Form.Label><FaGlobe /> Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
        </Form.Group>

        <Form.Group as={Col} md="6">
          <Form.Label><FaFileAlt /> Languages</Form.Label>
          <Select
            name="languages"
            options={languageOptions} // Define this array with language options
            isMulti
            value={formData.languages.map(lang => languageOptions.find(option => option.value === lang))}
            onChange={handleSelectChange}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          <Form.Label><FaCity /> City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </Form.Group>

        <Form.Group as={Col} md="6">
          <Form.Label><FaPhone /> Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="12">
          <Form.Label><FaFileAlt /> Description</Form.Label>
          <Form.Control
            type="text"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Description"
          />
        </Form.Group>
      </Row>

      {/* Payment Method Selection - First */}
      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          <Form.Label>
            <FaCreditCard /> Select Payment Method
          </Form.Label>
          <Form.Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
          >
            <option value="">Select Payment Method</option>
            <option value="paypal">PayPal</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </Form.Select>
        </Form.Group>
      </Row>

      {/* Account Number Input - After */}
      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          {user.isAmbassador ? (
              <>
                <Form.Label>
                  <FaCreditCard className="icon" /> Account Card Number
                </Form.Label>
                <Form.Control
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="PayPal Card Number"
                    required
                />
              </>
          ) : (
              <>
                <Form.Label>
                  <FaCreditCard /> Bank Card Number
                </Form.Label>
                <Form.Control
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Bank Card Number"
                    required
                />
              </>
          )}
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4">
          <Form.Label><FaImage /> Upload Identity Front Image</Form.Label>
          <Form.Control
            type="file"
            name="imgRecto"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label><FaImage />Upload Identity Back Image</Form.Label>
          <Form.Control
            type="file"
            name="imgVerso"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label><FaImage /> Upload Passport Image</Form.Label>
          <Form.Control
            type="file"
            name="imgPassport"
            onChange={handleFileChange}
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
        <Button type="button" variant="secondary" className="ms-2" onClick={() => setFormData(user)}>
          Cancel
        </Button>
      </Form.Group>
    </Form>
  );
};


const ProfilePassword = ({ onUpdatePassword }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Both fields are required.");
      return;
    }
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
      </form>
  );
};

export default Profile;