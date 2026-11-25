
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const booking = JSON.parse(
    localStorage.getItem("currentBooking") || "null"
  );

  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!booking) {
      alert("Please book a service first.");
      navigate("/services");
      return;
    }

    if (!booking.id) {
      alert("Booking ID not found. Please book again.");
      navigate("/services");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookingId: Number(booking.id),
          amount: Number(booking.price),
          paymentMethod: method
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Payment failed.");
        return;
      }

      const payment = {
        id: data.paymentId,
        bookingId: booking.id,
        customerName: booking.customerName,
        serviceName: booking.serviceName,
        amount: booking.price,
        method,
        date: new Date().toLocaleDateString(),
        status: "Success"
      };

      localStorage.setItem("lastPayment", JSON.stringify(payment));

      const confirmedBooking = {
        ...booking,
        status: "Confirmed"
      };

      localStorage.setItem(
        "currentBooking",
        JSON.stringify(confirmedBooking)
      );

      alert("Payment successful! Payment saved in database.");

      navigate("/booking-confirmation");

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Backend connection failed. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="payment-page">
        <h2>No booking found</h2>
        <button onClick={() => navigate("/services")}>
          View Services
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-box">
        <a href="/booking" className="payment-back">
          ← Back to Booking
        </a>

        <span className="payment-label">GLAMOUR GLOW</span>
        <h1>Complete Your Payment</h1>
        <p className="payment-subtitle">
          Choose your preferred payment method.
        </p>

        <div className="payment-summary">
          <h3>Booking Summary</h3>

          <div className="payment-row">
            <span>Customer</span>
            <strong>{booking.customerName}</strong>
          </div>

          <div className="payment-row">
            <span>Service</span>
            <strong>{booking.serviceName}</strong>
          </div>

          <div className="payment-row">
            <span>Date</span>
            <strong>{booking.date}</strong>
          </div>

          <div className="payment-row">
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>

          <div className="payment-total">
            <span>Total Amount</span>
            <strong>₹{booking.price}</strong>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <h3 className="payment-method-heading">
            Select Payment Method
          </h3>

          <div className="payment-methods">
            {["UPI", "Card", "Cash"].map((item) => (
              <label
                key={item}
                className={`payment-option ${method === item ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={item}
                  checked={method === item}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="payment-submit"
            disabled={loading}
          >
            {loading ? "PROCESSING..." : `PAY ₹${booking.price}`}
          </button>

          <p className="payment-note">
            Demo payment only — no real money will be charged.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Payment;
