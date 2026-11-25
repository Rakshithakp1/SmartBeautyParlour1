
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerName = localStorage.getItem("customerName") || "";
  const customerId = localStorage.getItem("customerId");

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    return date.toLocaleDateString("en-GB", {
      timeZone: "UTC"
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!customerId) {
        alert("Please login to view your bookings.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${customerId}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Booking History Error:", error);
        alert("Unable to load bookings. Please check backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [customerId, navigate]);

  return (
    <div className="mybookings-page">
      <div className="mybookings-header">
        <h1>GLAMOUR GLOW</h1>
        <h2>My Bookings</h2>
        <p>View your beauty appointments and payment details.</p>
      </div>

      <div className="mybookings-container">
        {loading ? (
          <div className="no-bookings">
            <h3>Loading Your Bookings...</h3>
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No Bookings Found</h3>
            <p>You have not booked any appointments yet.</p>
            <button onClick={() => navigate("/services")}>
              EXPLORE SERVICES
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              className="booking-history-card"
              key={booking.booking_id}
            >
              <div className="booking-history-top">
                <h3>{booking.service_name}</h3>
                <span className="booking-status">
                  {booking.status || "Pending"}
                </span>
              </div>

              <div className="booking-history-details">
                <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Date:</strong> {formatDate(booking.booking_date)}</p>
                <p><strong>Time:</strong> {booking.booking_time}</p>
                <p><strong>Duration:</strong> {booking.duration} min</p>
                <p><strong>Amount:</strong> ₹{booking.amount}</p>
                <p><strong>Payment Method:</strong> {booking.payment_method || "Not Paid"}</p>
                <p><strong>Payment Status:</strong> {booking.payment_status || "Pending"}</p>
              </div>
            </div>
          ))
        )}

        <button
          className="back-services-btn"
          onClick={() => navigate("/services")}
        >
          BOOK ANOTHER SERVICE
        </button>

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}

export default MyBookings;
