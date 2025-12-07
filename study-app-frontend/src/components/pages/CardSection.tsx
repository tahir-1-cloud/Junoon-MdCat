'use client';

import { useEffect, useState } from "react";
import { LecturesModel } from "@/types/lecturesModel";
import { getLectures } from "@/services/lecturesServices";
import Link from "next/link";

export default function HomeLectures() {
  const [lectures, setLectures] = useState<LecturesModel[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data.slice(0, 6)); // show only 6
      } catch (err) {
        console.error("Error fetching lectures:", err);
      }
    };
    fetchLectures();
  }, []);

  const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <section className="relative min-h-screen bg-gray-50 py-24 px-6">
        {/* Header */}
      <div className="relative text-center mb-20 px-6">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-900">
          🌟 Comprehensive Learning Courses
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Engage with lectures, interactive exercises, and expert insights designed for MDCAT aspirants.
        </p>
        <div className="mt-8 h-1 w-24 bg-gradient-to-r from-yellow-400 to-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {lectures.map((lecture) => {
          const embedUrl = convertToEmbedUrl(lecture.youtubeUrl);
          return (
            <div
              key={lecture.id ?? lecture.title}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:border-blue-400 transition-transform hover:-translate-y-1 duration-300"
            >
              {/* Image / Video */}
              <div className="relative w-full h-64 bg-blue-100 overflow-hidden">
                {activeVideo === lecture.id?.toString() ? (
                  <iframe
                    className="w-full h-full"
                    src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${lecture.imageUrl}`}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setActiveVideo(lecture.id?.toString() ?? lecture.title)
                      }
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-3xl opacity-0 hover:opacity-100 transition-opacity"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {lecture.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {lecture.description}
                </p>
                
                {activeVideo === lecture.id?.toString() ? (
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-400 transition shadow-md"
                  >
                    ✖ Close Video
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setActiveVideo(lecture.id?.toString() ?? lecture.title)
                    }
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md"
                  >
                    ▶ Watch Lecture
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <Link
          href="/courses"
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 shadow-md transition"
        >
          Explore More Lectures
        </Link>
      </div>
    </section>
  );
}
