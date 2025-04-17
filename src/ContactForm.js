import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import "./style.css";

function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSend = async () => {
    if (!fullName || !phone) {
      showNotification("error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("ContactOrder")
        .insert([{ FullName: fullName, Phone: phone }]);

      if (error) {
        console.error("Supabase error:", error.message);
        showNotification("error", "Error sending data");
      } else {
        showNotification("success", "Info sent successfully!");
        setFullName("");
        setPhone("");
      }
    } catch (error) {
      showNotification("error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>Contact Form</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          className={isLoading ? "loading" : ""}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? "✓" : "✕"} {notification.message}
        </div>
      )}
    </>
  );
}

export default ContactForm;
