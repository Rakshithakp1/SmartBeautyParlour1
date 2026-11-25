
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const navigate = useNavigate();

  const customerId = localStorage.getItem("customerId");

  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/bookings/${customerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load bookings");
        }
        return response.json();
      })
      .then((data) => setBookings(data))
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load your bookings.");
      });
  }, [customerId, navigate]);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!bookingId || rating === 0 || !comments.trim()) {
      setMessage("Please select booking, rating and enter feedback.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          bookingId: Number(bookingId),
          rating,
          comments
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Feedback submission failed");
      }

      setMessage("Thank you! Your feedback submitted successfully!");
      setRating(0);
      setBookingId("");
      setComments("");

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>GLAMOUR GLOW</h1>

        <h2 style={styles.heading}>Share Your Feedback</h2>

        <p style={styles.subtitle}>
          Your opinion helps us improve our beauty services.
        </p>

        <form onSubmit={submitFeedback}>
          <label style={styles.label}>Select Your Booking</label>

          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Booking</option>

            {bookings.map((booking) => (
              <option
                key={booking.booking_id}
                value={booking.booking_id}
              >
                Booking #{booking.booking_id} - {booking.service_name}
              </option>
            ))}
          </select>

          <label style={styles.label}>Rate Your Experience</label>

          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  ...styles.star,
                  color: star <= rating ? "#f5b301" : "#cccccc"
                }}
              >
                ★
              </span>
            ))}
          </div>

          <p style={styles.ratingText}>
            {rating === 0
              ? "Select your rating"
              : `${rating} out of 5 stars`}
          </p>

          <label style={styles.label}>Your Comments</label>

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write your experience here..."
            rows="5"
            style={styles.textarea}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
          </button>
        </form>

        {message && (
          <p style={styles.message}>{message}</p>
        )}

        <button
          onClick={() => navigate("/")}
          style={styles.homeButton}
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #21130f, #68452f)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 15px",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    background: "#fffaf4",
    width: "100%",
    maxWidth: "550px",
    padding: "35px",
    borderRadius: "18px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  logo: {
    color: "#8b5e3c",
    letterSpacing: "3px",
    fontSize: "26px"
  },
  heading: {
    color: "#39251b",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#777",
    marginBottom: "30px"
  },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    color: "#493326",
    marginTop: "20px",
    marginBottom: "9px"
  },
  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #d8c4b3",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white"
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "12px"
  },
  star: {
    fontSize: "42px",
    cursor: "pointer"
  },
  ratingText: {
    color: "#8b5e3c",
    fontWeight: "bold"
  },
  textarea: {
    width: "100%",
    padding: "13px",
    border: "1px solid #d8c4b3",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "15px",
    marginTop: "25px",
    background: "#8b5e3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  message: {
    marginTop: "18px",
    color: "#68452f",
    fontWeight: "bold"
  },
  homeButton: {
    marginTop: "18px",
    padding: "11px 20px",
    background: "transparent",
    color: "#8b5e3c",
    border: "1px solid #8b5e3c",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Feedback;
