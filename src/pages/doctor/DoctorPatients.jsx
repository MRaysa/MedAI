import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUser,
  FaUserMd,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaCalendarCheck,
  FaHistory,
  FaAllergies,
  FaHeartbeat,
  FaNotesMedical,
  FaTint,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaTimes,
  FaVideo,
  FaComments,
  FaFileMedical,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClock,
  FaEye,
} from "react-icons/fa";
import { MdLocalHospital, MdPersonSearch, MdUpcoming } from "react-icons/md";
import { BsClockHistory, BsPersonBadge } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";

const DoctorPatients = () => {
  const { apiCall, dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all"); // all, upcoming, no-upcoming

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/appointments/my-patients");
      if (response.success) {
        setPatients(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
        return <MdLocalHospital className="text-emerald-500" />;
    }
  };

  const getGenderIcon = (gender) => {
    if (gender === "male") return "👨";
    if (gender === "female") return "👩";
    return "🧑";
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: "Pending", color: "amber", icon: FaHourglassHalf, bg: "bg-amber-100", text: "text-amber-700" },
      confirmed: { label: "Confirmed", color: "blue", icon: FaCheckCircle, bg: "bg-blue-100", text: "text-blue-700" },
      completed: { label: "Completed", color: "green", icon: FaCheckCircle, bg: "bg-green-100", text: "text-green-700" },
      cancelled: { label: "Cancelled", color: "red", icon: FaTimesCircle, bg: "bg-red-100", text: "text-red-700" },
    };
    return configs[status] || configs.pending;
  };

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          patient.patientName?.toLowerCase().includes(searchLower) ||
          patient.patientEmail?.toLowerCase().includes(searchLower) ||
          patient.patientPhone?.includes(searchTerm);
        if (!matchesSearch) return false;
      }
      // Upcoming filter
      if (filterBy === "upcoming" && !patient.hasUpcomingAppointment) return false;
      if (filterBy === "no-upcoming" && patient.hasUpcomingAppointment) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastAppointmentDate) - new Date(a.lastAppointmentDate);
      }
      if (sortBy === "name") {
        return (a.patientName || "").localeCompare(b.patientName || "");
      }
      if (sortBy === "appointments") {
        return b.totalAppointments - a.totalAppointments;
      }
      return 0;
    });

  // Stats
  const totalPatients = patients.length;
  const totalAppointments = patients.reduce((sum, p) => sum + p.totalAppointments, 0);
  const patientsWithUpcoming = patients.filter((p) => p.hasUpcomingAppointment).length;

  // Check if user is a doctor
  if (dbUser && dbUser.role !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            This page is only available for doctors. Please log in with a doctor account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
          <p className="text-gray-600">View and manage your patient information</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                <HiUserGroup className="text-2xl text-teal-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaCalendarAlt className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <MdUpcoming className="text-2xl text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">With Upcoming Appt.</p>
                <p className="text-3xl font-bold text-gray-900">{patientsWithUpcoming}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 min-w-[180px]"
            >
              <option value="all">All Patients</option>
              <option value="upcoming">Has Upcoming Appt.</option>
              <option value="no-upcoming">No Upcoming Appt.</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 min-w-[180px]"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="appointments">Most Appointments</option>
            </select>
          </div>
        </motion.div>

        {/* Patient List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading patients...</p>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdPersonSearch className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || filterBy !== "all" ? "No Patients Found" : "No Patient Records"}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Patient records will appear here once you have appointments with patients."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.patientId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
                  patient.hasUpcomingAppointment ? "border-teal-200" : "border-gray-100"
                }`}
              >
                {/* Upcoming Appointment Badge */}
                {patient.hasUpcomingAppointment && (
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 flex items-center gap-2">
                    <MdUpcoming className="text-white" />
                    <span className="text-white text-sm font-medium">
                      Upcoming: {formatDateTime(patient.upcomingAppointments[0]?.appointmentDate, patient.upcomingAppointments[0]?.appointmentTime)}
                    </span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                      patient.upcomingAppointments[0]?.status === "confirmed"
                        ? "bg-white/20 text-white"
                        : "bg-amber-400 text-amber-900"
                    }`}>
                      {patient.upcomingAppointments[0]?.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                )}

                {/* Patient Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {patient.profileImage ? (
                        <img
                          src={patient.profileImage}
                          alt={patient.patientName}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                          {patient.patientName?.charAt(0) || "P"}
                        </div>
                      )}
                      {patient.hasUpcomingAppointment && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {patient.patientName || "Unknown Patient"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                        {patient.gender && (
                          <span className="flex items-center gap-1">
                            {getGenderIcon(patient.gender)}
                            <span className="capitalize">{patient.gender}</span>
                          </span>
                        )}
                        {patient.dateOfBirth && (
                          <span className="flex items-center gap-1">
                            <FaBirthdayCake className="text-pink-400" />
                            {calculateAge(patient.dateOfBirth)} yrs
                          </span>
                        )}
                        {patient.bloodType && patient.bloodType !== "Unknown" && (
                          <span className="flex items-center gap-1">
                            <FaTint className="text-red-400" />
                            {patient.bloodType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last Consultation Type */}
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg">
                      {getConsultationIcon(patient.lastConsultationType)}
                      <span className="text-xs text-gray-600 capitalize">
                        {patient.lastConsultationType?.replace("_", " ") || "In-Person"}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {patient.patientEmail && (
                      <a
                        href={`mailto:${patient.patientEmail}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <FaEnvelope className="text-gray-400" />
                        <span className="truncate max-w-[150px]">{patient.patientEmail}</span>
                      </a>
                    )}
                    {patient.patientPhone && (
                      <a
                        href={`tel:${patient.patientPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <FaPhone className="text-gray-400" />
                        {patient.patientPhone}
                      </a>
                    )}
                  </div>

                  {/* Appointment Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <FaCalendarAlt className="text-blue-500 mx-auto mb-1" />
                      <div className="font-bold text-gray-900">{patient.totalAppointments}</div>
                      <div className="text-xs text-gray-500">Total Visits</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <FaCheckCircle className="text-green-500 mx-auto mb-1" />
                      <div className="font-bold text-gray-900">{patient.completedAppointments}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <BsClockHistory className="text-purple-500 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-xs">{formatDate(patient.lastAppointmentDate)}</div>
                      <div className="text-xs text-gray-500">Last Visit</div>
                    </div>
                  </div>

                  {/* Medical Alerts */}
                  {(patient.allergies?.length > 0 || patient.chronicConditions?.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {patient.allergies?.length > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                          <FaAllergies className="text-red-500 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-red-700">Allergies:</span>
                            <p className="text-sm text-red-600">{patient.allergies.join(", ")}</p>
                          </div>
                        </div>
                      )}
                      {patient.chronicConditions?.length > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <FaHeartbeat className="text-amber-500 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-amber-700">Conditions:</span>
                            <p className="text-sm text-amber-600">{patient.chronicConditions.join(", ")}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition font-medium"
                    >
                      <FaEye />
                      View Details
                    </button>
                    <Link
                      to={`/appointments/book?patient=${patient.patientId}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
                    >
                      <FaCalendarCheck />
                      New Appointment
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Patient Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedPatient && (
            <PatientDetailModal
              patient={selectedPatient}
              apiCall={apiCall}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedPatient(null);
              }}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              calculateAge={calculateAge}
              getGenderIcon={getGenderIcon}
              getStatusConfig={getStatusConfig}
              getConsultationIcon={getConsultationIcon}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Patient Detail Modal Component
const PatientDetailModal = ({
  patient,
  apiCall,
  onClose,
  formatDate,
  formatDateTime,
  calculateAge,
  getGenderIcon,
  getStatusConfig,
  getConsultationIcon
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      fetchAppointmentHistory();
    }
  }, [activeTab]);

  const fetchAppointmentHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await apiCall(`/appointments/patient-history/${patient.patientId}`);
      if (response.success) {
        setAppointmentHistory(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

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
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Patient Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Patient Info Header */}
          <div className="flex items-center gap-4">
            {patient.profileImage ? (
              <img
                src={patient.profileImage}
                alt={patient.patientName}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {patient.patientName?.charAt(0) || "P"}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold text-gray-900">{patient.patientName}</h4>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-500 text-sm">
                {patient.gender && (
                  <span className="flex items-center gap-1">
                    {getGenderIcon(patient.gender)}
                    <span className="capitalize">{patient.gender}</span>
                  </span>
                )}
                {patient.dateOfBirth && (
                  <span>{calculateAge(patient.dateOfBirth)} years old</span>
                )}
                {patient.bloodType && patient.bloodType !== "Unknown" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <FaTint />
                    {patient.bloodType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "info"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Patient Info
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaHistory />
              Appointment History
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "history" ? "bg-white/20" : "bg-gray-200"
              }`}>
                {patient.totalAppointments}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "info" ? (
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              {patient.upcomingAppointments?.length > 0 && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <h5 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <MdUpcoming className="text-teal-600" />
                    Upcoming Appointments
                  </h5>
                  <div className="space-y-2">
                    {patient.upcomingAppointments.map((apt, idx) => {
                      const status = getStatusConfig(apt.status);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {getConsultationIcon(apt.consultationType)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatDateTime(apt.appointmentDate, apt.appointmentTime)}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {apt.consultationType?.replace("_", " ")} Consultation
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BsPersonBadge className="text-teal-500" />
                  Contact Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patient.patientEmail && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{patient.patientEmail}</span>
                    </div>
                  )}
                  {patient.patientPhone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span>{patient.patientPhone}</span>
                    </div>
                  )}
                  {patient.address?.city && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>
                        {patient.address.city}
                        {patient.address.state && `, ${patient.address.state}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              {patient.emergencyContact?.name && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500" />
                    Emergency Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-red-700">
                    <div>
                      <span className="font-medium">{patient.emergencyContact.name}</span>
                      {patient.emergencyContact.relationship && (
                        <span className="text-red-500 text-sm ml-2">
                          ({patient.emergencyContact.relationship})
                        </span>
                      )}
                    </div>
                    {patient.emergencyContact.phone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-red-400" />
                        <span>{patient.emergencyContact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medical Information */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaNotesMedical className="text-teal-500" />
                  Medical Information
                </h5>

                {patient.allergies?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaAllergies className="text-red-500" />
                      <span className="font-medium text-red-700">Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.chronicConditions?.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHeartbeat className="text-amber-500" />
                      <span className="font-medium text-amber-700">Chronic Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!patient.allergies?.length && !patient.chronicConditions?.length && (
                  <p className="text-gray-500 text-sm">No medical alerts on record.</p>
                )}
              </div>

              {/* Appointment Stats */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHistory className="text-teal-500" />
                  Appointment Summary
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{patient.totalAppointments}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{patient.completedAppointments}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{patient.cancelledAppointments || 0}</div>
                    <div className="text-sm text-gray-500">Cancelled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{formatDate(patient.firstAppointmentDate)}</div>
                    <div className="text-sm text-gray-500">First Visit</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Appointment History Tab */
            <div>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
                </div>
              ) : appointmentHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaHistory className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No appointment history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointmentHistory.map((apt, idx) => {
                    const status = getStatusConfig(apt.status);
                    const StatusIcon = status.icon;
                    return (
                      <div
                        key={idx}
                        className={`border rounded-xl p-4 ${
                          apt.status === "completed" ? "border-green-200 bg-green-50/50" :
                          apt.status === "cancelled" ? "border-red-200 bg-red-50/50" :
                          apt.status === "confirmed" ? "border-blue-200 bg-blue-50/50" :
                          "border-gray-200 bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.bg}`}>
                              <StatusIcon className={status.text} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {formatDateTime(apt.appointmentDate, apt.appointmentTime)}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                {getConsultationIcon(apt.consultationType)}
                                <span className="capitalize">
                                  {apt.consultationType?.replace("_", " ")} Consultation
                                </span>
                              </div>
                              {apt.reason && (
                                <p className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium">Reason:</span> {apt.reason}
                                </p>
                              )}
                              {apt.notes && (
                                <p className="mt-1 text-sm text-gray-600">
                                  <span className="font-medium">Notes:</span> {apt.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
            <Link
              to={`/appointments/book?patient=${patient.patientId}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
            >
              <FaCalendarCheck />
              New Appointment
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorPatients;
