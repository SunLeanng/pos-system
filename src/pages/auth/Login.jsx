import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaStore,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(email, password);

      // Save login user + role
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Success message
      toast.success("Login successful");

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/sales");
      }

    } catch (error) {
      console.log(error);

      toast.error("Login failed");
    }
  };

  return (
    <div className="login-page">

      {/* Background overlay */}
      <div className="login-overlay"></div>


      {/* Login Card */}
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">

          <div className="login-logo-icon">
            <FaStore />
          </div>

          <div>
            <h2>POS SYSTEM</h2>
            <span>Point of Sale</span>
          </div>

        </div>


        {/* Header */}
        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Sign in to continue to your account
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* Email */}
          <div className="login-field">

            <label>
              Email Address
            </label>

            <div className="login-input">

              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* Password */}
          <div className="login-field">

            <label>
              Password
            </label>

            <div className="login-input">

              <FaLock />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* Login button */}
          <button
            type="submit"
            className="login-button"
          >

            <span>
              Sign In
            </span>

            <FaArrowRight />

          </button>

        </form>


        {/* Footer */}
        <div className="login-footer">

          <span>
            Secure Point of Sale System
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;