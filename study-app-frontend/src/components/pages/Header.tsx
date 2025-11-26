// components/Header.tsx
const Header = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white text-center py-28 md:py-36 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(18, 52, 59, 0.85), rgba(45, 84, 94, 0.9)), url('https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Boost Your <span className="text-yellow-300">Entry Test</span> Preparation
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
          Learn from expert instructors, take mock tests, and get ahead with personalized study plans.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 flex items-center gap-2">
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button className="border-2 border-yellow-300 text-yellow-300 px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 backdrop-blur-sm">
            View Courses
          </button>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 pt-8 border-t border-blue-400/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">99%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">1000+</div>
              <div className="text-sm text-blue-100">Mock Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">24/7</div>
              <div className="text-sm text-blue-100">Expert Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-20 right-16 w-6 h-6 bg-white rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-yellow-300 rounded-full opacity-30"></div>
    </section>
  )
}

export default Header