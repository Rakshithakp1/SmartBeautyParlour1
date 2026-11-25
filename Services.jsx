
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const serviceImages = [
  "photo-1560869713-7d0a29430803",
  "photo-1522337360788-8b13dee7a37e",
  "photo-1560066984-138dadb4c035",
  "photo-1527799820374-dcf8d9d4a388",
  "photo-1512290923902-8a9f81dc236c",
  "photo-1515377905703-c4788e51af15",
  "photo-1487412947147-5cebf100ffc2",
  "photo-1524250502761-1ac6f2e30d43",
  "photo-1488426862026-3ee34a7d66df",
  "photo-1604654894610-df63bc536371",
  "photo-1519014816548-bf5fe059798b",
  "photo-1610992015732-2449b76344bc",
  "photo-1516975080664-ed2fc6a32937",
  "photo-1515377905703-c4788e51af15",
  "photo-1519415510236-718bdfcd89c8",
  "photo-1516975080664-ed2fc6a32937",
  "photo-1540555700478-4be289fbecef",
  "photo-1512290923902-8a9f81dc236c",
  "photo-1490481651871-ab68de25d43d",
  "photo-1601058268499-e52658b8bb88"
];

function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Services load failed");
        }
        return response.json();
      })
      .then((data) => {
        const updatedServices = data.map((service, index) => ({
          id: service.service_id,
          name: service.service_name,
          price: Number(service.price),
          duration: `${service.duration} min`,
          image: serviceImages[index] || serviceImages[0]
        }));

        setServices(updatedServices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Services Error:", err);
        setError("Services load ಆಗಲಿಲ್ಲ. Backend server check ಮಾಡಿ.");
        setLoading(false);
      });
  }, []);

  const handleBooking = (service) => {
    localStorage.setItem("selectedService", JSON.stringify(service));
    navigate("/booking");
  };

  const customerName =
    localStorage.getItem("customerName") || "Customer";

  return (
    <div className="services-page">
      <nav className="services-navbar">
        <a href="/" className="services-logo">Glamour Glow</a>

        <div className="services-nav-right">
          <span>Welcome, {customerName}</span>

          <button onClick={() => {
            localStorage.removeItem("customerName");
            localStorage.removeItem("customerEmail");
            navigate("/login");
          }}>
            Logout
          </button>
        </div>
      </nav>

      <header className="services-header">
        <span>OUR BEAUTY COLLECTION</span>
        <h1>Discover Our Services</h1>
        <p>
          Professional beauty care to make you look and feel your best.
        </p>
      </header>

      {loading && (
        <p style={{ textAlign: "center", padding: "30px" }}>
          Loading Beauty Services...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "red", padding: "30px" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <main className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <img
                src={`https://images.unsplash.com/${service.image}?auto=format&fit=crop&w=600&q=80`}
                alt={service.name}
              />

              <div className="service-card-content">
                <h3>{service.name}</h3>
                <p className="service-duration">
                  {service.duration}
                </p>

                <div className="service-card-bottom">
                  <strong>₹{service.price}</strong>

                  <button onClick={() => handleBooking(service)}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      )}

      <footer className="services-footer">
        © 2026 Glamour Glow Beauty Parlour. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Services;
