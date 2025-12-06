import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaVideo,
  FaPhone,
  FaComments,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaPlay,
  FaTimes,
  FaEye,
  FaExternalLinkAlt,
  FaNotesMedical,
  FaStethoscope,
  FaInfoCircle,
} from "react-icons/fa";
import { MdVideoCall, MdCallEnd, MdSchedule } from "react-icons/md";
import { BsCalendarCheck, BsCameraVideo, BsTelephone } from "react-icons/bs";
import { HiOutlineStatusOnline } from "react-icons/hi";

const Teleconsult = () => {
  const { user, dbUser, apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState({
    today: [],
    upcoming: [],
    past: [],
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    video: 0,
    phone: 0,
    chat: 0,
  });
  const [activeTab, setActiveTab] = useState("today");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const userRole = dbUser?.role || "patient";

  useEffect(() => {
    fetchTeleconsultations();
  }, [typeFilter]);

  const fetchTeleconsultations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (typeFilter !== "all") {
        params.append("type", typeFilter);
      }

      const response = await apiCall(`/appointments/teleconsult?${params.toString()}`);

      if (response.success) {
        setAppointments({
          today: response.data?.today || [],
          upcoming: response.data?.upcoming || [],
          past: response.data?.past || [],
        });
        setStats(response.stats || stats);
      } else {
        throw new Error(response.message || "Failed to fetch teleconsultations");
      }
    } catch (err) {
      console.error("Error fetching teleconsultations:", err);
      setError(err.message || "Failed to fetch teleconsultations");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        icon: FaHourglassHalf,
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      confirmed: {
        label: "Confirmed",
        icon: FaCheckCircle,
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      completed: {
        label: "Completed",
        icon: FaCheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: FaTimesCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const getConsultationConfig = (type) => {
    const configs = {
      video: {
        label: "Video Call",
        icon: FaVideo,
        bg: "bg-blue-500",
        lightBg: "bg-blue-100",
        text: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
      },
      phone: {
        label: "Phone Call",
        icon: FaPhone,
        bg: "bg-violet-500",
        lightBg: "bg-violet-100",
        text: "text-violet-600",
        gradient: "from-violet-500 to-violet-600",
      },
      chat: {
        label: "Chat",
        icon: FaComments,
        bg: "bg-pink-500",
        lightBg: "bg-pink-100",
        text: "text-pink-600",
        gradient: "from-pink-500 to-pink-600",
      },
    };
    return configs[type] || configs.video;
  };

  const isAppointmentNow = (appointment) => {
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());

    if (aptDay.getTime() !== today.getTime()) return false;

    const [hours, minutes] = appointment.appointmentTime.split(":").map(Number);
    const aptTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const endTime = new Date(aptTime.getTime() + (appointment.duration || 30) * 60000);

    return now >= aptTime && now <= endTime;
  };

  const canJoinCall = (appointment) => {
    if (!["confirmed", "pending"].includes(appointment.status)) return false;

    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());

    if (aptDay.getTime() !== today.getTime()) return false;

    const [hours, minutes] = appointment.appointmentTime.split(":").map(Number);
    const aptTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const earlyJoin = new Date(aptTime.getTime() - 10 * 60000); // 10 min before
    const lateJoin = new Date(aptTime.getTime() + (appointment.duration || 30) * 60000 + 15 * 60000); // 15 min after end

    return now >= earlyJoin && now <= lateJoin;
  };

  const getTimeUntil = (appointment) => {
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    const [hours, minutes] = appointment.appointmentTime.split(":").map(Number);
    const aptTime = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate(), hours, minutes);

    const diff = aptTime - now;
    if (diff < 0) return "Started";

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d ${hrs % 24}h`;
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // Check if user is logged in
  if (!user || !dbUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaVideo className="text-3xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your teleconsultations.
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                <MdVideoCall className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teleconsultations</h1>
                <p className="text-gray-600">
                  {userRole === "doctor"
                    ? "Manage your virtual consultations"
                    : "Your video, phone & chat appointments"}
                </p>
              </div>
            </div>

            {userRole === "patient" && (
              <Link
                to="/doctors"
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
              >
                <FaCalendarAlt />
                Book Consultation
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-gray-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <HiOutlineStatusOnline className="text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-teal-600">{stats.today}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MdSchedule className="text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-purple-600">{stats.upcoming}</p>
                <p className="text-xs text-gray-500">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaVideo className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{stats.video}</p>
                <p className="text-xs text-gray-500">Video</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <FaPhone className="text-violet-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-violet-600">{stats.phone}</p>
                <p className="text-xs text-gray-500">Phone</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <FaComments className="text-pink-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-pink-600">{stats.chat}</p>
                <p className="text-xs text-gray-500">Chat</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 flex-1">
              {[
                { key: "today", label: "Today", count: appointments.today.length },
                { key: "upcoming", label: "Upcoming", count: appointments.upcoming.length },
                { key: "past", label: "Past", count: appointments.past.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                    activeTab === tab.key
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? "bg-teal-100 text-teal-700" : "bg-gray-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="video">Video Calls</option>
              <option value="phone">Phone Calls</option>
              <option value="chat">Chat</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading teleconsultations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchTeleconsultations}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : appointments[activeTab].length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdVideoCall className="text-5xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No {activeTab === "today" ? "Today's" : activeTab === "upcoming" ? "Upcoming" : "Past"} Teleconsultations
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeTab === "today"
                ? "You don't have any teleconsultations scheduled for today."
                : activeTab === "upcoming"
                ? "You don't have any upcoming teleconsultations scheduled."
                : "You don't have any past teleconsultation records."}
            </p>
            {userRole === "patient" && activeTab !== "past" && (
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
              >
                <FaUserMd />
                Book a Teleconsultation
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments[activeTab].map((appointment, index) => {
              const consultConfig = getConsultationConfig(appointment.consultationType);
              const statusConfig = getStatusConfig(appointment.status);
              const ConsultIcon = consultConfig.icon;
              const StatusIcon = statusConfig.icon;
              const isNow = isAppointmentNow(appointment);
              const canJoin = canJoinCall(appointment);

              return (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                    isNow ? "border-green-300 ring-2 ring-green-100" : statusConfig.border
                  }`}
                >
                  {/* Live Badge */}
                  {isNow && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                      <span className="text-white font-medium">Live Now - Join the consultation</span>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Consultation Type Icon */}
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${consultConfig.gradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <ConsultIcon className="text-2xl text-white" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {consultConfig.label}
                            </h3>
                            <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt />
                                {formatDate(appointment.appointmentDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaClock />
                                {formatTime(appointment.appointmentTime)}
                                {appointment.duration && ` (${appointment.duration} min)`}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={statusConfig.text} />
                            <span className={`text-sm font-medium ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Person Info */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {userRole === "doctor"
                              ? appointment.patientName?.charAt(0) || "P"
                              : appointment.doctorName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {userRole === "doctor"
                                ? appointment.patientName || "Patient"
                                : appointment.doctorName || "Doctor"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {userRole === "doctor"
                                ? appointment.patientEmail
                                : appointment.doctorSpecialization}
                            </p>
                          </div>
                        </div>

                        {/* Reason */}
                        {appointment.reasonForVisit && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        {canJoin && (
                          <button
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition bg-gradient-to-r ${consultConfig.gradient} hover:opacity-90`}
                          >
                            {appointment.consultationType === "video" ? (
                              <BsCameraVideo className="text-lg" />
                            ) : appointment.consultationType === "phone" ? (
                              <BsTelephone className="text-lg" />
                            ) : (
                              <FaComments className="text-lg" />
                            )}
                            {isNow ? "Join Now" : "Join Call"}
                          </button>
                        )}

                        {!canJoin && activeTab !== "past" && (
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-600">
                            <FaClock />
                            <span className="font-medium">
                              {activeTab === "today" ? `In ${getTimeUntil(appointment)}` : getTimeUntil(appointment)}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                        >
                          <FaEye />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedAppointment && (
            <TeleconsultDetailModal
              appointment={selectedAppointment}
              userRole={userRole}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedAppointment(null);
              }}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusConfig={getStatusConfig}
              getConsultationConfig={getConsultationConfig}
              canJoinCall={canJoinCall}
              isAppointmentNow={isAppointmentNow}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Teleconsult Detail Modal
const TeleconsultDetailModal = ({
  appointment,
  userRole,
  onClose,
  formatDate,
  formatTime,
  getStatusConfig,
  getConsultationConfig,
  canJoinCall,
  isAppointmentNow,
}) => {
  const consultConfig = getConsultationConfig(appointment.consultationType);
  const statusConfig = getStatusConfig(appointment.status);
  const ConsultIcon = consultConfig.icon;
  const canJoin = canJoinCall(appointment);
  const isNow = isAppointmentNow(appointment);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${consultConfig.gradient}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <ConsultIcon className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{consultConfig.label}</h3>
                <p className="text-white/80">
                  {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* Join Button in Header */}
          {canJoin && (
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl text-gray-900 font-bold hover:bg-gray-100 transition"
            >
              {isNow && (
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
              <ConsultIcon />
              {isNow ? "Join Now - Live" : "Join Call"}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Status */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${statusConfig.bg}`}>
            <statusConfig.icon className={statusConfig.text} />
            <span className={`font-medium ${statusConfig.text}`}>
              Status: {statusConfig.label}
            </span>
          </div>

          {/* Person Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {userRole === "doctor" ? <FaUser className="text-teal-500" /> : <FaUserMd className="text-teal-500" />}
              {userRole === "doctor" ? "Patient Information" : "Doctor Information"}
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {userRole === "doctor"
                  ? appointment.patientName?.charAt(0) || "P"
                  : appointment.doctorName?.charAt(0) || "D"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {userRole === "doctor" ? appointment.patientName : appointment.doctorName}
                </p>
                {userRole === "doctor" ? (
                  <>
                    <p className="text-gray-600">{appointment.patientEmail}</p>
                    {appointment.patientPhone && (
                      <p className="text-gray-600">{appointment.patientPhone}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">{appointment.doctorSpecialization}</p>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FaCalendarAlt />
                <span className="text-sm">Date</span>
              </div>
              <p className="font-semibold text-gray-900">{formatDate(appointment.appointmentDate)}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FaClock />
                <span className="text-sm">Time</span>
              </div>
              <p className="font-semibold text-gray-900">
                {formatTime(appointment.appointmentTime)}
                {appointment.duration && ` (${appointment.duration} min)`}
              </p>
            </div>
          </div>

          {/* Reason & Symptoms */}
          {(appointment.reasonForVisit || appointment.symptoms) && (
            <div className="space-y-4">
              {appointment.reasonForVisit && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <FaNotesMedical />
                    <span className="text-sm font-medium">Reason for Visit</span>
                  </div>
                  <p className="text-gray-900">{appointment.reasonForVisit}</p>
                </div>
              )}

              {appointment.symptoms && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <FaStethoscope />
                    <span className="text-sm font-medium">Symptoms</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(appointment.symptoms) ? appointment.symptoms : [appointment.symptoms]).map(
                      (symptom, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                        >
                          {symptom}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-800 mb-1">Consultation Tips</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Find a quiet, private space for your consultation</li>
                  <li>• Have your medical records or prescriptions ready</li>
                  <li>• You can join the call 10 minutes before the scheduled time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
            >
              Close
            </button>
            {canJoin && (
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r ${consultConfig.gradient}`}
              >
                <ConsultIcon />
                {isNow ? "Join Now" : "Join Call"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Teleconsult;
