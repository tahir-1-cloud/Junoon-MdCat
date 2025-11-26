// components/Instructors.tsx

"use client";
import { useEffect, useRef, useState } from "react";

const instructors = [
  {
    name: "Prof. Waqas Ahmed",
    subject: "Biology Expert",
    exp: "10+ Years Experience",
    img: "/images/Landingpage/exprtwaqasupdate.jpg",
  },
  {
    name: "Prof. Haseeb Uzair",
    subject: "Chemistry Instructor",
    exp: "8+ Years Experience",
    img: "/images/Landingpage/expertuzair1.jpg",
  },
  {
    name: "Shafique Rafique",
    subject: "Physics Mentor",
    exp: "12+ Years Experience",
    img: "/images/Landingpage/exprtshafiq1.jpg",
  },
  {
    name: "Miss Ayesha Noor",
    subject: "English Trainer",
    exp: "6+ Years Experience",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Farah Nadeem",
    subject: "Mathematics Expert",
    exp: "9+ Years Experience",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
  },
];

const Instructors = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let autoScrollTimer: NodeJS.Timeout;

    const autoScroll = () => {
      if (!isUserInteracting) {
        const nextScroll = container.scrollLeft + 300; // move one card forward smoothly
        container.scrollTo({
          left:
            nextScroll >= container.scrollWidth - container.clientWidth
              ? 0
              : nextScroll,
          behavior: "smooth",
        });
      }
    };

    // Auto-scroll every 5 seconds
    autoScrollTimer = setInterval(autoScroll, 2000);

    const handleUserStart = () => setIsUserInteracting(true);
    const handleUserEnd = () => setTimeout(() => setIsUserInteracting(false), 3000);

    container.addEventListener("mousedown", handleUserStart);
    container.addEventListener("touchstart", handleUserStart);
    container.addEventListener("mouseup", handleUserEnd);
    container.addEventListener("touchend", handleUserEnd);
    container.addEventListener("wheel", handleUserStart, { passive: true });

    return () => {
      clearInterval(autoScrollTimer);
      container.removeEventListener("mousedown", handleUserStart);
      container.removeEventListener("touchstart", handleUserStart);
      container.removeEventListener("mouseup", handleUserEnd);
      container.removeEventListener("touchend", handleUserEnd);
      container.removeEventListener("wheel", handleUserStart);
    };
  }, [isUserInteracting]);

  return (
    <section className="bg-gradient-to-b from-[#eef3ff] to-[#e3eaff] py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-6 drop-shadow-md">
          Meet Our Expert Instructors
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Learn from the best! Our experienced instructors are passionate about helping you achieve top results in your entry tests.
        </p>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-4 px-2 cursor-grab active:cursor-grabbing"
        >
          {instructors.concat(instructors).map((inst, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-white/90 backdrop-blur-sm border-2 border-[#a6c8ff] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6 text-center"
            >
              <img
                src={inst.img}
                alt={inst.name}
                className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-[3px] border-[#a6c8ff] shadow-sm"
              />
              <h3 className="text-lg font-semibold text-[#22418c] mb-1">
                {inst.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">{inst.subject}</p>
              <p className="text-gray-500 text-xs">{inst.exp}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;
