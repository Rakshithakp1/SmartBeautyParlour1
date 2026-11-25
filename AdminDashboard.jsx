
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

useEffect(() => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        navigate("/admin-login", { replace: true });
    }
}, [navigate]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Dashboard data load failed");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message || "Unable to load dashboard");
        }
        setDashboard(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  const money = (value) =>
    "₹" + Number(value || 0).toLocaleString("en-IN");

  const cardStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)"
  };

  const headingStyle = {
    color: "#4b281f",
    marginBottom: "18px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px"
  };

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    background: "#f4e8dc",
    color: "#542d23",
    fontSize: "14px"
  };

  const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid #eee",
    color: "#444",
    fontSize: "14px"
  };

  const badgeStyle = {
    background: "#e3f5e8",
    color: "#23743c",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>
      Loading Admin Dashboard...
    </h2>;
  }

  if (error) {
    return <h3 style={{ textAlign: "center", color: "red", marginTop: "100px" }}>
      {error}
    </h3>;
  }

  if (!dashboard) return null;

  const stats = dashboard.statistics;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f3ef",
      padding: "30px",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(120deg, #3b211b, #80543c)",
        color: "white",
        padding: "30px",
        borderRadius: "18px",
        marginBottom: "30px"
      }}>
        <h1 style={{ margin: 0 }}>Glamour Glow</h1>
        <h2 style={{ marginBottom: "8px" }}>Admin Dashboard</h2>
        <button
    onClick={() => navigate("/admin-services")}
    style={{
        background: "#d4a45f",
        color: "#3b211b",
        border: "none",
        padding: "12px 25px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "15px",
        marginRight: "10px"
    }}
>
    Manage Services
</button>
        <button
    onClick={() => {
        sessionStorage.removeItem("adminLoggedIn");
        navigate("/admin-login");
    }}
    style={{
        background: "#d4a45f",
        color: "#3b211b",
        border: "none",
        padding: "12px 25px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "15px"
    }}
>
    Logout
</button>
        <p style={{ margin: 0, color: "#f3dfca" }}>
          Welcome to Glamour Glow Management System
        </p>
      </div>

      {/* Statistics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {[
          { title: "Total Customers", value: stats.totalCustomers, icon: "👥" },
          { title: "Total Bookings", value: stats.totalBookings, icon: "📅" },
          { title: "Total Services", value: stats.totalServices, icon: "💇" },
          { title: "Total Revenue", value: money(stats.totalRevenue), icon: "💰" }
        ].map((item) => (
          <div key={item.title} style={{
            ...cardStyle,
            borderLeft: "5px solid #b8864b"
          }}>
            <div style={{ fontSize: "30px" }}>{item.icon}</div>
            <p style={{ color: "#777", marginBottom: "8px" }}>{item.title}</p>
            <h2 style={{ color: "#4b281f", margin: 0 }}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <section style={{ ...cardStyle, marginBottom: "25px" }}>
        <h2 style={headingStyle}>📅 Recent Bookings</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Booking ID", "Customer", "Service", "Date", "Time", "Amount", "Status"].map((x) => (
                  <th key={x} style={thStyle}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.recentBookings.length === 0 ? (
                <tr><td colSpan="7" style={tdStyle}>No bookings found</td></tr>
              ) : dashboard.recentBookings.map((b) => (
                <tr key={b.booking_id}>
                  <td style={tdStyle}>#{b.booking_id}</td>
                  <td style={tdStyle}>{b.customer_name}</td>
                  <td style={tdStyle}>{b.service_name}</td>
                  <td style={tdStyle}>{formatDate(b.booking_date)}</td>
                  <td style={tdStyle}>{b.booking_time}</td>
                  <td style={tdStyle}>{money(b.amount)}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Payments */}
      <section style={{ ...cardStyle, marginBottom: "25px" }}>
        <h2 style={headingStyle}>💳 Recent Payments</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Payment ID", "Booking ID", "Customer", "Service", "Amount", "Method", "Status"].map((x) => (
                  <th key={x} style={thStyle}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.recentPayments.length === 0 ? (
                <tr><td colSpan="7" style={tdStyle}>No payments found</td></tr>
              ) : dashboard.recentPayments.map((p) => (
                <tr key={p.payment_id}>
                  <td style={tdStyle}>#{p.payment_id}</td>
                  <td style={tdStyle}>#{p.booking_id}</td>
                  <td style={tdStyle}>{p.customer_name}</td>
                  <td style={tdStyle}>{p.service_name}</td>
                  <td style={tdStyle}>{money(p.amount)}</td>
                  <td style={tdStyle}>{p.payment_method}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{p.payment_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer Feedback */}
      <section style={{ ...cardStyle, marginBottom: "25px" }}>
        <h2 style={headingStyle}>⭐ Customer Feedback</h2>

        {dashboard.recentFeedback.length === 0 ? (
          <p>No feedback available</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px"
          }}>
            {dashboard.recentFeedback.map((f) => (
              <div key={f.feedback_id} style={{
                background: "#fffaf5",
                border: "1px solid #ead9c8",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h3 style={{ color: "#4b281f", marginTop: 0 }}>
                  {f.customer_name}
                </h3>
                <p style={{ color: "#a87530", fontSize: "20px", margin: "8px 0" }}>
                  {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                  <span style={{ fontSize: "13px", color: "#777" }}>
                    {" "}({f.rating}/5)
                  </span>
                </p>
                <p><b>Service:</b> {f.service_name}</p>
                <p><b>Booking:</b> #{f.booking_id}</p>
                <p style={{ color: "#666" }}>
                  "{f.comments || "No comments"}"
                </p>
                <small style={{ color: "#999" }}>
                  {formatDate(f.created_at)}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <p style={{
        textAlign: "center",
        color: "#98765c",
        marginTop: "30px"
      }}>
        © 2026 Glamour Glow | Admin Management System
      </p>

    </div>
  );
}

export default AdminDashboard;
