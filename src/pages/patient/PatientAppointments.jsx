import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaCalendarAlt,
  FaUserMd,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCalendarCheck,
  FaCalendarTimes,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaTimes,
  FaStethoscope,
  FaMoneyBillWave,
  FaNotesMedical,
  FaEdit,
} from "react-icons/fa";
import { BsCalendar3 } from "react-icons/bs";

const PatientAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, [user, activeFilter]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();

      const params = new URLSearchParams();
      if (activeFilter === "upcoming") {
        params.append("upcoming", "true");
      } else if (activeFilter !== "all") {
        params.append("status", activeFilter);
      }

      const response = await fetch(
        `${API_URL}/appointments/my-appointments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      const token = await user.getIdToken();

      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
            reason: "Cancelled by patient",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      fetchAppointments();
      setShowDetailModal(false);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      apt.doctorName?.toLowerCase().includes(search) ||
      apt.doctorSpecialization?.toLowerCase().includes(search) ||
      apt.reasonForVisit?.toLowerCase().includes(search)
    );
  });

  // Group by date
  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    const date = new Date(apt.appointmentDate).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(apt);
    return groups;
  }, {});

  // Status helpers
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: FaHourglassHalf,
        label: "Pending",
      },
      confirmed: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: FaCheckCircle,
        label: "Confirmed",
      },
      completed: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: FaCalendarCheck,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: FaTimesCircle,
        label: "Cancelled",
      },
      rescheduled: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: FaCalendarAlt,
        label: "Rescheduled",
      },
      no_show: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: FaCalendarTimes,
        label: "No Show",
      },
    };
    return configs[status] || configs.pending;
  };

  const getConsultationIcon = (type) => {
    const icons = {
      in_person: { icon: FaMapMarkerAlt, label: "In-Person", color: "text-blue-600" },
      video: { icon: FaVideo, label: "Video Call", color: "text-purple-600" },
      phone: { icon: FaPhone, label: "Phone", color: "text-green-600" },
      chat: { icon: FaComments, label: "Chat", color: "text-teal-600" },
    };
    return icons[type] || icons.in_person;
  };

  const filters = [
    { id: "all", label: "All", icon: FaCalendarAlt },
    { id: "upcoming", label: "Upcoming", icon: FaClock },
    { id: "pending", label: "Pending", icon: FaHourglassHalf },
    { id: "confirmed", label: "Confirmed", icon: FaCheckCircle },
    { id: "completed", label: "Completed", icon: FaCalendarCheck },
    { id: "cancelled", label: "Cancelled", icon: FaTimesCircle },
  ];

  // Stats
  const stats = {
    upcoming: appointments.filter((a) => new Date(a.appointmentDate) >= new Date() && !["cancelled", "completed"].includes(a.status)).length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaCalendarAlt className="text-teal-600" />
              My Appointments
            </h1>
            <p className="text-gray-600 mt-1">View and manage your appointments</p>
          </div>
          <Link
            to="/appointments/book"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-200"
          >
            <FaPlus />
            Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <FaHourglassHalf className="text-amber-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FaCheckCircle className="text-emerald-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCalendarCheck className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    activeFilter === filter.id
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <filter.icon className="text-sm" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full lg:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : Object.keys(groupedAppointments).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BsCalendar3 className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "upcoming"
                ? "You don't have any upcoming appointments"
                : `No ${activeFilter} appointments`}
            </p>
            <Link
              to="/appointments/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              <FaPlus />
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAppointments).map(([date, apts]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
                  <span className="text-sm text-gray-500">
                    {apts.length} appointment{apts.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {apts.map((apt) => {
                    const statusConfig = getStatusConfig(apt.status);
                    const consultType = getConsultationIcon(apt.consultationType);

                    return (
                      <motion.div
                        key={apt._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Time */}
                          <div className="flex items-center gap-3 md:w-32">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex flex-col items-center justify-center">
                              <span className="text-xs text-teal-600 font-medium">
                                {new Date(apt.appointmentDate).toLocaleDateString("en-US", { weekday: "short" })}
                              </span>
                              <span className="text-lg font-bold text-teal-700">
                                {new Date(apt.appointmentDate).getDate()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{apt.appointmentTime}</p>
                              <p className="text-sm text-gray-500">{apt.duration || 30} min</p>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{apt.doctorName}</h4>
                              <span className={`px-2 py-0.5 text-xs rounded-full border ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <FaStethoscope className="text-teal-500" />
                              {apt.doctorSpecialization}
                            </p>
                            {apt.reasonForVisit && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Reason:</span> {apt.reasonForVisit}
                              </p>
                            )}
                          </div>

                          {/* Consultation Type & Fee */}
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${consultType.color}`}>
                              <consultType.icon />
                              <span className="text-sm font-medium">{consultType.label}</span>
                            </div>
                            {apt.consultationFee > 0 && (
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {apt.currency === "BDT" ? "৳" : "$"}
                                  {apt.consultationFee}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {(apt.status === "pending" || apt.status === "confirmed") && (
                              <button
                                onClick={() => handleCancelAppointment(apt._id)}
                                disabled={cancellingId === apt._id}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FaTimes className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-center">
                    {(() => {
                      const config = getStatusConfig(selectedAppointment.status);
                      return (
                        <span className={`px-4 py-2 rounded-full border text-sm font-medium ${config.color}`}>
                          <config.icon className="inline mr-2" />
                          {config.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Doctor Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Doctor</h3>
                    <p className="font-semibold text-gray-900">{selectedAppointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.doctorSpecialization}</p>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date</h3>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Time</h3>
                      <p className="font-semibold text-gray-900">
                        {selectedAppointment.appointmentTime}
                        {selectedAppointment.endTime && ` - ${selectedAppointment.endTime}`}
                      </p>
                      <p className="text-sm text-gray-500">{selectedAppointment.duration || 30} minutes</p>
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Consultation Type</h3>
                    {(() => {
                      const type = getConsultationIcon(selectedAppointment.consultationType);
                      return (
                        <div className={`flex items-center gap-2 ${type.color}`}>
                          <type.icon />
                          <span className="font-semibold">{type.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Fee */}
                  {selectedAppointment.consultationFee > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Consultation Fee</h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedAppointment.currency === "BDT" ? "৳" : "$"}
                        {selectedAppointment.consultationFee}
                      </p>
                    </div>
                  )}

                  {/* Reason & Notes */}
                  {(selectedAppointment.reasonForVisit || selectedAppointment.symptoms || selectedAppointment.notes) && (
                    <div className="space-y-4">
                      {selectedAppointment.reasonForVisit && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Reason for Visit</h3>
                          <p className="text-gray-900">{selectedAppointment.reasonForVisit}</p>
                        </div>
                      )}
                      {selectedAppointment.symptoms && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Symptoms</h3>
                          <p className="text-gray-900">{selectedAppointment.symptoms}</p>
                        </div>
                      )}
                      {selectedAppointment.notes && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                          <p className="text-gray-900">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  {(selectedAppointment.status === "pending" || selectedAppointment.status === "confirmed") && (
                    <>
                      <button
                        onClick={() => handleCancelAppointment(selectedAppointment._id)}
                        disabled={cancellingId === selectedAppointment._id}
                        className="flex-1 py-3 px-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition font-medium disabled:opacity-50"
                      >
                        {cancellingId === selectedAppointment._id ? "Cancelling..." : "Cancel Appointment"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientAppointments;
