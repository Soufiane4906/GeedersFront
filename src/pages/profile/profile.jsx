import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { FaCar, FaMotorcycle, FaDollarSign, FaUser, FaLock } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import newRequest from '../../utils/newRequest.js'; // Assuming you have a file for API requests
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import 'bootstrap/dist/css/bootstrap.min.css';
import "./profile.scss"
const languageOptions = [
  { value: "English", label: "🇬🇧 English" },
  { value: "French", label: "🇫🇷 French" },
  { value: "German", label: "🇩🇪 German" },
  { value: "Italian", label: "🇮🇹 Italian"},
  { value: "Spanish", label: "🇪🇸 Spanish"},
  { value: "Chinese", label: "🇨🇳 Chinese"},
  { value: "Japanese", label: "🇯🇵 Japanese"},
  { value: "Korean", label: "🇰🇷 Korean" },
  { value: "Arabic", label: "🇦🇪 Arabic" },
  { value: "Russian", label: "🇷🇺 Russian" },
  { value: "Portuguese", label: "🇵🇹 Portuguese"},
  { value: "Dutch", label: "🇳🇱 Dutch"},
  { value: "Greek", label: "🇬🇷 Greek"},
  { value: "Hindi", label: "🇮🇳 Hindi"},
  { value: "Urdu", label: "🇵🇰 Urdu"},
  { value: "Turkish", label: "🇹🇷 Turkish"},
  { value: "Swedish", label: "🇸🇪 Swedish"},
  { value: "Norwegian", label: "🇳🇴 Norwegian"},
  { value: "Danish", label: "🇩🇰 Danish"},
  { value: "Finnish", label: "🇫🇮 Finnish"},
  { value: "Polish", label: "🇵🇱 Polish"},
  { value: "Czech", label: "🇨🇿 Czech"},
  { value: "Slovak", label: "🇸🇰 Slovak"},
  { value: "Hungarian", label: "🇭🇺 Hungarian"},
  { value: "Romanian", label: "🇷🇴 Romanian"},
  { value: "Bulgarian", label: "🇧🇬 Bulgarian"},
  { value: "Serbian", label: "🇷🇸 Serbian"},
  { value: "Croatian", label: "🇭🇷 Croatian"},
  { value: "Slovenian", label: "🇸🇮 Slovenian"},
  { value: "Albanian", label: "🇦🇱 Albanian"},
  { value: "Macedonian", label: "🇲🇰 Macedonian"},
  { value: "Bosnian", label: "🇧🇦 Bosnian"},
  { value: "Montenegrin", label: "🇲🇪 Montenegrin"},
  { value: "Kosovar", label: "🇽🇰 Kosovar"},
  { value: "Georgian", label: "🇬🇪 Georgian"},
  { value: "Armenian", label: "🇦🇲 Armenian"},
  { value: "Azerbaijani", label: "🇦🇿 Azerbaijani"},
  { value: "Kazakh", label: "🇰🇿 Kazakh"},
  { value: "Uzbek", label: "🇺🇿 Uzbek"},
  { value: "Turkmen", label: "🇹🇲 Turkmen"},
  { value: "Kyrgyz", label: "🇰🇬 Kyrgyz"},
  { value: "Tajik", label: "🇹🇯 Tajik"},
  { value: "Afghan", label: "🇦🇫 Afghan"},
  { value: "Pakistani", label: "🇵🇰 Pakistani"},
  { value: "Indian", label: "🇮🇳 Indian"},
  { value: "Bangladeshi", label: "🇧🇩 Bangladeshi"},
  { value: "Nepali", label: "🇳🇵 Nepali"},
  { value: "Bhutanese", label: "🇧🇹 Bhutanese"},
  { value: "Sri Lankan", label: "🇱🇰 Sri Lankan"},
  { value: "Maldivian", label: "🇲🇻 Maldivian"},
  { value: "American", label: "🇺🇸 American"},
  { value: "Canadian", label: "🇨🇦 Canadian"},
  { value: "Mexican", label: "🇲🇽 Mexican"},
  { value: "Brazilian", label: "🇧🇷 Brazilian"},
  { value: "Argentinian", label: "🇦🇷 Argentinian"},
  { value: "Chilean", label: "🇨🇱 Chilean"},
  { value: "Peruvian", label: "🇵🇪 Peruvian"},
  { value: "Colombian", label: "🇨🇴 Colombian"},
  { value: "Venezuelan", label: "🇻🇪 Venezuelan"},
  { value: "Ecuadorian", label: "🇪🇨 Ecuadorian"},
  //more


  // Add more languages as needed

];
const availabilityDaysOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [formData, setFormData] = useState({
    languages: [],
    hasCar: false,
    hasScooter: false,
    price: '',
    imgRecto: '',
    imgVerso: '',
    imgPassport: '',
    carPrice: '',
    scooterPrice: '',
    location: '',
    availabilityDays: [],
    availabilityHours: null,
    username: '',
    oldPassword: '',
    newPassword: '',
  });
  const [files, setFiles] = useState({
    imgRecto: null,
    imgVerso: null,
    imgPassport: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await newRequest.get(`/users/${currentUser._id}`);
        setUser(response.data);
        setFormData({
          languages: response.data.languages || [],
          hasCar: response.data.hasCar || false,
          carPrice: response.data.carPrice || '',
          scooterPrice: response.data.scooterPrice || '',
          hasScooter: response.data.hasScooter || false,
          price: response.data.price || '',
          imgRecto: response.data.imgRecto || '',
          imgVerso: response.data.imgVerso || '',
          imgPassport: response.data.imgPassport || '',
          location: response.data.location || '',
          availabilityDays: response.data.availabilityDays || [],
          // availabilityHours: response.data.availabilityHours || '',
          username: response.data.username || '',
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [currentUser._id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOptions, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions.map(option => option.value),
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const upload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await newRequest.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  };

  const handleDateChange = (hours) => {
    setFormData((prevData) => ({ ...prevData, availabilityHours: hours }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.carPrice < 10 || formData.carPrice > 20) {
      toast.error('Car price must be between $10 and $20 per hour.');
      return;
    }

    if (formData.scooterPrice < 5 || formData.scooterPrice > 10) {
      toast.error('Scooter price must be between $5 and $10 per hour.');
      return;
    }

    if (formData.price < 25 || formData.price > 45) {
      toast.error('Guide price must be between $25 and $45 per hour.');
      return;
    }

    try {
      const imgRectoUrl = files.imgRecto ? await upload(files.imgRecto) : formData.imgRecto;
      const imgVersoUrl = files.imgVerso ? await upload(files.imgVerso) : formData.imgVerso;
      const imgPassportUrl = files.imgPassport ? await upload(files.imgPassport) : formData.imgPassport;

      const updatedFormData = {
        ...formData,
        imgRecto: imgRectoUrl,
        imgVerso: imgVersoUrl,
        imgPassport: imgPassportUrl
      };

      await newRequest.put(`/users/${currentUser._id}`, updatedFormData);
      setUser((prev) => ({ ...prev, ...updatedFormData, isComplete: true }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      // Update password logic here
      await newRequest.put(`/users/${currentUser._id}/update-password`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password updated successfully!');
      setIsChangingPassword(false);
    } catch (err) {
      toast.error('Failed to update password.');
    }
  };

  if (!user) return <h1>Loading...</h1>;

  return (
    <div className="container profile">
  <div className="text-center mb-4">
    <img
      src={user.img}
      alt="User Avatar"
      className="img-fluid rounded-circle"
      style={{ width: '150px', height: '150px' }}
    />
  </div>
  {user.isVerified ? (
    <h1 className="text-center">Your guide account is Verified 🥳</h1>
  ) : (
    <div>
      {isEditing || !user.isComplete ? (
        <div className="profile-form">
          <h1>Edit Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="languages">Languages Spoken</label>
                <Select
                  name="languages"
                  options={languageOptions}
                  isMulti
                  value={formData.languages.map(lang => languageOptions.find(option => option.value === lang))}
                  onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'languages')}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="username"><FaUser /> Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="hasCar"><FaCar /> Do you have a car?</label>
                <input
                  name="hasCar"
                  type="checkbox"
                  checked={formData.hasCar}
                  onChange={handleChange}
                />
                {formData.hasCar && (
                  <>
                    <label htmlFor="carPrice"><FaCar /> Car price per hour (10$ - 20$)</label>
                    <input
                      name="carPrice"
                      type="number"
                      className="form-control"
                      value={formData.carPrice}
                      onChange={handleChange}
                    />
                  </>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="hasScooter"><FaMotorcycle /> Do you have a scooter?</label>
                <input
                  name="hasScooter"
                  type="checkbox"
                  checked={formData.hasScooter}
                  onChange={handleChange}
                />
                {formData.hasScooter && (
                  <>
                    <label htmlFor="scooterPrice"><FaMotorcycle /> Scooter price per hour (5$ - 10$)</label>
                    <input
                      name="scooterPrice"
                      type="number"
                      className="form-control"
                      value={formData.scooterPrice}
                      onChange={handleChange}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="price"><FaDollarSign /> Price per hour (25$ - 45$)</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="location">Location</label>
                <input
                  name="location"
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="availabilityDays">Availability Days</label>
                <Select
                  name="availabilityDays"
                  options={availabilityDaysOptions}
                  isMulti
                  value={formData.availabilityDays.map(day => availabilityDaysOptions.find(option => option.value === day))}
                  onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'availabilityDays')}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="availabilityHours">Availability Hours</label>
                <DatePicker
                  selected={formData.availabilityHours}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="imgRecto">Recto Image</label>
                <input
                  type="file"
                  name="imgRecto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="imgVerso">Verso Image</label>
                <input
                  type="file"
                  name="imgVerso"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="imgPassport">Passport Image</label>
                <input
                  type="file"
                  name="imgPassport"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
            {isEditing && <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => setIsEditing(false)}>Cancel</button>}
          </form>
        </div>
      ) : (
        <div className="profile-complete">
          <h1>Complete Your Profile</h1>
          <form onSubmit={handlePasswordChange}>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="oldPassword"><FaLock /> Old Password</label>
                <input
                  name="oldPassword"
                  type="password"
                  className="form-control"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="newPassword"><FaLock /> New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  className="form-control"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Change Password</button>
                <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => setIsChangingPassword(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
