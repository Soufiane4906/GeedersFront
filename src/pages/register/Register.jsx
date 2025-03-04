import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCity, faLanguage } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaApple, FaGoogle, FaPaypal } from "react-icons/fa";
import HeroProfile from "../../components/HeroProfile";
import { Link } from 'react-router-dom';

// toast.configure();
import Footer from "../../components/footer/Footer";

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
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          country: selectedCountry,
        }
      );
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
  const [paymentMethod, setPaymentMethod] = useState("");

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
        toast.info(
          "Your registration is complete. Your account will be verified soon. Meanwhile, you can access the platform to post your service."
        );
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
            <div className="signup-wrapper space">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6">
                    <form className="signup-form bg-smoke p-4 rounded">
                      <h1 className="form-title text-center mb-lg-35">
                        Register
                      </h1>

                      <div className="form-group">
                        <label htmlFor="username" className="sr-only">
                          Username
                        </label>
                        <input
                          name="username"
                          type="text"
                          placeholder="Username"
                          value={user.username}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="sr-only">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="Email address"
                          value={user.email}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password" className="sr-only">
                          Password
                        </label>
                        <input
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={user.password}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="profile" className="sr-only">
                          Profile Picture
                        </label>
                        <input
                          name="profile"
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <input type="checkbox" id="signUpTerms" />
                        <label htmlFor="signUpTerms" className="ml-2">
                          I have read and agree to the website terms and
                          conditions
                        </label>
                      </div>

                      <div className="form-group mb-0 text-center">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="vs-btn w-100 style4"
                        >
                          Next
                        </button>

                        <div className="bottom-links link-inherit pt-3">
                          <span>
                            Already have an account?{" "}
                            <Link className="text-theme" to="/Login">
                              Sign in
                            </Link>
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="signup-wrapper space">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <form className="signup-form bg-smoke p-4 rounded">
                    <h1 className="form-title text-center mb-lg-35">
                      Guide Registration
                    </h1>

                    <div className="form-group toggle">
                      <label htmlFor="isSeller">
                        Do you want to be a guide?
                      </label>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.isSeller}
                          onChange={handleSeller}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="sr-only">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        type="text"
                        placeholder="+1 234 567 89"
                        value={user.phone}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    {user.isSeller && (
                      <div className="form-group">
                        <label htmlFor="desc" className="sr-only">
                          Description
                        </label>
                        <textarea
                          name="desc"
                          placeholder="A short description of yourself"
                          cols="30"
                          rows="5"
                          value={user.desc}
                          onChange={handleChange}
                          className="form-control"
                        ></textarea>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="country">
                        <FontAwesomeIcon icon={faGlobe} /> Country
                      </label>
                      <select
                        name="country"
                        value={user.country}
                        onChange={handleCountryChange}
                        className="form-control"
                      >
                        <option value="">Select Country</option>
                        {countriesData.map((country) => (
                          <option key={country.name} value={country.name}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="city">
                        <FontAwesomeIcon icon={faCity} /> City
                      </label>
                      <select
                        name="city"
                        value={user.city}
                        onChange={handleCityChange}
                        className="form-control"
                        disabled={!showCity}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {user.isSeller && (
                      <>
                        <div className="identity-type text-center">
                          <h2>Select Identity Type</h2>
                          <div className="radio-group">
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
                            <div className="form-group">
                              <label htmlFor="recto">CIN Recto</label>
                              <input
                                name="recto"
                                type="file"
                                onChange={handleFileChange}
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="verso">CIN Verso</label>
                              <input
                                name="verso"
                                type="file"
                                onChange={handleFileChange}
                                className="form-control"
                              />
                            </div>
                          </>
                        )}

                        {identityType === "passport" && (
                          <div className="form-group">
                            <label htmlFor="passport">Passport</label>
                            <input
                              name="passport"
                              type="file"
                              onChange={handleFileChange}
                              className="form-control"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="buttons d-flex justify-content-between mt-3">
                      <button
                        type="button"
                        className="vs-btn back-button"
                        onClick={prevStep}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="vs-btn style4"
                        onClick={nextStep}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <>
            {user.isSeller && (
              <>
                <div className="payment-methods p-4 bg-smoke rounded">
                  <label
                    htmlFor="bank-transfer"
                    className="form-title mb-2 d-block"
                  >
                    Bank Transfer Method
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`payment-button ${
                        paymentMethod === "paypal" ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentMethodChange("paypal")}
                    >
                      <FaPaypal /> PayPal
                    </button>
                    <button
                      type="button"
                      className={`payment-button ${
                        paymentMethod === "applepay" ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentMethodChange("applepay")}
                    >
                      <FaApple /> Apple Pay
                    </button>
                    <button
                      type="button"
                      className={`payment-button ${
                        paymentMethod === "googlepay" ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentMethodChange("googlepay")}
                    >
                      <FaGoogle /> Google Pay
                    </button>
                  </div>
                </div>
                {paymentMethod && (
                  <div className="form-group mt-3">
                    <label htmlFor="accountNumber" className="sr-only">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      placeholder={`Enter your ${paymentMethod} account number`}
                      value={user.accountNumber}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      className="form-control"
                    />
                  </div>
                )}
              </>
            )}

            <div className="signup-wrapper space">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6">
                    <form action="#" className="signup-form bg-smoke">
                      <h2 className="form-title text-center mb-lg-35">
                        Create an account
                      </h2>

                      {/* Privacy Policy Checkbox */}
                      <div className="form-group">
                        <input
                          type="checkbox"
                          name="privacy"
                          checked={user.privacy}
                          onChange={handleChange}
                          id="privacy"
                        />
                        <label htmlFor="privacy">
                          I agree to the privacy policy and understand that my
                          data will be handled responsibly.
                        </label>
                      </div>

                      {/* Buttons Section */}
                      <div className="form-group mb-0 text-center">
                        <button
                          type="button"
                          className="vs-btn w-100 style4"
                          onClick={prevStep}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="vs-btn w-100 style4 mt-3"
                          disabled={!user.privacy}
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="signup-wrapper space">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-6">
                      <form action="#" className="signup-form bg-smoke">
                        <h2 className="form-title text-center mb-lg-35">
                          Create an account
                        </h2>

                        {/* Privacy Policy Checkbox */}
                        <div className="form-group">
                          <input
                            type="checkbox"
                            name="privacy"
                            checked={user.privacy}
                            onChange={handleChange}
                            id="privacy"
                          />
                          <label htmlFor="privacy">
                            I agree to the privacy policy and understand that my
                            data will be handled responsibly.
                          </label>
                        </div>

                        {/* Buttons Section */}
                        <div className="form-group mb-0 text-center">
                          <button
                            type="button"
                            className="vs-btn w-100 style4"
                            onClick={prevStep}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="vs-btn w-100 style4 mt-3"
                            disabled={!user.privacy}
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <HeroProfile />
      <div className="register"  style={{ "--step-count": step }}>
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
          <form onSubmit={handleSubmit}>{renderStep()}</form>
        </motion.div>
      </div>
      <Footer />
    </>
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
  { name: "Rwanda", flag: "🇷🇼" },
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
