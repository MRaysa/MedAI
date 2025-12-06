import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaPhone,
  FaComments,
  FaCheck,
  FaTimes,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaNotesMedical,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCalendarCheck,
  FaCalendarTimes,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdLocalHospital, MdPending, MdToday, MdUpcoming } from "react-icons/md";
import { BsCalendar3, BsClockHistory } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

const DoctorAppointments = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const statusConfig = {
    pending: { label: "Pending", color: "amber", icon: FaHourglassHalf, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    confirmed: { label: "Confirmed", color: "blue", icon: FaCheckCircle, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    completed: { label: "Completed", color: "emerald", icon: FaCheck, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    cancelled: { label: "Cancelled", color: "red", icon: FaTimesCircle, bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    no_show: { label: "No Show", color: "gray", icon: FaExclamationTriangle, bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
    rescheduled: { label: "Rescheduled", color: "purple", icon: FaHistory, bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  };

  const consultationTypeConfig = {
    in_person: { label: "In-Person", icon: MdLocalHospital, color: "text-emerald-600" },
    video: { label: "Video", icon: FaVideo, color: "text-blue-600" },
    phone: { label: "Phone", icon: FaPhone, color: "text-violet-600" },
    chat: { label: "Chat", icon: FaComments, color: "text-pink-600" },
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeFilter, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = "/appointments/doctor-appointments";
      const params = new URLSearchParams();

      if (activeFilter === "upcoming") {
        params.append("upcoming", "true");
      } else if (activeFilter !== "all") {
        params.append("status", activeFilter);
      }

      if (selectedDate) {
        params.append("date", selectedDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiCall(url);
      if (response.success) {
        setAppointments(response.data || []);
        setStats(response.stats || null);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setActionLoading(appointmentId);
    try {
      const response = await apiCall(`/appointments/${appointmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.success) {
        fetchAppointments();
        setShowDetailModal(false);
      } else {
        alert(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment status");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      apt.patientName?.toLowerCase().includes(search) ||
      apt.patientEmail?.toLowerCase().includes(search) ||
      apt.reasonForVisit?.toLowerCase().includes(search)
    );
  });

  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    const date = formatDate(apt.appointmentDate);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(apt);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage and track your patient appointments</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MdToday className="text-2xl text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <FaHourglassHalf className="text-xl text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-xl text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                  <p className="text-sm text-gray-500">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FaCheck className="text-xl text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", icon: FaCalendarAlt },
                { id: "upcoming", label: "Upcoming", icon: MdUpcoming },
                { id: "pending", label: "Pending", icon: FaHourglassHalf },
                { id: "confirmed", label: "Confirmed", icon: FaCheckCircle },
                { id: "completed", label: "Completed", icon: FaCheck },
                { id: "cancelled", label: "Cancelled", icon: FaTimes },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                    activeFilter === filter.id
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <filter.icon className="text-sm" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="date"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 w-full md:w-64"
              />
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="text-4xl text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-500">
              {activeFilter !== "all"
                ? `No ${activeFilter} appointments found.`
                : "You don't have any appointments yet."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-4 py-2 rounded-xl font-semibold ${
                    isToday(dateAppointments[0].appointmentDate)
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {isToday(dateAppointments[0].appointmentDate) ? "Today" : date}
                  </div>
                  <span className="text-gray-500">{dateAppointments.length} appointment(s)</span>
                </div>

                {/* Appointments Grid */}
                <div className="grid gap-4">
                  {dateAppointments
                    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
                    .map((appointment) => {
                      const status = statusConfig[appointment.status] || statusConfig.pending;
                      const consultType = consultationTypeConfig[appointment.consultationType] || consultationTypeConfig.in_person;

                      return (
                        <div
                          key={appointment._id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Time */}
                            <div className="flex items-center gap-3 md:w-32">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                                {appointment.appointmentTime?.split(":")[0]}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{appointment.appointmentTime}</p>
                                <p className="text-sm text-gray-500">{appointment.duration} min</p>
                              </div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.border} border`}>
                                  <status.icon className="text-xs" />
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">{appointment.patientEmail}</p>
                              {appointment.reasonForVisit && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                                </p>
                              )}
                            </div>

                            {/* Consultation Type */}
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl ${consultType.color}`}>
                                <consultType.icon />
                                <span className="font-medium text-sm">{consultType.label}</span>
                              </div>
                            </div>

                            {/* Fee */}
                            <div className="text-right md:w-24">
                              <p className="font-bold text-gray-900">
                                {formatCurrency(appointment.consultationFee, appointment.currency)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowDetailModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                title="View Details"
                              >
                                <FaEye />
                              </button>

                              {appointment.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                                    disabled={actionLoading === appointment._id}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
                                    title="Confirm"
                                  >
                                    {actionLoading === appointment._id ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <FaCheck />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                                    disabled={actionLoading === appointment._id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                    title="Cancel"
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}

                              {appointment.status === "confirmed" && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, "completed")}
                                  disabled={actionLoading === appointment._id}
                                  className="px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                                >
                                  {actionLoading === appointment._id ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    "Complete"
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Appointment Details</h3>
                      <p className="text-teal-100 text-sm mt-1">
                        {formatDate(selectedAppointment.appointmentDate)} at {selectedAppointment.appointmentTime}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    {(() => {
                      const status = statusConfig[selectedAppointment.status] || statusConfig.pending;
                      return (
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${status.bg} ${status.text} ${status.border} border`}>
                          <status.icon />
                          {status.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Patient Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaUser className="text-teal-500" />
                      Patient Information
                    </h4>
                    <div className="space-y-2">
                      <p className="flex items-center gap-3">
                        <span className="text-gray-500 w-20">Name:</span>
                        <span className="font-medium text-gray-900">{selectedAppointment.patientName}</span>
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-gray-500 w-20">Email:</span>
                        <span className="font-medium text-gray-900">{selectedAppointment.patientEmail}</span>
                      </p>
                      {selectedAppointment.patientPhone && (
                        <p className="flex items-center gap-3">
                          <span className="text-gray-500 w-20">Phone:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.patientPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Consultation Type</p>
                      {(() => {
                        const consultType = consultationTypeConfig[selectedAppointment.consultationType] || consultationTypeConfig.in_person;
                        return (
                          <p className={`font-semibold flex items-center gap-2 ${consultType.color}`}>
                            <consultType.icon />
                            {consultType.label}
                          </p>
                        );
                      })()}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{selectedAppointment.duration} minutes</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Fee</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(selectedAppointment.consultationFee, selectedAppointment.currency)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                      <p className={`font-semibold capitalize ${
                        selectedAppointment.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {selectedAppointment.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Medical Info */}
                  {(selectedAppointment.reasonForVisit || selectedAppointment.symptoms || selectedAppointment.notes) && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaNotesMedical className="text-teal-500" />
                        Medical Information
                      </h4>
                      <div className="space-y-3">
                        {selectedAppointment.reasonForVisit && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Reason for Visit</p>
                            <p className="text-gray-900">{selectedAppointment.reasonForVisit}</p>
                          </div>
                        )}
                        {selectedAppointment.symptoms && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                            <p className="text-gray-900">{selectedAppointment.symptoms}</p>
                          </div>
                        )}
                        {selectedAppointment.notes && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                            <p className="text-gray-900">{selectedAppointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {selectedAppointment.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedAppointment._id, "confirmed")}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-semibold disabled:opacity-50"
                        >
                          {actionLoading === selectedAppointment._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCheck />
                          )}
                          Confirm Appointment
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedAppointment._id, "cancelled")}
                          disabled={actionLoading}
                          className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition font-semibold disabled:opacity-50"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                    {selectedAppointment.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedAppointment._id, "completed")}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-semibold disabled:opacity-50"
                      >
                        {actionLoading === selectedAppointment._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        Mark as Completed
                      </button>
                    )}

                    {(selectedAppointment.status === "completed" || selectedAppointment.status === "cancelled") && (
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorAppointments;
