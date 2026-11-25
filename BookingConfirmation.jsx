
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();

  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  const payment = JSON.parse(
    localStorage.getItem("lastPayment") || "null"
  );

  const booking = JSON.parse(
    localStorage.getItem("currentBooking") || "null"
  );

  const handlePrint = () => {
    window.print();

    // Print window close ಆದ ನಂತರ optional feedback popup
    setShowFeedbackPrompt(true);
  };

  const handleFeedback = () => {
    navigate("/feedback");
  };

  const handleSkip = () => {
    setShowFeedbackPrompt(false);
    navigate("/");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parts = date.split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return date;
  };

  if (!payment || !booking) {
    return (
      <div className="receipt-page">
        <div className="receipt-card">
          <h2>No booking or payment details found.</h2>
          <button onClick={() => navigate("/services")}>
            GO TO SERVICES
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <div className="receipt-success">✓</div>

        <h1>GLAMOUR GLOW</h1>
        <h2>Booking Confirmed!</h2>

        <p className="receipt-message">
          Thank you for choosing Glamour Glow.
          Your appointment has been successfully confirmed.
        </p>

        <div className="receipt-divider"></div>

        <h3>APPOINTMENT RECEIPT</h3>

        <div className="receipt-row">
          <span>Booking ID</span>
          <strong>{booking.id || payment.bookingId}</strong>
        </div>

        <div className="receipt-row">
          <span>Payment ID</span>
          <strong>{payment.id || "N/A"}</strong>
        </div>

        <div className="receipt-row">
          <span>Customer Name</span>
          <strong>
            {booking.customerName || payment.customerName || "N/A"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Service</span>
          <strong>
            {booking.serviceName || payment.serviceName || "N/A"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Appointment Date</span>
          <strong>{formatDate(booking.date)}</strong>
        </div>

        <div className="receipt-row">
          <span>Appointment Time</span>
          <strong>{booking.time || "N/A"}</strong>
        </div>

        <div className="receipt-row">
          <span>Payment Method</span>
          <strong>{payment.method || "N/A"}</strong>
        </div>

        <div className="receipt-row">
          <span>Payment Status</span>
          <strong className="receipt-paid">Successful</strong>
        </div>

        <div className="receipt-total">
          <span>Total Paid</span>
          <strong>₹{payment.amount || booking.price || 0}</strong>
        </div>

        <p className="receipt-thanks">
          We look forward to seeing you!
        </p>

        <div className="receipt-buttons">
          <button onClick={handlePrint}>
            PRINT RECEIPT
          </button>

          <button onClick={() => navigate("/services")}>
            BOOK ANOTHER SERVICE
          </button>

          <button onClick={() => navigate("/")}>
            BACK TO HOME
          </button>
        </div>
      </div>

      {showFeedbackPrompt && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.emoji}>⭐</div>

            <h2 style={styles.title}>
              Enjoyed Our Service?
            </h2>

            <p style={styles.description}>
              We would love to hear about your experience!
              Share your rating and feedback with Glamour Glow.
            </p>

            <button
              onClick={handleFeedback}
              style={styles.feedbackButton}
            >
              GIVE FEEDBACK
            </button>

            <button
              onClick={handleSkip}
              style={styles.skipButton}
            >
              SKIP FOR NOW
            </button>

            <p style={styles.optional}>
              Feedback is completely optional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 9999
  },
  popup: {
    background: "#fffaf4",
    width: "100%",
    maxWidth: "420px",
    padding: "35px 25px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(0,0,0,0.4)"
  },
  emoji: {
    fontSize: "48px",
    marginBottom: "10px"
  },
  title: {
    color: "#68452f",
    marginBottom: "12px"
  },
  description: {
    color: "#666",
    lineHeight: "1.7",
    marginBottom: "25px"
  },
  feedbackButton: {
    width: "100%",
    padding: "14px",
    background: "#8b5e3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  skipButton: {
    width: "100%",
    padding: "13px",
    marginTop: "12px",
    background: "transparent",
    color: "#68452f",
    border: "1px solid #8b5e3c",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  optional: {
    fontSize: "12px",
    color: "#999",
    marginTop: "18px"
  }
};

export default BookingConfirmation;
