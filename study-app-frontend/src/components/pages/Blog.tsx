"use client";

import Image from "next/image";

const blogs = [
  {
    title: "Mastering Entry Tests: Tips & Strategies",
    desc: "Learn how to manage time, handle tricky questions, and stay calm under pressure during your entry test preparation.",
    img: "/images/Landingpage/blog1.png",
    date: "October 5, 2025",
    author: "Team StudyPro",
  },
  {
    title: "Top 10 Study Hacks for Smarter Learning",
    desc: "Discover scientifically proven methods to memorize faster, understand better, and stay focused longer.",
    img: "/images/Landingpage/blog3.jpg",
    date: "September 30, 2025",
    author: "Education Insights",
  },
  {
    title: "The Importance of Practice Tests",
    desc: "Regular practice tests improve your accuracy, confidence, and help identify weak areas before the real exam.",
    img: "/images/Landingpage/blog4.png",
    date: "September 25, 2025",
    author: "Study Experts",
  },
  {
    title: "Boost Your Memory Power Naturally",
    desc: "From nutrition to sleep patterns — explore how lifestyle choices can improve your brain’s retention ability.",
    img: "/images/Landingpage/blog2.jpg",
    date: "September 20, 2025",
    author: "MindFuel Academy",
  },
  {
    title: "Why Mock Exams Matter",
    desc: "Mock exams simulate the real test environment and teach you how to deal with stress and pacing effectively.",
    img: "/images/Landingpage/blog7.jpg",
    date: "September 15, 2025",
    author: "EduMentor Team",
  },
  {
    title: "Building Confidence Before Your Exam",
    desc: "Confidence can make or break your performance — learn powerful ways to stay calm and confident on test day.",
    img: "/images/Landingpage/blog5.jpg",
    date: "September 10, 2025",
    author: "Motivation Hub",
  },
];

export default function BlogPage() {
  return (
    <section className="bg-[#eff6ff] min-h-screen py-20 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[#22418c] mb-4 tracking-tight drop-shadow-sm">
          📚 Latest Insights & Study Blogs
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Stay informed with expert advice, motivation, and preparation strategies to help you succeed in your entry test journey.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-[#e3e9ff]"
          >
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={blog.img}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-sm opacity-90">{blog.date}</span>
                <h2 className="text-xl font-semibold mt-1">{blog.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">{blog.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#1447e6]">
                  ✍️ {blog.author}
                </span>
                <button className="px-4 py-2 rounded-full text-sm font-semibold text-[#22418c] bg-[#ffdf20] hover:bg-[#1447e6] hover:text-white shadow-md transition-all duration-300">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-24 max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-md border border-[#e3e9ff]">
        <h3 className="text-3xl font-semibold text-[#22418c] mb-4">
          Want to Stay Updated?
        </h3>
        <p className="text-gray-700 mb-8">
          Subscribe to our newsletter to get the latest updates on study tips, new courses, and motivational blogs delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-72 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
          />
          <button className="bg-[#1447e6] hover:bg-[#22418c] text-[#ffdf20] px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
