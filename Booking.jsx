
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();

  const service = JSON.parse(
    localStorage.getItem("selectedService") || "null"
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!service) {
      alert("Please select a service first.");
      navigate("/services");
      return;
    }

    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          serviceId: Number(service.id),
          bookingDate: date,
          bookingTime: time
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed.");
        return;
      }

      const booking = {
        id: data.bookingId,
        customerId: Number(customerId),
        customerName: localStorage.getItem("customerName"),
        serviceName: service.name,
        price: Number(data.amount),
        date,
        time,
        status: "Confirmed"
      };

      localStorage.setItem("currentBooking", JSON.stringify(booking));

      alert("Booking saved successfully!");

      navigate("/payment");

    } catch (error) {
      console.error("Booking Error:", error);
      alert("Backend connection failed. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="booking-page">
        <h2>No service selected</h2>
        <button onClick={() => navigate("/services")}>
          View Services
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-box">
        <a href="/services" className="booking-back">
          ← Back to Services
        </a>

        <span className="booking-label">GLAMOUR GLOW</span>
        <h1>Book Your Appointment</h1>
        <p className="booking-subtitle">
          Choose your preferred date and time.
        </p>

        <div className="selected-service">
          <div>
            <span>SELECTED SERVICE</span>
            <h2>{service.name}</h2>
            <p>Duration: {service.duration}</p>
          </div>
          <strong>₹{service.price}</strong>
        </div>

        <form onSubmit={handleBooking}>
          <div className="booking-field">
            <label>Appointment Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="booking-field">
            <label>Appointment Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Select a time</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          <div className="booking-total">
            <span>Total Amount</span>
            <strong>₹{service.price}</strong>
          </div>

          <button
            type="submit"
            className="booking-confirm"
            disabled={loading}
          >
            {loading ? "PLEASE WAIT..." : "CONFIRM BOOKING & CONTINUE"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
