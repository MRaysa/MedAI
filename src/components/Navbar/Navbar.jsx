import React, { useContext, useRef, useEffect, useState, useCallback } from "react";
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
  FaCheck,
  FaTrash,
  FaExclamationTriangle,
  FaFlask,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { MdHealthAndSafety, MdDashboard } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Navbar = () => {
  const { user, dbUser, signOutUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Get role display info
  const getRoleDisplay = () => {
    const role = dbUser?.role;
    switch (role) {
      case "admin":
        return { label: "Admin", bgColor: "bg-purple-100", textColor: "text-purple-700" };
      case "doctor":
        return { label: "Doctor", bgColor: "bg-teal-100", textColor: "text-teal-700" };
      case "patient":
      default:
        return { label: "Patient", bgColor: "bg-blue-100", textColor: "text-blue-700" };
    }
  };

  const roleDisplay = getRoleDisplay();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingNotifications(true);
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/notifications?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (!notification?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setNotificationDropdownOpen(false);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
      case 'appointment_reminder':
      case 'appointment_confirmed':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'appointment_cancelled':
        return <FaCalendarAlt className="text-red-500" />;
      case 'lab_result':
        return <FaFlask className="text-purple-500" />;
      case 'imaging_result':
        return <FaFileMedical className="text-teal-500" />;
      case 'health_alert':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'payment':
        return <FaMoneyBillWave className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
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

  // Get dashboard path based on role
  const getDashboardPath = () => {
    switch (dbUser?.role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "patient":
      default:
        return "/patient/dashboard";
    }
  };

  // Navigation structure based on healthcare system modules
  const navigationItems = [
    {
      name: "Dashboard",
      path: getDashboardPath(),
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
        { name: "My Appointments", path: dbUser?.role === "doctor" ? "/doctor/appointments" : "/patient/appointments", icon: FaNotesMedical },
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
        { name: "Medical Imaging", path: "/diagnostics/imaging", icon: FaFileMedical },
        { name: "Diagnostic Results", path: "/diagnostics/results", icon: FaChartLine },
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
          <div className="flex-shrink-0 flex items-center mr-8">
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
                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setNotificationDropdownOpen(!notificationDropdownOpen);
                      if (!notificationDropdownOpen) {
                        fetchNotifications();
                      }
                    }}
                    className="p-2 rounded-full hover:bg-teal-700 transition relative"
                  >
                    <FaBell className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaBell className="text-teal-600" />
                            Notifications
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1"
                            >
                              <FaCheck className="text-xs" />
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {loadingNotifications ? (
                            <div className="p-8 text-center text-gray-500">
                              <div className="animate-spin h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                              Loading...
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                              <FaBell className="text-4xl text-gray-300 mx-auto mb-2" />
                              <p>No notifications yet</p>
                              <p className="text-xs mt-1">We'll notify you when something arrives</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                                  !notification.isRead ? 'bg-teal-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                                        {notification.title}
                                      </p>
                                      <button
                                        onClick={(e) => deleteNotification(notification._id, e)}
                                        className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                                      >
                                        <FaTrash className="text-xs" />
                                      </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs text-gray-400">
                                        {getTimeAgo(notification.createdAt)}
                                      </span>
                                      {notification.actionText && (
                                        <span className="text-xs text-teal-600 hover:text-teal-800">
                                          {notification.actionText} →
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                            <Link
                              to="/ai/alerts"
                              onClick={() => setNotificationDropdownOpen(false)}
                              className="text-sm text-teal-600 hover:text-teal-800 flex items-center justify-center gap-1"
                            >
                              View all notifications
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                      {dbUser?.displayName || dbUser?.firstName || user.displayName || "User"}
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
                            {dbUser?.displayName || dbUser?.firstName || user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{dbUser?.email || user.email}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 ${roleDisplay.bgColor} ${roleDisplay.textColor} text-xs rounded-full`}>
                            {roleDisplay.label}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to={dbUser?.role === "doctor" ? "/doctor/profile" : dbUser?.role === "admin" ? "/admin/profile" : "/patient/profile"}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaUser className="text-teal-600" />
                            My Profile
                          </Link>
                          <Link
                            to={dbUser?.role === "doctor" ? "/doctor/dashboard" : dbUser?.role === "admin" ? "/admin/dashboard" : "/patient/metrics"}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaHeartbeat className="text-teal-600" />
                            {dbUser?.role === "doctor" ? "Doctor Dashboard" : dbUser?.role === "admin" ? "Admin Dashboard" : "Health Dashboard"}
                          </Link>
                          <Link
                            to={dbUser?.role === "doctor" ? "/doctor/appointments" : "/patient/appointments"}
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
              <button
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  if (!notificationDropdownOpen) {
                    fetchNotifications();
                  }
                }}
                className="p-2 rounded-full hover:bg-teal-700 transition relative"
              >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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

      {/* Mobile Notifications Dropdown */}
      <AnimatePresence>
        {notificationDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaBell className="text-teal-600" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1"
                  >
                    <FaCheck className="text-xs" />
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setNotificationDropdownOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loadingNotifications ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FaBell className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                      !notification.isRead ? 'bg-teal-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <Link
                  to="/ai/alerts"
                  onClick={() => setNotificationDropdownOpen(false)}
                  className="text-sm text-teal-600 hover:text-teal-800 flex items-center justify-center gap-1"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                    <p className="text-sm font-medium">{dbUser?.displayName || dbUser?.firstName || user.displayName || "User"}</p>
                    <p className="text-xs text-teal-200 truncate max-w-[180px]">{dbUser?.email || user.email}</p>
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
