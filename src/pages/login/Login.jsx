import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import HeroProfile from "../../components/HeroProfile";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";

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

      // Check if user is admin and redirect accordingly
      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
      <div>
        <HeroProfile />
        <div className="signup-wrapper space">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <form onSubmit={handleSubmit} className="signup-form bg-smoke">
                  <h2 className="form-title text-center mb-lg-35">
                    Login to Your Account
                  </h2>
                  <div className="form-group">
                    <label htmlFor="username">Email</label>
                    <input
                        name="username"
                        type="text"
                        placeholder="email"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"

                        onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input type="checkbox" name="signUpTerms" id="signUpTerms" />
                    <label htmlFor="signUpTerms">
                      I have read and agree to the website terms and conditions
                    </label>
                  </div>
                  <div className="form-group mb-0 text-center">
                    <button className="vs-btn w-100 style4" type="submit">
                      Login
                    </button>
                    {error && <div className="error-message text-danger">{error}</div>}
                    <div className="bottom-links link-inherit pt-3">
                    <span>
                      Don't have an account?{" "}
                      <Link className="text-theme" to="/register">
                        Sign up
                      </Link>
                    </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
}

export default Login;