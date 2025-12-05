import React, { useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaHeartbeat,
  FaCreditCard,
  FaBrain,
  FaComments,
  FaStethoscope,
  FaNotesMedical,
  FaChevronDown,
  FaCog,
  FaBell,
  FaHistory,
  FaShieldAlt,
  FaChartLine,
  FaHospital,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { MdHealthAndSafety, MdDashboard } from "react-icons/md";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/");
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Navigation structure based on healthcare system modules
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: MdDashboard,
      requiresAuth: true,
    },
    {
      name: "Patient Records",
      icon: FaNotesMedical,
      requiresAuth: true,
      children: [
        { name: "My Health Profile", path: "/patient/profile", icon: FaUser },
        { name: "Medical History", path: "/patient/history", icon: FaHistory },
        { name: "Health Metrics", path: "/patient/metrics", icon: FaHeartbeat },
        { name: "Documents", path: "/patient/documents", icon: FaFileMedical },
        { name: "Wearable Devices", path: "/patient/devices", icon: MdHealthAndSafety },
      ],
    },
    {
      name: "Find Doctors",
      icon: FaUserMd,
      requiresAuth: false,
      children: [
        { name: "Search Doctors", path: "/doctors", icon: FaStethoscope },
        { name: "Specializations", path: "/doctors/specializations", icon: FaHospital },
        { name: "My Doctors", path: "/doctors/my-doctors", icon: FaUserMd, requiresAuth: true },
      ],
    },
    {
      name: "Appointments",
      icon: FaCalendarAlt,
      requiresAuth: true,
      children: [
        { name: "Book Appointment", path: "/appointments/book", icon: FaCalendarAlt },
        { name: "My Appointments", path: "/appointments", icon: FaNotesMedical },
        { name: "Teleconsultation", path: "/appointments/teleconsult", icon: FaComments },
        { name: "Appointment History", path: "/appointments/history", icon: FaHistory },
      ],
    },
    {
      name: "Diagnostics",
      path: "/diagnostics",
      icon: FaFileMedical,
      requiresAuth: true,
      children: [
        { name: "Lab Tests", path: "/diagnostics/lab-tests", icon: FaFileMedical },
        { name: "Test Results", path: "/diagnostics/results", icon: FaChartLine },
        { name: "Imaging Reports", path: "/diagnostics/imaging", icon: FaNotesMedical },
      ],
    },
    {
      name: "AI Health",
      icon: FaBrain,
      requiresAuth: true,
      children: [
        { name: "Symptom Checker", path: "/ai/symptom-checker", icon: FaStethoscope },
        { name: "Health Predictions", path: "/ai/predictions", icon: FaBrain },
        { name: "Wellness Tips", path: "/ai/wellness", icon: FaHeartbeat },
        { name: "Health Alerts", path: "/ai/alerts", icon: FaBell },
      ],
    },
    {
      name: "Billing",
      path: "/billing",
      icon: FaCreditCard,
      requiresAuth: true,
      children: [
        { name: "My Bills", path: "/billing", icon: FaCreditCard },
        { name: "Insurance Claims", path: "/billing/insurance", icon: FaShieldAlt },
        { name: "Payment History", path: "/billing/history", icon: FaHistory },
      ],
    },
  ];

  // Dropdown component for desktop
  const DesktopDropdown = ({ item }) => {
    const isOpen = activeDropdown === item.name;

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isOpen ? null : item.name)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center gap-1 ${
            isOpen ? "bg-teal-700" : "hover:bg-teal-700"
          }`}
        >
          <item.icon className="text-lg" />
          <span>{item.name}</span>
          <FaChevronDown
            className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
            >
              {item.children.map((child) => (
                (!child.requiresAuth || user) && (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <child.icon className="text-teal-600" />
                    {child.name}
                  </Link>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={dropdownRef}>
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-md"
              >
                <MdHealthAndSafety className="text-teal-600 text-2xl" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl">MedAI</span>
                <span className="text-teal-200 text-xs block -mt-1">Healthcare System</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center gap-1 ${
                  isActive ? "bg-teal-700" : "hover:bg-teal-700"
                }`
              }
            >
              <FaHome /> Home
            </NavLink>

            {navigationItems.map((item) => {
              if (item.requiresAuth && !user) return null;

              if (item.children) {
                return <DesktopDropdown key={item.name} item={item} />;
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center gap-1 ${
                      isActive ? "bg-teal-700" : "hover:bg-teal-700"
                    }`
                  }
                >
                  <item.icon /> {item.name}
                </NavLink>
              );
            })}
          </div>

          {/* Right side - Auth buttons or Profile */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-full hover:bg-teal-700 transition relative">
                  <FaBell className="text-lg" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-teal-700 transition duration-300"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-white"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white text-teal-600 flex items-center justify-center">
                        <FaUser />
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user.displayName || "User"}
                    </span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                            Patient
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/patient/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaUser className="text-teal-600" />
                            My Profile
                          </Link>
                          <Link
                            to="/patient/metrics"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaHeartbeat className="text-teal-600" />
                            Health Dashboard
                          </Link>
                          <Link
                            to="/appointments"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaCalendarAlt className="text-teal-600" />
                            My Appointments
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaCog className="text-teal-600" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <FaSignOutAlt />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signin"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-teal-600 hover:bg-teal-50 transition duration-300 flex items-center gap-2 shadow-md"
                >
                  <FaSignInAlt /> Sign In
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <button className="p-2 rounded-full hover:bg-teal-700 transition relative">
                <FaBell className="text-lg" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-teal-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-teal-700 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* User info for mobile */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-teal-800 rounded-lg">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-white text-teal-600 flex items-center justify-center">
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{user.displayName || "User"}</p>
                    <p className="text-xs text-teal-200 truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Home Link */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-600"
              >
                <FaHome /> Home
              </Link>

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                if (item.requiresAuth && !user) return null;

                if (item.children) {
                  return (
                    <MobileDropdown
                      key={item.name}
                      item={item}
                      user={user}
                      closeMobileMenu={closeMobileMenu}
                    />
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-600"
                  >
                    <item.icon /> {item.name}
                  </Link>
                );
              })}

              {/* Auth buttons for mobile */}
              {!user ? (
                <div className="pt-4 border-t border-teal-600 mt-4">
                  <Link
                    to="/signin"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-teal-600 hover:bg-teal-50 font-medium shadow-md"
                  >
                    <FaSignInAlt /> Sign In
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-teal-600 mt-4">
                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-600"
                  >
                    <FaCog /> Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500 text-white w-full mt-2"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Mobile Dropdown Component
const MobileDropdown = ({ item, user, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-teal-600"
      >
        <span className="flex items-center gap-3">
          <item.icon /> {item.name}
        </span>
        <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
          >
            {item.children.map((child) => (
              (!child.requiresAuth || user) && (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-600 text-sm text-teal-100"
                >
                  <child.icon className="text-teal-300" /> {child.name}
                </Link>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
