
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/register"
        : "http://localhost:5000/api/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          isRegister
            ? { name, email, password }
            : { email, password }
        )
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        alert("Registration successful! Please login.");

        setName("");
        setEmail("");
        setPassword("");
        setIsRegister(false);
      } else {
        localStorage.setItem("customerId", data.customer.customerId);
        localStorage.setItem("customerName", data.customer.name);
        localStorage.setItem("customerEmail", data.customer.email);

        alert("Login successful!");
        navigate("/services");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Backend connection failed. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-image">
        <div className="login-image-content">
          <h1>Glamour Glow</h1>
          <p>Beauty begins the moment you decide to be yourself.</p>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-form-box">
          <a href="/" className="back-home">← Back to Home</a>

          <span className="login-small-title">
            WELCOME TO GLAMOUR GLOW
          </span>

          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

          <p className="login-description">
            {isRegister
              ? "Register to begin your beauty journey."
              : "Login to book your favourite beauty services."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="login-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading
                ? "PLEASE WAIT..."
                : isRegister
                ? "REGISTER NOW"
                : "LOGIN"}
            </button>
          </form>

          <p className="login-switch">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? " Login" : " Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
