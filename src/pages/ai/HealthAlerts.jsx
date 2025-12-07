import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";
import {
  FaBell,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaFlask,
  FaDollarSign,
  FaHeartbeat,
  FaLeaf,
  FaTimes,
  FaSyncAlt,
  FaChevronRight,
  FaFilter,
  FaClock,
  FaUserMd,
  FaArrowRight,
  FaWater,
  FaSun,
  FaMoon,
  FaSpinner,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdNotificationsActive, MdHealthAndSafety, MdLocalHospital } from "react-icons/md";

const alertIcons = {
  calendar: FaCalendarAlt,
  flask: FaFlask,
  dollar: FaDollarSign,
  heart: FaHeartbeat,
  water: FaWater,
  sun: FaSun,
  moon: FaMoon,
  health: MdHealthAndSafety
};

const priorityConfig = {
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-500 text-white",
    icon: FaExclamationTriangle
  },
  medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-500 text-white",
    icon: FaExclamationCircle
  },
  low: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-500 text-white",
    icon: FaInfoCircle
  }
};

const typeConfig = {
  appointment: { label: "Appointment", color: "text-purple-600", bg: "bg-purple-100" },
  lab_test: { label: "Lab Test", color: "text-teal-600", bg: "bg-teal-100" },
  billing: { label: "Billing", color: "text-green-600", bg: "bg-green-100" },
  health: { label: "Health", color: "text-red-600", bg: "bg-red-100" },
  wellness: { label: "Wellness", color: "text-blue-600", bg: "bg-blue-100" }
};

const HealthAlerts = () => {
  const { apiCall, user, dbUser, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAlerts();
      // Load dismissed alerts from localStorage
      const dismissed = localStorage.getItem("dismissedAlerts");
      if (dismissed) {
        setDismissedAlerts(JSON.parse(dismissed));
      }
    }
  }, [user]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall("/ai/alerts");
      if (response.success) {
        setAlerts(response.data);
        setStats(response.stats);
      } else {
        setError(response.message || "Failed to fetch alerts");
      }
    } catch (err) {
      setError(err.message || "Failed to load health alerts");
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      await apiCall("/ai/alerts/dismiss", {
        method: "POST",
        body: JSON.stringify({ alertId })
      });

      const updated = [...dismissedAlerts, alertId];
      setDismissedAlerts(updated);
      localStorage.setItem("dismissedAlerts", JSON.stringify(updated));
    } catch (err) {
      console.error("Error dismissing alert:", err);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.includes(alert.id)) return false;
    if (filter === "all") return true;
    if (filter === "high") return alert.priority === "high";
    if (filter === "medium") return alert.priority === "medium";
    if (filter === "low") return alert.priority === "low";
    return alert.type === filter;
  });

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = d - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days > 1 && days <= 7) return `In ${days} days`;
    return d.toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBell className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your health alerts.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                <FaBell className="text-3xl text-white" />
                {stats && stats.high > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {stats.high}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Health Alerts
                  <HiSparkles className="text-amber-500" />
                </h1>
                <p className="text-gray-600">
                  Important reminders and health notifications
                </p>
              </div>
            </div>
            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FaBell className="text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Alerts</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                  <p className="text-xs text-gray-500">High Priority</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <FaExclamationCircle className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.medium}</p>
                  <p className="text-xs text-gray-500">Medium</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.low}</p>
                  <p className="text-xs text-gray-500">Low Priority</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{dismissedAlerts.length}</p>
                  <p className="text-xs text-gray-500">Dismissed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-gray-500 mr-2">
              <FaFilter />
              <span className="text-sm">Filter:</span>
            </div>
            {[
              { value: "all", label: "All" },
              { value: "high", label: "High Priority" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
              { value: "appointment", label: "Appointments" },
              { value: "lab_test", label: "Lab Tests" },
              { value: "billing", label: "Billing" },
              { value: "health", label: "Health" },
              { value: "wellness", label: "Wellness" }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  filter === f.value
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {filter !== "all"
                  ? "No alerts match this filter. Try selecting a different filter."
                  : "You have no pending alerts. Keep up the great work!"}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => {
                const priority = priorityConfig[alert.priority] || priorityConfig.low;
                const type = typeConfig[alert.type] || typeConfig.wellness;
                const AlertIcon = alertIcons[alert.icon] || FaInfoCircle;
                const PriorityIcon = priority.icon;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${priority.bg} ${priority.border} border rounded-2xl overflow-hidden`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 ${type.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <AlertIcon className={`text-xl ${type.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.bg} ${type.color}`}>
                                  {type.label}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.badge}`}>
                                  {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900">{alert.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                            </div>

                            {/* Dismiss */}
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                            >
                              <FaTimes />
                            </button>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {alert.date && (
                                <span className="flex items-center gap-1">
                                  <FaClock className="text-gray-400" />
                                  {formatDate(alert.date)}
                                </span>
                              )}
                            </div>

                            {alert.action && (
                              <Link
                                to={alert.action.link}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                                  alert.priority === "high"
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : alert.priority === "medium"
                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                {alert.action.label}
                                <FaChevronRight className="text-xs" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-6 text-white"
        >
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              to="/appointments"
              className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <FaCalendarAlt className="text-xl" />
              <div>
                <p className="font-medium">Appointments</p>
                <p className="text-white/70 text-sm">View schedule</p>
              </div>
            </Link>
            <Link
              to="/diagnostics/lab-tests"
              className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <FaFlask className="text-xl" />
              <div>
                <p className="font-medium">Lab Tests</p>
                <p className="text-white/70 text-sm">Check results</p>
              </div>
            </Link>
            <Link
              to="/billing"
              className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <FaDollarSign className="text-xl" />
              <div>
                <p className="font-medium">Billing</p>
                <p className="text-white/70 text-sm">Pay bills</p>
              </div>
            </Link>
            <Link
              to="/doctors"
              className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <FaUserMd className="text-xl" />
              <div>
                <p className="font-medium">Find Doctor</p>
                <p className="text-white/70 text-sm">Book appointment</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Related AI Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid md:grid-cols-3 gap-4"
        >
          <Link
            to="/ai/symptom-checker"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <MdHealthAndSafety className="text-2xl text-teal-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">
                  Symptom Checker
                </h4>
                <p className="text-sm text-gray-500">AI health analysis</p>
              </div>
              <FaChevronRight className="text-gray-400 group-hover:text-teal-600 transition" />
            </div>
          </Link>

          <Link
            to="/ai/predictions"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaHeartbeat className="text-2xl text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                  Health Predictions
                </h4>
                <p className="text-sm text-gray-500">Risk assessment</p>
              </div>
              <FaChevronRight className="text-gray-400 group-hover:text-purple-600 transition" />
            </div>
          </Link>

          <Link
            to="/ai/wellness"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaLeaf className="text-2xl text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                  Wellness Tips
                </h4>
                <p className="text-sm text-gray-500">Daily recommendations</p>
              </div>
              <FaChevronRight className="text-gray-400 group-hover:text-green-600 transition" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthAlerts;
