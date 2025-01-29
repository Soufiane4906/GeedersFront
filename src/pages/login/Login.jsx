import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  const responseGoogle = (response) => {
    console.log(response);
    // Handle Google OAuth2 response here
    // You can send the response to your backend for further processing
  };

  return (
      <div className="login">
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <label htmlFor="">Username</label>
          <input
              name="username"
              type="text"
              placeholder="johndoe"
              onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="">Password</label>
          <input
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <span className="error">{error}</span>}

          <div className="oauth-buttons">
            <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                buttonText="Sign in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
          </div>
        </form>
      </div>
  );
}

export default Login;