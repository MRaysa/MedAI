import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaCalendarAlt,
  FaUserMd,
  FaUser,
  FaClock,
  FaVideo,
  FaPhone,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaHistory,
  FaCalendarCheck,
  FaStethoscope,
  FaNotesMedical,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdLocalHospital, MdFilterList } from "react-icons/md";
import { BsCalendar3, BsClockHistory } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";

const AppointmentHistory = () => {
  const { user, dbUser, apiCall } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    confirmed: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const userRole = dbUser?.role || "patient";

  useEffect(() => {
    fetchHistory();
  }, [statusFilter, startDate, endDate, pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      const response = await apiCall(`/appointments/history?${params.toString()}`);

      if (response.success) {
        setAppointments(response.data || []);
        setStats(response.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      } else {
        throw new Error(response.message || "Failed to fetch history");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message || "Failed to fetch appointment history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
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
        color: "amber",
        icon: FaHourglassHalf,
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      confirmed: {
        label: "Confirmed",
        color: "blue",
        icon: FaCheckCircle,
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      completed: {
        label: "Completed",
        color: "green",
        icon: FaCheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        color: "red",
        icon: FaTimesCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      },
      rescheduled: {
        label: "Rescheduled",
        color: "purple",
        icon: FaCalendarAlt,
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const getConsultationIcon = (type) => {
    switch (type) {
      case "video":
        return <FaVideo className="text-blue-500" />;
      case "phone":
        return <FaPhone className="text-violet-500" />;
      case "chat":
        return <FaComments className="text-pink-500" />;
      default:
        return <MdLocalHospital className="text-teal-500" />;
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Check if user is logged in
  if (!user || !dbUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHistory className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your appointment history.
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <FaHistory className="text-xl text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
              <p className="text-gray-600">
                {userRole === "doctor"
                  ? "View all your patient appointments"
                  : "View all your past and upcoming appointments"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaCalendarCheck className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                <p className="text-xs text-gray-500">Confirmed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaHourglassHalf className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                <p className="text-xs text-gray-500">Cancelled</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            {/* Date Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <MdFilterList />
              <span>Date Filter</span>
              {(startDate || endDate) && (
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              )}
            </button>

            {/* Clear Filters */}
            {(statusFilter !== "all" || startDate || endDate) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition"
              >
                <FaTimes />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Date Range Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BsClockHistory className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Appointments Found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {statusFilter !== "all" || startDate || endDate
                ? "No appointments match your filter criteria. Try adjusting your filters."
                : "You don't have any appointments yet."}
            </p>
            {userRole === "patient" && (
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
              >
                <FaUserMd />
                Find a Doctor
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {appointments.map((appointment, index) => {
                const status = getStatusConfig(appointment.status);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition ${status.border}`}
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Date & Time */}
                        <div className="flex items-center gap-4 md:w-48">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${status.bg}`}>
                            <span className={`text-lg font-bold ${status.text}`}>
                              {new Date(appointment.appointmentDate).getDate()}
                            </span>
                            <span className={`text-xs ${status.text}`}>
                              {new Date(appointment.appointmentDate).toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatTime(appointment.appointmentTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long" })}
                            </p>
                          </div>
                        </div>

                        {/* Person Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold">
                              {userRole === "doctor"
                                ? appointment.patientName?.charAt(0) || "P"
                                : appointment.doctorName?.charAt(0) || "D"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
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
                        </div>

                        {/* Consultation Type */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                          {getConsultationIcon(appointment.consultationType)}
                          <span className="text-sm text-gray-600 capitalize">
                            {appointment.consultationType?.replace("_", " ") || "In-Person"}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.bg}`}>
                          <StatusIcon className={status.text} />
                          <span className={`text-sm font-medium ${status.text}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition font-medium"
                        >
                          <FaEye />
                          View
                        </button>
                      </div>

                      {/* Reason */}
                      {appointment.reasonForVisit && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          pagination.page === pageNum
                            ? "bg-teal-500 text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            {/* Results Info */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} appointments
            </p>
          </>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedAppointment && (
            <AppointmentDetailModal
              appointment={selectedAppointment}
              userRole={userRole}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedAppointment(null);
              }}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusConfig={getStatusConfig}
              getConsultationIcon={getConsultationIcon}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Appointment Detail Modal Component
const AppointmentDetailModal = ({
  appointment,
  userRole,
  onClose,
  formatDate,
  formatTime,
  getStatusConfig,
  getConsultationIcon,
}) => {
  const status = getStatusConfig(appointment.status);
  const StatusIcon = status.icon;

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
        <div className={`p-6 ${status.bg}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`text-2xl ${status.text}`} />
              <div>
                <h3 className={`text-xl font-bold ${status.text}`}>
                  {status.label} Appointment
                </h3>
                <p className={`text-sm ${status.text} opacity-80`}>
                  {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-white/20 transition ${status.text}`}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                {getConsultationIcon(appointment.consultationType)}
                <span className="text-sm">Consultation Type</span>
              </div>
              <p className="font-semibold text-gray-900 capitalize">
                {appointment.consultationType?.replace("_", " ") || "In-Person"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FaMoneyBillWave />
                <span className="text-sm">Consultation Fee</span>
              </div>
              <p className="font-semibold text-gray-900">
                {appointment.consultationFee
                  ? `${appointment.currency || "$"}${appointment.consultationFee}`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Reason & Notes */}
          {(appointment.reasonForVisit || appointment.symptoms || appointment.notes) && (
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

              {appointment.symptoms && appointment.symptoms.length > 0 && (
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

              {appointment.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <HiOutlineDocumentText />
                    <span className="text-sm font-medium">Notes</span>
                  </div>
                  <p className="text-gray-900">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation Info */}
          {appointment.status === "cancelled" && appointment.cancellationReason && (
            <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <FaTimesCircle />
                <span className="text-sm font-medium">Cancellation Reason</span>
              </div>
              <p className="text-red-700">{appointment.cancellationReason}</p>
              {appointment.cancelledBy && (
                <p className="text-sm text-red-500 mt-1">
                  Cancelled by: {appointment.cancelledBy}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentHistory;
