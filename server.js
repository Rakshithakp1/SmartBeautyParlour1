
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.send("Glamour Glow Backend is Running Successfully!");
});

// Test MySQL Connection
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "MySQL Database Connected Successfully!"
        });
    });
});

// Get All Services
app.get("/api/services", (req, res) => {
    db.query(
        "SELECT * FROM services ORDER BY service_id",
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);
        }
    );
});

// Customer Registration
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO customers (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        success: false,
                        message: "Email already registered. Please login."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Registration successful!",
                customerId: result.insertId
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

// Customer Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password"
        });
    }

    const sql = "SELECT * FROM customers WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const customer = results[0];

        const isMatch = await bcrypt.compare(
            password,
            customer.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            customer: {
                customerId: customer.customer_id,
                name: customer.name,
                email: customer.email
            }
        });
    });
});

// Create New Booking
app.post("/api/bookings", (req, res) => {
    const { customerId, serviceId, bookingDate, bookingTime } = req.body;

    if (!customerId || !serviceId || !bookingDate || !bookingTime) {
        return res.status(400).json({
            success: false,
            message: "Please provide all booking details"
        });
    }

    const serviceSql = "SELECT price FROM services WHERE service_id = ?";

    db.query(serviceSql, [serviceId], (err, services) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const amount = services[0].price;

        const insertSql = `
            INSERT INTO bookings
            (customer_id, service_id, booking_date, booking_time, amount, status)
            VALUES (?, ?, ?, ?, ?, 'Confirmed')
        `;

        db.query(
            insertSql,
            [customerId, serviceId, bookingDate, bookingTime, amount],
            (insertError, result) => {
                if (insertError) {
                    return res.status(500).json({
                        success: false,
                        message: insertError.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Booking created successfully!",
                    bookingId: result.insertId,
                    amount: amount
                });
            }
        );
    });
});

// Get Customer Booking History with Payment Details
app.get("/api/bookings/:customerId", (req, res) => {
    const customerId = req.params.customerId;

    const sql = `
        SELECT
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.amount,
            b.status,
            s.service_name,
            s.duration,
            p.payment_method,
            p.payment_status
        FROM bookings b
        JOIN services s
            ON b.service_id = s.service_id
        LEFT JOIN payments p
            ON b.booking_id = p.booking_id
        WHERE b.customer_id = ?
        ORDER BY b.booking_id DESC
    `;

    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error("Booking History Error:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);
    });
});

// Save Payment
app.post("/api/payments", (req, res) => {
    const { bookingId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Please provide all payment details"
        });
    }

    const allowedMethods = ["UPI", "Card", "Cash"];

    if (!allowedMethods.includes(paymentMethod)) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment method"
        });
    }

    const sql = `
        INSERT INTO payments
        (booking_id, amount, payment_method, payment_status)
        SELECT booking_id, amount, ?, 'Success'
        FROM bookings
        WHERE booking_id = ? AND amount = ?
    `;

    db.query(sql, [paymentMethod, bookingId, amount], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Booking not found or amount mismatch"
            });
        }

        res.status(201).json({
            success: true,
            message: "Payment saved successfully!",
            paymentId: result.insertId
        });
    });
});
// Submit Customer Feedback
app.post("/api/feedback", (req, res) => {
    const { customerId, bookingId, rating, comments } = req.body;

    if (!customerId || !bookingId || !rating) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required details"
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    const sql = `
        INSERT INTO feedback
        (customer_id, booking_id, rating, comments)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customerId, bookingId, rating, comments || ""],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Feedback submitted successfully!",
                feedbackId: result.insertId
            });
        }
    );
});

// =====================================
// ADMIN DASHBOARD API
// =====================================

app.get("/api/admin/dashboard", (req, res) => {

    const statsSql = `
        SELECT
            (SELECT COUNT(*) FROM customers) AS totalCustomers,
            (SELECT COUNT(*) FROM bookings) AS totalBookings,
            (SELECT COUNT(*) FROM services) AS totalServices,
            (
                SELECT COALESCE(SUM(amount), 0)
                FROM payments
                WHERE payment_status = 'Success'
            ) AS totalRevenue
    `;

    db.query(statsSql, (err, stats) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const bookingsSql = `
            SELECT
                b.booking_id,
                c.name AS customer_name,
                s.service_name,
                b.booking_date,
                b.booking_time,
                b.amount,
                b.status
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN services s ON b.service_id = s.service_id
            ORDER BY b.booking_id DESC
            LIMIT 5
        `;

        db.query(bookingsSql, (err, bookings) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const paymentsSql = `
                SELECT
                    p.payment_id,
                    p.booking_id,
                    c.name AS customer_name,
                    s.service_name,
                    p.amount,
                    p.payment_method,
                    p.payment_status,
                    p.payment_date
                FROM payments p
                JOIN bookings b ON p.booking_id = b.booking_id
                JOIN customers c ON b.customer_id = c.customer_id
                JOIN services s ON b.service_id = s.service_id
                ORDER BY p.payment_id DESC
                LIMIT 5
            `;

            db.query(paymentsSql, (err, payments) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                const feedbackSql = `
                    SELECT
                        f.feedback_id,
                        c.name AS customer_name,
                        b.booking_id,
                        s.service_name,
                        f.rating,
                        f.comments,
                        f.created_at
                    FROM feedback f
                    JOIN customers c ON f.customer_id = c.customer_id
                    JOIN bookings b ON f.booking_id = b.booking_id
                    JOIN services s ON b.service_id = s.service_id
                    ORDER BY f.feedback_id DESC
                    LIMIT 5
                `;

                db.query(feedbackSql, (err, feedback) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        statistics: stats[0],
                        recentBookings: bookings,
                        recentPayments: payments,
                        recentFeedback: feedback
                    });

                });
            });
        });
    });
});
// ADMIN LOGIN API
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password"
        });
    }

    db.query(
        "SELECT * FROM admins WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const admin = results[0];

            const isMatch = await bcrypt.compare(
                password,
                admin.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            res.json({
                success: true,
                message: "Admin login successful!",
                admin: {
                    adminId: admin.admin_id,
                    name: admin.name,
                    email: admin.email
                }
            });
        }
    );
});
// ADMIN - ADD NEW SERVICE
app.post("/api/admin/services", (req, res) => {
    const { service_name, price, duration, image } = req.body;

    if (!service_name || !price || !duration) {
        return res.status(400).json({
            success: false,
            message: "Please enter all required details"
        });
    }

    const sql = `
        INSERT INTO services (service_name, price, duration, image)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [service_name, price, duration, image || ""],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Service could not be added"
                });
            }

            res.json({
                success: true,
                message: "Service added successfully!",
                serviceId: result.insertId
            });
        }
    );
});

// ADMIN - UPDATE SERVICE
app.put("/api/admin/services/:id", (req, res) => {
    const { service_name, price, duration, image } = req.body;
    const serviceId = req.params.id;

    const sql = `
        UPDATE services
        SET service_name = ?, price = ?, duration = ?, image = ?
        WHERE service_id = ?
    `;

    db.query(
        sql,
        [service_name, price, duration, image || "", serviceId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Service update failed"
                });
            }

            res.json({
                success: true,
                message: "Service updated successfully!"
            });
        }
    );
});

// ADMIN - DELETE SERVICE
app.delete("/api/admin/services/:id", (req, res) => {
    const serviceId = req.params.id;

    db.query(
        "DELETE FROM services WHERE service_id = ?",
        [serviceId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Service cannot be deleted. It may have existing bookings."
                });
            }

            res.json({
                success: true,
                message: "Service deleted successfully!"
            });
        }
    );
});
// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
