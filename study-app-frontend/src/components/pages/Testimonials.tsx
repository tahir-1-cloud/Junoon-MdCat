// components/Testimonials.tsx
'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: "Dr. Fatima Shoukat",
    quote: "This platform helped me secure top marks in my ECAT entry test — the mock tests were spot on! The questions were very similar to the actual exam.",
    university: "Nishter Medical University Multan",
    session: "Session 2023-2024",
    marks: "178 / 200",
    img: "/images/Landingpage/drfatima.jpg",
  },
  {
    name: "Dr. Afifa javed",
    quote: "EntryTestPro made preparation so easy! The lectures were clear, and mock tests improved my confidence significantly. Highly recommended!",
    university: "Ayub medical college Abbottabad",
    session: "Session 2023-2024",
    marks: "182 / 200",
    img: "/images/Landingpage/drafifa.jpg",
  },
   {
    name: "Dr Tayyab Naseer",
    quote: "The practice material was exceptional and closely matched the actual test pattern. Scored 185 thanks to their amazing guidance!",
    university: "Avicenna Medical College Lahore",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/drtayb1.jpg",
  },
  {
    name: "Syeda Nimra Gillani",
    quote: "Highly recommended! I cracked my NUMS test on the first try thanks to the detailed practice sessions and comprehensive study material.",
    university: "Poonch Medical College Rawalakot",
    session: "Session 2022-2023",
    marks: "171 / 200",
    img: "/images/Landingpage/drnimra.jpg",
  },
   {
    name: "Muhammad Shairaz Rumi",
    quote: "The practice material was exceptional and closely matched the actual test pattern. Scored 185 thanks to their amazing guidance!",
    university: "Rawalpindi medical university Rawalpindi",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/drunkown1.jpg",
  },
   {
    name: "Zain Shairaz",
    quote: "The practice material was exceptional and closely matched the actual test pattern. Scored 185 thanks to their amazing guidance!",
    university:"Rawalpindi Medical University Rawalpindi",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/drunkown2.jpg",
  },
   {
    name: "Arbab Khan",
    quote: "The practice material was exceptional and closely matched the actual test pattern. Scored 185 thanks to their amazing guidance!",
    university:"Abu Umara medical and dental college",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/drarbab.jpg",
  },
     {
    name: "Hifza Zahir",
    quote: "The practice material was exceptional and closely matched the actual test pattern. Scored 185 thanks to their amazing guidance!",
    university:"Poonch medical college",
    session: "Session 2023-2024",
    marks: "185 / 200",
  }
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section className="bg-[#eff6ff] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#22418c] mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from our students who achieved their dream university admissions
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:bg-gray-50 group"
            aria-label="Previous testimonial"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6 text-[#1447e6] group-hover:text-[#22418c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:bg-gray-50 group"
            aria-label="Next testimonial"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6 text-[#1447e6] group-hover:text-[#22418c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl">
            <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Student Image */}
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].img}
                    alt={testimonials[currentIndex].name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#1447e6] shadow-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="w-12 h-12 text-[#ffdf20] mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].quote}"
                  </p>

                  {/* Student Info */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#22418c] text-xl">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-600 font-medium">
                      {testimonials[currentIndex].university}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-gray-500 text-sm">
                        {testimonials[currentIndex].session}
                      </p>
                      <div className="bg-[#ffdf20] text-[#22418c] px-6 py-2 rounded-full font-bold text-lg shadow-md">
                        Marks: {testimonials[currentIndex].marks}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#1447e6] scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-[#1447e6] h-1 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials