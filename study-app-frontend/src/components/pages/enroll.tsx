"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, BookOpen, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import { enrollStudent } from "@/services/enrollmentService";
import { studentEnrollment } from "@/types/studentEnrollment";

export default function EnrollPage() {
  const [formData, setFormData] = useState<studentEnrollment>({
    fullName: "",
    email: "",
    phoneNumber: "",
    preferredCourse: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  // Generic handler for all input fields
  const handleChange = (field: keyof studentEnrollment, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.preferredCourse) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await enrollStudent(formData);
      toast.success("Enrollment successful!");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        preferredCourse: "",
        city: "",
      });
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 via-white to-blue-100 opacity-60 blur-2xl -z-10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10"></div>

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
          Join Our Entry Test Preparation 🚀
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Get ready to achieve your academic goals with expert-led mock tests,
          personalized guidance, and hands-on practice sessions designed for real
          entry exam success.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-14 items-center w-full max-w-6xl">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-blue-200 p-10 hover:shadow-blue-300 transition-shadow duration-300"
        >
          <h3 className="text-3xl font-bold text-[#22418c] mb-6 flex items-center gap-2">
            <GraduationCap className="text-blue-600" /> Enroll Now
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow hover:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow hover:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <Phone className="text-gray-500 ml-3" size={18} />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Preferred Course</label>
              <select
                value={formData.preferredCourse}
                onChange={(e) => handleChange("preferredCourse", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow hover:shadow-sm"
              >
                <option value="">Select a course</option>
                <option value="Medical Entry Test">Medical Entry Test</option>
                <option value="Engineering Entry Test">Engineering Entry Test</option>
                <option value="Commerce Preparation">Commerce Preparation</option>
                <option value="General Aptitude">General Aptitude</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">City (Optional)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Enter your city"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow hover:shadow-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-full font-semibold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} /> {loading ? "Submitting..." : "Submit Enrollment"}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            We’ll contact you soon with course details and study guidance. 💡
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center items-center relative"
        >
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] group">
            <Image
              src="/images/Landingpage/enrolestd.jpg"
              alt="Student Enrollment"
              fill
              className="object-cover rounded-[2rem] shadow-2xl border-4 border-blue-300 group-hover:scale-105 transition-transform duration-500 ease-in-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>
          </div>

          {/* Floating Info */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-10 bg-white p-3 rounded-2xl shadow-lg border border-blue-100 flex items-center gap-2"
          >
            <BookOpen className="text-indigo-600" />{" "}
            <span className="text-sm font-medium">1000+ Practice Tests</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
