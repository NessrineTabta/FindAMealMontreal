import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useNavigate } from "react-router-dom"; // ✅ Hook for navigation
import "../Css/ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "MessageReceived"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: serverTimestamp(),
      });

      setIsSubmitted(true);
      console.log("✅ Message stored in Firestore (MessageReceived collection)");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="contact-container">
      {/* ✅ Navbar – Properly Positioned at the Top */}
      <nav className="navbar">
        <h1 className="logo">💬 Contact Us</h1>
        <button className="home-btn" onClick={() => navigate("/")}>🏠 Home</button>
      </nav>

      <div className="contact-box">
        <h2 className="title-glow">📡 Contact Us</h2>
        <p className="subtitle">We’d love to hear from you! Send us a message 🚀</p>

        {isSubmitted ? (
          <div className="success-message">
            <h3>✅ Message Sent Successfully!</h3>
            <p>We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="neon-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="neon-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <textarea
                name="message"
                placeholder="Your Message"
                className="neon-textarea"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="send-btn">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
