"use client";

import { useState } from "react";
import Image from "next/image";

interface Course {
  title: string;
  desc: string;
  img: string;
  video: string;
}

const courses: Course[] = [
  {
    title: "Physics Lectures",
    desc: "Understand complex physics concepts with clarity and fun examples.",
    img: "/images/Landingpage/ph1.jpg",
    video: "https://youtu.be/q1Bn5Omoc7k?si=EqVhZvrPyVF8oWHr",
  },
  {
    title: "Chemistry Lectures",
    desc: "Master organic and inorganic chemistry through visuals and real-world demos.",
    img: "/images/Landingpage/chem.jpg",
    video: "https://youtu.be/yjHir7PkGcU?si=Cwv7ViHUTEJracPD",
  },
  {
    title: "Math Practice Tests",
    desc: "Sharpen your problem-solving skills with challenging mock tests.",
    img: "/images/Landingpage/math.jpg",
    video: "https://youtu.be/kMRWLz8G5SU?si=PiNJhiexy5vM_os2",
  },
  {
    title: "Biology Insights",
    desc: "Explore human anatomy, plants, and life sciences with detailed visuals.",
    img: "/images/Landingpage/Bio.jpg",
    video: "https://youtu.be/Sy2HMyB5-f4?si=oqowAgljVaFZPeOy",
  },
  {
    title: "English Comprehension",
    desc: "Boost your grammar, vocabulary, and comprehension with interactive lessons.",
    img: "/images/Landingpage/eng.jpg",
    video: "https://youtu.be/2YSO8k0OZ-0?si=keJe_78BEOE1nyJT",
  },
  {
    title: "General Knowledge",
    desc: "Stay updated with current affairs and test your IQ with fun quizzes.",
    img: "/images/Landingpage/genrl.jpg",
    video: "https://youtu.be/yjHir7PkGcU?si=Cwv7ViHUTEJracPD",
  },
];

const toEmbedUrl = (url: string): string => {
  try {
    if (url.includes("embed/")) return url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
};

const CardSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#e6f2ff] via-[#f5faff] to-[#fefefe] py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(180,210,255,0.25),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(255,245,200,0.25),transparent_60%)] pointer-events-none"></div>

      {/* Header */}
      <div className="relative text-center mb-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
          🌟 Comprehensive Learning Courses
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Engage with lectures, interactive exercises, and expert insights designed for MDCAT aspirants.
        </p>
        <div className="mt-8 h-1 w-24 bg-gradient-to-r from-yellow-400 to-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Courses Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {courses.map((course) => {
          const embedUrl = `${toEmbedUrl(course.video)}?autoplay=1&modestbranding=1&rel=0`;
          return (
            <div
              key={course.title}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 hover:border-blue-400 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
            >
              {/* Image / Video */}
              <div className="relative w-full h-64 bg-blue-100 overflow-hidden">
                {activeVideo === course.title ? (
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title={course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={course.img}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => setActiveVideo(course.title)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                        ▶
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-[#22418c] mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{course.desc}</p>
                {activeVideo === course.title ? (
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-400 transition shadow-md"
                  >
                    ✖ Close Video
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveVideo(course.title)}
                    className="bg-gradient-to-r from-blue-600 to-yellow-500 text-white font-semibold px-6 py-2 rounded-full hover:from-yellow-500 hover:to-blue-700 transition-all duration-300 shadow-md"
                  >
                    ▶ Watch Lecture
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore More Button */}
      <div className="relative text-center mt-20 z-10">
        <button
          className="bg-gradient-to-r from-yellow-400 to-blue-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          🌈 Explore More Courses
        </button>
      </div>
    </section>
  );
};

export default CardSection;
