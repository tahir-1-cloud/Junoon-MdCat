import Link from "next/link"
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white pt-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">

        {/* About Section */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">EntryTestPro</h3>
          <p className="text-gray-200 leading-relaxed">
            Your trusted academy for entry test preparation. Learn from expert instructors,
            attempt practice tests, and achieve your academic dreams.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-yellow-300 mb-3">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "Courses", "About", "Blog", "Contact"].map((link) => (
              <li key={link}>
                <Link
                  href={`/${link.toLowerCase() === "home" ? "" : link.toLowerCase()}`}
                  className="hover:text-yellow-300 transition"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className="text-xl font-semibold text-yellow-300 mb-3">Contact Us</h4>
          <p>Email: <span className="text-yellow-300">junoonmdcat222@gmail.com </span></p>
          <p>Phone: +92 0333-4030107</p>

          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 text-2xl">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 text-2xl">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 text-2xl">
              <FaYoutube />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 text-2xl">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-800 mt-10 py-4 text-center text-sm border-t border-blue-600">
        <p>© {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">JUNOON MDCAT</span>. All rights reserved.</p>
        <p className="mt-1">Made with ❤️ by <span className="font-semibold">M. Tahir</span></p>
      </div>
    </footer>
  )
}

export default Footer
