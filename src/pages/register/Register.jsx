import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faCity, faLanguage } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaApple, FaGoogle, FaPaypal } from "react-icons/fa";

// toast.configure();

function Register() {
  const [files, setFiles] = useState({
    profile: null,
    recto: null,
    verso: null,
    passport: null,
  });

  const [step, setStep] = useState(1);
  const [identityType, setIdentityType] = useState("");
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    img: "",
    imgRecto: "",
    imgVerso: "",
    imgPassport: "",
    country: "",
    city: "",
    isSeller: false,
    phone: "",
    desc: "",
    //accountNumber and paymentmethod
    accountNumber: "",
    paymentMethod: "",
  });
  debugger;

  const [cities, setCities] = useState([]);
  const [showCity, setShowCity] = useState(false);

  const navigate = useNavigate();

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setUser((prev) => ({ ...prev, country: selectedCountry, city: "" }));
    setShowCity(true);
    try {
      const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: selectedCountry
      });
      setCities(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the cities!", error);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setUser((prev) => ({ ...prev, city: selectedCity }));
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeller = (e) => {
    setUser((prev) => ({ ...prev, isSeller: e.target.checked }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleIdentityChange = (e) => {
    setIdentityType(e.target.value);
  };
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setUser((prev) => ({ ...prev, paymentMethod: method }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileImgUrl = await upload(files.profile);
    const rectoImgUrl = files.recto ? await upload(files.recto) : "";
    const versoImgUrl = files.verso ? await upload(files.verso) : "";
    const passportImgUrl = files.passport ? await upload(files.passport) : "";


    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: profileImgUrl,
        imgRecto: rectoImgUrl,
        imgVerso: versoImgUrl,
        imgPassport: passportImgUrl,
        accountNumber: user.accountNumber, // Include account number in the request
        paymentMethod: user.paymentMethod, // Include payment method in the request
      });
      toast.success("Registration successful!");
       navigate("/login");

      if (user.isSeller) {
        toast.info("Your registration is complete. Your account will be verified soon. Meanwhile, you can access the platform to post your service.");

      }
    } catch (err) {
      toast.error("There was an error during registration!");
      console.log(err);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h1>Register</h1>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              type="text"
              placeholder="johndoe"
              value={user.username}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email"
              value={user.email}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            <label htmlFor="profile">Profile Picture</label>
            <input
              name="profile"
              type="file"
              onChange={handleFileChange}
            />

            <button type="button" onClick={nextStep}>Next</button>
          </>
        );
      case 2:
        return (
          <>
            <h1></h1>
            <div className="toggle">
              <label htmlFor="isSeller">Do you want to be a guide?</label>
              <label className="switch">
                <input type="checkbox" checked={user.isSeller} onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>
            <label htmlFor="phone">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="+1 234 567 89"
              value={user.phone}
              onChange={handleChange}
            />
            {user.isSeller && (
              <>
            <label htmlFor="desc">Description</label>
            <textarea
              name="desc"
              placeholder="A short description of yourself"
              cols="30"
              rows="10"
              value={user.desc}
              onChange={handleChange}
            ></textarea>

            </>)}
            <label htmlFor="country">
              <FontAwesomeIcon icon={faGlobe} /> Country
            </label>
            <select
              name="country"
              value={user.country}
              onChange={handleCountryChange}
              style={{ width: '100%' }}
            >
              <option value="">Select Country</option>
              {countriesData.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <label htmlFor="city">
              <FontAwesomeIcon icon={faCity} /> City
            </label>
            <select
              name="city"
              value={user.city}
              onChange={handleCityChange}
              style={{ width: '100%' }}
              disabled={!showCity}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {user.isSeller && (
              <>
            <div className="identity-type" style={{textAlign :'center'}}>
              <h2>Select Identity Type</h2>
              <div className="radio-group" >
                <label>
                  <input
                    type="radio"
                    value="cin"
                    checked={identityType === "cin"}
                    onChange={handleIdentityChange}
                  />
                  CIN
                </label>
                <label>
                  <input
                    type="radio"
                    value="passport"
                    checked={identityType === "passport"}
                    onChange={handleIdentityChange}
                  />
                  Passport
                </label>

              </div>
            </div>
            {identityType === "cin" && (
              <>
                <label htmlFor="recto">CIN Recto</label>
                <input
                  name="recto"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="verso">CIN Verso</label>
                <input
                  name="verso"
                  type="file"
                  onChange={handleFileChange}
                />
              </>
            )}
            {identityType === "passport" && (
              <>
                <label htmlFor="passport">Passport</label>
                <input
                  name="passport"
                  type="file"
                  onChange={handleFileChange}
                />
              </>
            )}
            </>)}
            <div className="buttons">
              <button type="button" className="back-button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>

            {user.isSeller && (
              <>
           <div className="payment-methods">
            <label htmlFor="bank-transfer">Bank Transfer Method</label>
        <button
          type="button"
          className={`payment-button ${paymentMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          <FaPaypal /> PayPal
        </button>
        <button
          type="button"
          className={`payment-button ${paymentMethod === 'applepay' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('applepay')}
        >
          <FaApple /> Apple Pay
        </button>
        <button
          type="button"
          className={`payment-button ${paymentMethod === 'googlepay' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('googlepay')}
        >
          <FaGoogle /> Google Pay
        </button>
      </div>

      {paymentMethod && (
        <>
          <label htmlFor="accountNumber">Account Number</label>
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            placeholder={`Enter your ${paymentMethod} account number`}
            value={user.accountNumber}
            onChange={(e) => setUser((prev) => ({ ...prev, accountNumber: e.target.value }))}
          />
        </>
      )}    </>
    )}
            <div className="buttons">
            <label>
                <input
                  type="checkbox"
                  name="privacy"
                  checked={user.privacy}
                  onChange={handleChange}
                />
                I agree to the privacy policy and understand that my data will be handled responsibly.
              </label>
              <button type="button" className="back-button" onClick={prevStep}>Back</button>
              <button type="submit"  disabled={!user.privacy}>Register</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className="register">
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </motion.div>
    </div>
  );
}

export default Register;

const countriesData = [
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "China", flag: "🇨🇳" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Korea", flag: "🇰🇷" },
  { name: "Arab Emirates", flag: "🇦🇪" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  //go
  { name: "United States", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Fiji", flag: "🇫🇯" },
  { name: "Papua New Guinea", flag: "🇵🇬" },
  { name: "Solomon Islands", flag: "🇸🇧" },
  { name: "Vanuatu", flag: "🇻🇺" },
  { name: "Samoa", flag: "🇼🇸" },
  { name: "Tonga", flag: "🇹🇴" },
  { name: "Kiribati", flag: "🇰🇮" },
  { name: "Tuvalu", flag: "🇹🇻" },
  { name: "Nauru", flag: "🇳🇷" },
  { name: "Marshall Islands", flag: "🇲🇭" },
  { name: "Micronesia", flag: "🇫🇲" },
  { name: "Palau", flag: "🇵🇼" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Lebanon", flag: "🇱🇧" },
  //allez
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Chad", flag: "🇹🇩" },
  { name: "Mauritania", flag: "🇲🇷" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Zimbabwe", flag: "🇿🇼" },
  { name: "Zambia", flag: "🇿🇲" },
  { name: "Angola", flag: "🇦🇴" },
  { name: "Namibia", flag: "🇳🇦" },
  { name: "Botswana", flag: "🇧🇼" },
  { name: "Mauritius", flag: "🇲🇺" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Lesotho", flag: "🇱🇸" },
  { name: "Swaziland", flag: "🇸🇿" },
  { name: "Burundi", flag: "🇧🇮" },
  { name: "Rwanda", flag: "🇷🇼"},
  //come on for the last time
  { name: "Antarctica", flag: "🇦🇶" },
  { name: "Greenland", flag: "🇬🇱" },
  { name: "Faroe Islands", flag: "🇫🇴" },
  { name: "Iceland", flag: "🇮🇸" },
  { name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Ireland", flag: "🇮🇪" },
  //you understand me ?

];
countriesData.sort((a, b) => a.name.localeCompare(b.name));
