"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-100 mb-8"
        >
          Contact
        </motion.h1>
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full py-3 bg-[#3A3F44] text-gray-100 rounded-lg hover:bg-[#444A50] transition-colors duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>

        {/* Contact Information */}
        <div className="mt-24 mb-16 space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-gray-100">C.T. Bell</h2>
            <a
              href="mailto:videopipelines@gmail.com"
              className="text-gray-300 hover:text-gray-100 transition-colors"
            >
              videopipelines@gmail.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-300 space-y-1"
          >
            <div className="font-semibold">Location:</div>
            <div>Lynchburg, Virginia</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
