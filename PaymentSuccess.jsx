
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  const payment = JSON.parse(
    localStorage.getItem("lastPayment") || "null"
  );

  const booking = JSON.parse(
    localStorage.getItem("currentBooking") || "null"
  );

  if (!payment || !booking) {
    return (
      <div className="success-page">
        <h2>No payment details found.</h2>
        <button onClick={() => navigate("/services")}>
          Go to Services
        </button>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parts = date.split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return date;
  };

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <span className="success-label">GLAMOUR GLOW</span>

        <h1>Payment Successful!</h1>

        <p className="success-message">
          Thank you for choosing Glamour Glow.
          Your appointment has been confirmed.
        </p>

        <div className="success-details">

          <div>
            <span>Booking ID</span>
            <strong>{booking.id}</strong>
          </div>

          <div>
            <span>Payment ID</span>
            <strong>{payment.id}</strong>
          </div>

          <div>
            <span>Customer Name</span>
            <strong>{payment.customerName}</strong>
          </div>

          <div>
            <span>Service</span>
            <strong>{payment.serviceName}</strong>
          </div>

          <div>
            <span>Appointment Date</span>
            <strong>{formatDate(booking.date)}</strong>
          </div>

          <div>
            <span>Appointment Time</span>
            <strong>{booking.time}</strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>{payment.method}</strong>
          </div>

          <div>
            <span>Payment Status</span>
            <strong className="success-status">
              Successful
            </strong>
          </div>

          <div className="success-amount">
            <span>Total Paid</span>
            <strong>₹{payment.amount}</strong>
          </div>

        </div>

        <p className="success-thanks">
          We look forward to seeing you!
        </p>

        <button
          className="success-button"
          onClick={() => window.print()}
        >
          PRINT RECEIPT
        </button>

        <button
          className="success-button"
          onClick={() => navigate("/services")}
        >
          BOOK ANOTHER SERVICE
        </button>

        <button
          className="success-home"
          onClick={() => navigate("/")}
        >
          BACK TO HOME
        </button>

      </div>
    </div>
  );
}

export default PaymentSuccess;
