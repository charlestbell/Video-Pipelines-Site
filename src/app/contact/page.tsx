"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-4 max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Name
          </label>
          <input
            type="text"
            required
            className="w-full p-3 bg-[#282C30] rounded-lg border border-gray-700 text-gray-100 focus:outline-none focus:border-gray-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full p-3 bg-[#282C30] rounded-lg border border-gray-700 text-gray-100 focus:outline-none focus:border-gray-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Message
          </label>
          <textarea
            required
            rows={6}
            className="w-full p-3 bg-[#282C30] rounded-lg border border-gray-700 text-gray-100 focus:outline-none focus:border-gray-500"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-[#3A3F44] text-gray-100 rounded-lg hover:bg-[#444A50] transition-colors duration-200"
          type="submit"
        >
          Send Message
        </motion.button>
      </form>
    </motion.div>
  );
}
