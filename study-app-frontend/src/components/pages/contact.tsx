"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Thank you for contacting us! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-[#eff6ff] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#1447e6_1px,transparent_0)] bg-[length:40px_40px]" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
          Contact Us
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
          Have a question, feedback, or just want to say hello?  
          We’d love to hear from you! Our team at{" "}
          <span className="text-[#ffdf20] font-semibold">EduPrep</span> is always here to help.
        </p>
      </motion.div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16 z-10">
        {[
          { icon: "📧", title: "Email Us", info: "support@eduprep.com" },
          { icon: "📞", title: "Call Us", info: "+92 314 4099819" },
          { icon: "📍", title: "Visit Us", info: "Lahore, Pakistan" },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#eff6ff] text-center"
          >
            <div className="text-5xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#22418c] mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.info}</p>
          </motion.div>
        ))}
      </div>

      {/* Contact Form with Image Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        {/* Left Side Image Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#eff6ff]"
        >
          <img
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c36?auto=format&fit=crop&w=900&q=80"
            alt="Contact Support"
            className="w-full h-[480px] object-cover"
          />
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold text-[#22418c] mb-2">
              Let’s Get in Touch
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Whether you’re a student or educator, we’re here to assist you with 
              any inquiries about <span className="text-[#ffdf20] font-semibold">EduPrep</span>.
              Send us a message and our team will respond shortly.
            </p>
          </div>
        </motion.div>

        {/* Right Side Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#eff6ff]"
        >
          <h2 className="text-2xl font-bold text-[#22418c] mb-6 text-center">
            Send Us a Message
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full p-3 rounded-lg border border-[#eff6ff] focus:ring-2 focus:ring-[#1447e6] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full p-3 rounded-lg border border-[#eff6ff] focus:ring-2 focus:ring-[#1447e6] outline-none transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
              rows={5}
              className="w-full p-3 rounded-lg border border-[#eff6ff] focus:ring-2 focus:ring-[#1447e6] outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-10 py-3 bg-[#1447e6] hover:bg-[#22418c] text-[#ffdf20] font-bold rounded-full shadow-md hover:shadow-xl transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </motion.form>
      </div>

    </div>
  );
}
