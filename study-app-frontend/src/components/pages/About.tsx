"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-[#eff6ff] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#1447e6_1px,transparent_0)] bg-[length:40px_40px]" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
          About Junoon MDCAT
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
          Welcome to <span className="font-semibold text-[#1447e6]">Junoon MDCAT</span> — your trusted companion for entry test preparation.  
          We empower aspiring medical students to achieve their dreams with focused, personalized, and high-quality learning resources.
        </p>
      </motion.div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full items-center z-10 bg-white rounded-3xl shadow-lg p-8 md:p-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-[550px] h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-[#eff6ff]">
            <Image
              src="/images/Landingpage/exprtwaqasupdate1.jpg"
              alt="Students studying"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-700 leading-relaxed px-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#22418c] mb-4">
            Our Mission
          </h2>
          <p className="text-base md:text-lg">
            At <span className="font-semibold text-[#1447e6]">Junoon MDCAT</span>, our mission is to make entry test preparation simple, efficient, and effective for every aspiring student.  
            From <strong>MDCAT</strong> to other medical entry tests, our platform provides expertly designed mock tests, past papers, and performance tracking to help you study smarter — not harder.

            At  <span className="font-semibold text-[#1447e6]">Junoon MDCAT</span>, we ignite the unstoppable drive in every student to conquer the <strong>MDCAT</strong>  and turn their biggest dreams into reality! 
            Every student carries a vision for their future, and with the right guidance, strategy, and relentless effort, no dream is too big.
             We don’t just teach—we empower, inspire, and push you beyond limits, transforming stress into strength and ambition into achievement.
             Every lesson, every strategy, every practice test is designed to fuel your journey and make success inevitable. At Junoon, we are more than a coaching center—we are a family, committed to serving yours by helping fulfill your child’s dreams.
              Let’s aim high, work together, and win together with unstoppable <strong>Junoon!</strong> 
          </p>
        </motion.div>
      </div>

      {/* Core Values Section */}
      <div className="mt-20 text-center max-w-6xl w-full z-10 bg-[#eff6ff] p-10 rounded-3xl shadow-md">
        <h2 className="text-3xl md:text-4xl font-bold text-[#22418c] mb-10 drop-shadow-sm">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              title: "Excellence",
              desc: "We provide top-quality educational content and a structured learning path to help students succeed.",
              icon: "🎯",
            },
            {
              title: "Innovation",
              desc: "We leverage technology to make learning interactive, personalized, and effective for every student.",
              icon: "💡",
            },
            {
              title: "Support",
              desc: "Our team is committed to guiding students step by step toward their academic goals.",
              icon: "🤝",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#eff6ff]"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-[#22418c] mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
