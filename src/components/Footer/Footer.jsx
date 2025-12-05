import React from "react";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaBrain,
  FaShieldAlt,
  FaMobileAlt,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { MdHealthAndSafety, MdEmergency } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/doctors" },
    { name: "Book Appointment", path: "/appointments/book" },
    { name: "Health Records", path: "/patient/profile" },
    { name: "AI Symptom Checker", path: "/ai/symptom-checker" },
    { name: "Teleconsultation", path: "/appointments/teleconsult" },
  ];

  const services = [
    { name: "Patient Portal", path: "/patient/profile", icon: FaHeartbeat },
    { name: "Doctor Consultation", path: "/doctors", icon: FaUserMd },
    { name: "Appointments", path: "/appointments", icon: FaCalendarAlt },
    { name: "Lab Reports", path: "/diagnostics/results", icon: FaFileMedical },
    { name: "AI Health Insights", path: "/ai/predictions", icon: FaBrain },
    { name: "Insurance Claims", path: "/billing/insurance", icon: FaShieldAlt },
  ];

  const support = [
    { name: "Help Center", path: "/help" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "HIPAA Compliance", path: "/hipaa" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: FaYoutube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MdEmergency className="text-xl animate-pulse" />
              <span className="font-semibold">Medical Emergency?</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:911" className="flex items-center gap-1 hover:underline">
                <FaPhone /> Call 911
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="tel:+1800MEDHELP" className="flex items-center gap-1 hover:underline">
                <FaPhone /> 24/7 Helpline: 1-800-MED-HELP
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <MdHealthAndSafety className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">MedAI</h2>
                <p className="text-teal-400 text-xs">Healthcare System</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI-Enhanced Healthcare & Wellness Management System. Empowering patients
              with smart health monitoring, predictive analytics, and seamless
              doctor-patient connectivity for better health outcomes.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+18001234567" className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-teal-500" />
                </div>
                <span>+1 (800) 123-4567</span>
              </a>
              <a href="mailto:support@medai.health" className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-teal-500" />
                </div>
                <span>support@medai.health</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-teal-500" />
                </div>
                <span>123 Health Ave, Medical District, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:text-white`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-teal-500"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-teal-400 hover:pl-2 transition-all duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-teal-500"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-400 hover:text-teal-400 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <service.icon className="text-xs text-gray-500 group-hover:text-teal-400" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-teal-500"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-teal-400 hover:pl-2 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Download */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Get the App</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition group"
                >
                  <FaApple className="text-xl text-gray-400 group-hover:text-white" />
                  <div className="text-xs">
                    <p className="text-gray-500">Download on</p>
                    <p className="text-white font-medium">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition group"
                >
                  <FaGooglePlay className="text-xl text-gray-400 group-hover:text-white" />
                  <div className="text-xs">
                    <p className="text-gray-500">Get it on</p>
                    <p className="text-white font-medium">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-semibold text-lg mb-1">
                Stay Updated with Health Tips
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for AI-powered health insights and wellness tips.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-teal-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <MdHealthAndSafety className="text-teal-500" />
              <span>FDA Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-teal-500" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-teal-500" />
              <span>SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              &copy; {currentYear} MedAI Healthcare System. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-teal-400 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-teal-400 transition">
                Terms of Use
              </Link>
              <Link to="/accessibility" className="hover:text-teal-400 transition">
                Accessibility
              </Link>
              <Link to="/sitemap" className="hover:text-teal-400 transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
