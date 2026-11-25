
import React, { useEffect, useState } from "react";

function AdminServices() {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [image, setImage] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    const loadServices = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/services");
            const data = await response.json();
            setServices(Array.isArray(data) ? data : data.services || []);
        } catch (error) {
            setMessage("Services load failed");
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const clearForm = () => {
        setServiceName("");
        setPrice("");
        setDuration("");
        setImage("");
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const serviceData = {
            service_name: serviceName,
            price: Number(price),
            duration: Number(duration),
            image
        };

        try {
            const response = await fetch(
                editId
                    ? `http://localhost:5000/api/admin/services/${editId}`
                    : "http://localhost:5000/api/admin/services",
                {
                    method: editId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serviceData)
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                clearForm();
                loadServices();
            } else {
                setMessage(data.message || "Operation failed");
            }
        } catch (error) {
            setMessage("Backend connection failed");
        }
    };

    const handleEdit = (service) => {
        setEditId(service.service_id);
        setServiceName(service.service_name);
        setPrice(service.price);
        setDuration(service.duration);
        setImage(service.image || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/services/${id}`,
                { method: "DELETE" }
            );

            const data = await response.json();
            setMessage(data.message);
            if (data.success) loadServices();
        } catch (error) {
            setMessage("Delete failed");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f8f3ef",
            padding: "30px",
            fontFamily: "Arial"
        }}>
            <h1 style={{ color: "#4b281f" }}>
                Glamour Glow - Manage Services
            </h1>

            <form onSubmit={handleSubmit} style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                maxWidth: "600px",
                marginBottom: "30px"
            }}>
                <h2>{editId ? "Update Service" : "Add New Service"}</h2>

                <input
                    placeholder="Service Name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="1"
                    required
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    required
                    style={inputStyle}
                />

                <input
                    placeholder="Image URL (optional)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    {editId ? "Update Service" : "Add Service"}
                </button>

                {editId && (
                    <button type="button" onClick={clearForm}
                        style={{ ...buttonStyle, background: "#777" }}>
                        Cancel
                    </button>
                )}

                {message && <p>{message}</p>}
            </form>

            <h2 style={{ color: "#4b281f" }}>All Services</h2>

            <div style={{ display: "grid", gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px" }}>
                {services.map((service) => (
                    <div key={service.service_id} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "14px",
                        boxShadow: "0 4px 12px #00000012"
                    }}>
                    <h3 style={{
    color: "#3b211b",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px"
}}>
    {service.service_name}
</h3>
                        <p style={{ color: "#444", fontSize: "16px" }}>
    Price: ₹{service.price}
</p>

<p style={{ color: "#444", fontSize: "16px" }}>
    Duration: {service.duration} minutes
</p>

                        <button onClick={() => handleEdit(service)}
                            style={buttonStyle}>
                            Edit
                        </button>

                        <button onClick={() => handleDelete(service.service_id)}
                            style={{ ...buttonStyle, background: "#b33a32" }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const inputStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "7px"
};

const buttonStyle = {
    background: "#80543c",
    color: "white",
    border: "none",
    padding: "11px 18px",
    margin: "5px",
    borderRadius: "7px",
    cursor: "pointer"
};

export default AdminServices;
