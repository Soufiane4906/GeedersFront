import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [files, setFiles] = useState({
    profile: null,
    recto: null,
    verso: null,
    passport: null,
  });

  const [identityType, setIdentityType] = useState(""); // State for identity type

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    imgRecto: "",
    imgVerso: "",
    imgPassport: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => {
      return { ...prev, [name]: files[0] };
    });
  };

  const handleIdentityChange = (e) => {
    setIdentityType(e.target.value);
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
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="profile">Profile Picture</label>
          <input
            name="profile"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="country">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h1>I want to become a guide</h1>
          <div className="toggle">
            <label htmlFor="isSeller">Activate the guide account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>

          <div className="identity-type">
            <h2>Select Identity Type</h2>
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
            <><label htmlFor="passport">Passport</label><input
              name="passport"
              type="file"
              onChange={handleFileChange} /></>
          )}
        </div>
      </form>
    </div>
  );
}

export default Register;
