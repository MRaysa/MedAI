import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

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

  // Handle broken images
  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2"
              >
                <span className="text-indigo-600 font-bold text-xl">A</span>
              </motion.div>
              <span className="text-white font-bold text-xl hidden sm:inline">
                AuthApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300 flex items-center"
              >
                <FaHome className="mr-1" /> Home
              </Link>

              {user ? (
                <div className="relative ml-3">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300 focus:outline-none"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                        <FaUser />
                      </div>
                    )}
                    <span className="ml-2">{user.displayName || "User"}</span>
                  </button>

                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaSignOutAlt className="mr-2 text-red-500" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300 flex items-center"
                  >
                    <FaSignInAlt className="mr-1" /> Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="px-3 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-100 transition duration-300 flex items-center"
                    >
                      <FaUserPlus className="mr-1" /> Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4 flex items-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                    <FaUser />
                  </div>
                )}
                <span className="ml-2 text-sm">
                  {user.displayName || "User"}
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-indigo-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
            >
              Home
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2 flex items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover mr-2"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center mr-2">
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-indigo-100">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600 text-left"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-indigo-600 hover:bg-indigo-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
