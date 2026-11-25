

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("adminLoggedIn", "true");
        setMessage("Login successful!");
        navigate("/admin-dashboard");
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch (error) {
      setMessage("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #2b1713, #754b35)",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fffaf5",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "38px", color: "#b8864b" }}>✦</div>
          <h1 style={{ color: "#4b281f", margin: "8px 0" }}>
            GLAMOUR GLOW
          </h1>
          <p style={{ color: "#98765c" }}>ADMIN LOGIN</p>
        </div>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Admin Email
          </label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #d8c2ad",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
          />

          <label style={{ display: "block", marginBottom: "8px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #d8c2ad",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
          />

          {message && (
            <p style={{
              color: message === "Login successful!" ? "green" : "red",
              textAlign: "center"
            }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#70432f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Please wait..." : "LOGIN AS ADMIN →"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "25px",
          color: "#98765c",
          fontSize: "13px"
        }}>
          Glamour Glow Beauty Parlour
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
