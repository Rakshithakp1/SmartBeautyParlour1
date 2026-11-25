
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Services from "./Services";
import Booking from "./Booking";
import Payment from "./Payment";
import PaymentSuccess from "./PaymentSuccess";
import BookingConfirmation from "./BookingConfirmation";
import MyBookings from "./MyBookings";
import Feedback from "./Feedback";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import AdminServices from "./AdminServices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-services" element={<AdminServices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
