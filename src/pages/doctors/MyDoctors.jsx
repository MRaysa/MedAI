import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaCalendarCheck,
  FaCalendarAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaMoneyBillWave,
  FaVideo,
  FaClock,
  FaHistory,
  FaCheckCircle,
  FaStethoscope,
  FaHeartbeat,
} from "react-icons/fa";
import { MdVerified, MdLocalHospital } from "react-icons/md";
import { BsPatchCheckFill, BsCalendarCheck, BsClockHistory } from "react-icons/bs";
import { RiStethoscopeLine } from "react-icons/ri";
import { IoMdPulse } from "react-icons/io";

const MyDoctors = () => {
  const { apiCall, user, dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  const specializationIcons = {
    "General Practice": "🩺",
    "Internal Medicine": "💊",
    "Family Medicine": "👨‍👩‍👧‍👦",
    "Pediatrics": "👶",
    "Cardiology": "❤️",
    "Dermatology": "🧴",
    "Endocrinology": "🧬",
    "Gastroenterology": "🫃",
    "Neurology": "🧠",
    "Oncology": "🎗️",
    "Ophthalmology": "👁️",
    "Orthopedics": "🦴",
    "Psychiatry": "🧘",
    "Pulmonology": "🫁",
    "Radiology": "📡",
    "Rheumatology": "🦵",
    "Surgery": "🔪",
    "Urology": "🚿",
    "Gynecology": "🌸",
    "Emergency Medicine": "🚑",
    "Nephrology": "🫘",
    "Allergy and Immunology": "🤧",
  };

  useEffect(() => {
    const fetchMyDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall("/appointments/my-doctors");
        if (response.success) {
          setDoctors(response.data || []);
        } else {
          setError(response.message || "Failed to fetch doctors");
        }
      } catch (err) {
        console.error("Error fetching my doctors:", err);
        setError("Failed to load your doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user && dbUser?.role === "patient") {
      fetchMyDoctors();
    }
  }, [apiCall, user, dbUser]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if user is not a patient
  if (dbUser && dbUser.role !== "patient") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This page is only available for patients. Please log in with a patient account.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 mb-4">
            <FaHeartbeat className="text-teal-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Your Healthcare Journey</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-gray-900 via-teal-800 to-teal-600 bg-clip-text text-transparent">
              My Doctors
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            View all the healthcare professionals you've consulted with
          </p>

          {/* Quick Stats */}
          {!loading && doctors.length > 0 && (
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{doctors.length}</div>
                <div className="text-sm text-gray-500">Total Doctors</div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {doctors.reduce((sum, doc) => sum + doc.totalAppointments, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Appointments</div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {doctors.reduce((sum, doc) => sum + doc.completedAppointments, 0)}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
                <RiStethoscopeLine className="absolute inset-0 m-auto text-2xl text-teal-500" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Loading your doctors...</p>
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserMd className="text-4xl text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Doctors</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
            >
              Try Again
            </button>
          </motion.div>
        ) : doctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaStethoscope className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't had any appointments with doctors yet. Start by booking your first appointment!
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium shadow-lg shadow-teal-500/25"
            >
              <FaUserMd />
              Find Doctors
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.doctorId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500"
              >
                {/* Card Header */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-2xl" />

                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      {/* Doctor Avatar */}
                      <div className="relative">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={doctor.doctorName}
                            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center ring-4 ring-white shadow-xl">
                            <FaUserMd className="text-2xl text-white" />
                          </div>
                        )}
                        {doctor.isAvailable && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {doctor.doctorName}
                          </h3>
                          <BsPatchCheckFill className="text-teal-500 flex-shrink-0" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{specializationIcons[doctor.specialization] || "🏥"}</span>
                          <span className="font-semibold text-teal-600">{doctor.specialization}</span>
                        </div>

                        {/* Experience Badge */}
                        {doctor.experience && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold shadow">
                            <FaGraduationCap />
                            {doctor.experience} years exp.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Appointment Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                        <FaCalendarAlt className="text-blue-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900">{doctor.totalAppointments}</div>
                        <div className="text-gray-500 text-xs">Total Visits</div>
                      </div>
                      <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                        <FaCheckCircle className="text-green-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900">{doctor.completedAppointments}</div>
                        <div className="text-gray-500 text-xs">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                        <BsClockHistory className="text-purple-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900 text-sm">{formatDate(doctor.lastAppointmentDate)}</div>
                        <div className="text-gray-500 text-xs">Last Visit</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 pb-4">
                  {/* Hospital & Location */}
                  <div className="space-y-2 mb-4">
                    {doctor.hospital && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaHospital className="text-teal-500" />
                        <span className="font-medium truncate">{doctor.hospital}</span>
                      </div>
                    )}
                    {doctor.clinicAddress && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span>{doctor.clinicAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Qualifications */}
                  {doctor.qualifications?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doctor.qualifications.slice(0, 3).map((qual, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
                        >
                          <FaGraduationCap className="text-blue-500" />
                          {qual.degree || qual}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {doctor.email && (
                      <a
                        href={`mailto:${doctor.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <FaEnvelope className="text-gray-400" />
                        Email
                      </a>
                    )}
                    {doctor.phone && (
                      <a
                        href={`tel:${doctor.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <FaPhone className="text-gray-400" />
                        Call
                      </a>
                    )}
                  </div>

                  {/* Fees */}
                  {doctor.fees && (
                    <div className="flex gap-3 mb-4">
                      {doctor.fees.inPersonConsultation > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-xl border border-teal-100">
                          <MdLocalHospital className="text-teal-500" />
                          <span className="text-sm text-gray-600">In-Person:</span>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(doctor.fees.inPersonConsultation, doctor.fees.currency)}
                          </span>
                        </div>
                      )}
                      {doctor.fees.videoConsultation > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                          <FaVideo className="text-blue-500" />
                          <span className="text-sm text-gray-600">Video:</span>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(doctor.fees.videoConsultation, doctor.fees.currency)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <FaHistory className="text-gray-400" />
                      <span>First visit: {formatDate(doctor.firstAppointmentDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-teal-50/30 to-blue-50/30 border-t border-gray-100">
                  <div className="flex gap-3">
                    <Link
                      to={`/doctors/${doctor.doctorId}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition-all font-semibold"
                    >
                      <FaUserMd />
                      View Profile
                    </Link>
                    <Link
                      to={`/appointments/book?doctor=${doctor.doctorId}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all font-semibold shadow-lg shadow-teal-500/25"
                    >
                      <FaCalendarCheck />
                      Book Again
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Find More Doctors CTA */}
        {!loading && doctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Looking for a New Doctor?</h3>
              <p className="text-gray-600 mb-4">
                Explore our network of verified healthcare professionals and find the perfect match for your needs.
              </p>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-semibold shadow-lg shadow-teal-500/25"
              >
                <FaUserMd />
                Find More Doctors
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyDoctors;
