import React, { useState } from 'react';
import Select from 'react-select';
import './ProfileEdit.scss';
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
const ProfileEdit = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    country: user.country,
    languages: user.languages,
    city: user.city,
    phone: user.phone,
    desc: user.desc,
    bankCardNumber: user.bankCardNumber,
    location: user.location,
    imgRecto: user.imgRecto,
    imgVerso: user.imgVerso,
    imgPassport: user.imgPassport,
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

  const handleSelectChange = (selectedOptions, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0],
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
      const imgRectoUrl = files.imgRecto ? await upload(files.imgRecto) : formData.imgRecto;
      const imgVersoUrl = files.imgVerso ? await upload(files.imgVerso) : formData.imgVerso;
      const imgPassportUrl = files.imgPassport ? await upload(files.imgPassport) : formData.imgPassport;

      const updatedFormData = {
        ...formData,
        imgRecto: imgRectoUrl,
        imgVerso: imgVersoUrl,
        imgPassport: imgPassportUrl,
      };

      await onUpdate(updatedFormData);
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <form className="profile-edit" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        required
      />
      <Select
        name="languages"
        options={languageOptions} // Define this array with language options
        isMulti
        value={formData.languages.map((lang) => languageOptions.find((option) => option.value === lang))}
        onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'languages')}
      />
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        type="text"
        name="desc"
        value={formData.desc}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="bankCardNumber"
        value={formData.bankCardNumber}
        onChange={handleChange}
        placeholder="Bank Card Number"
        required
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        type="file"
        name="imgRecto"
        className="form-control"
        onChange={handleFileChange}
      />
      <input
        type="file"
        name="imgVerso"
        className="form-control"
        onChange={handleFileChange}
      />
      <input
        type="file"
        name="imgPassport"
        className="form-control"
        onChange={handleFileChange}
      />
    <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
      <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => setFormData(user)}>Cancel</button>
    </form>
  );
};

export default ProfileEdit;