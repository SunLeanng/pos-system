import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaStore,
    FaEnvelope,
    FaLock,
    FaArrowRight,
    FaUserShield
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
    loginUser,
    loginDemoAccount
} from "../../services/authService";

import "../../styles/Login.css";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);


    // =========================
    // NORMAL LOGIN
    // =========================

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const user = await loginUser(
                email,
                password
            );

            // Save login user + role
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            toast.success(
                "Login successful"
            );

            // Redirect based on role
            if (user.role === "admin") {

                navigate("/dashboard");

            } else {

                navigate("/sales");

            }

        } catch (error) {

            console.log(error);

            toast.error(
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DEMO ACCOUNT LOGIN
    // =========================

    const handleDemoLogin = async () => {

        try {

            setDemoLoading(true);

            const user = await loginDemoAccount();

            // Save demo user + role
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            toast.success(
                "Demo Admin login successful"
            );

            // Go directly to Admin dashboard
            if (user.role === "admin") {

                navigate("/dashboard");

            } else {

                toast.error(
                    "Demo account is not configured as Admin"
                );

            }

        } catch (error) {

            console.log(error);

            toast.error(
                "Demo account is not available"
            );

        } finally {

            setDemoLoading(false);

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

                        <h2>
                            POS SYSTEM
                        </h2>

                        <span>
                            Point of Sale
                        </span>

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
                        disabled={loading || demoLoading}
                    >

                        <span>

                            {loading
                                ? "Signing In..."
                                : "Sign In"
                            }

                        </span>

                        {!loading && (
                            <FaArrowRight />
                        )}

                    </button>


                </form>


                {/* Divider */}
                <div className="demo-divider">

                    <span>
                        OR
                    </span>

                </div>


                {/* Demo Account Button */}
                <button
                    type="button"
                    className="demo-button"
                    onClick={handleDemoLogin}
                    disabled={loading || demoLoading}
                >

                    <FaUserShield />

                    <span>

                        {demoLoading
                            ? "Opening Demo..."
                            : "Use Demo Account"
                        }

                    </span>

                </button>


                {/* Demo information */}
                <p className="demo-info">

                    Use the demo account to explore
                    the POS system.

                </p>


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