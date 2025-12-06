import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaVideo,
  FaComments,
  FaGraduationCap,
  FaHospital,
  FaMoneyBillWave,
  FaLanguage,
  FaUserPlus,
  FaAward,
  FaIdCard,
  FaCalendarCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaHeart,
  FaRegHeart,
  FaCertificate,
  FaQuoteLeft,
  FaThumbsUp,
  FaRegClock,
  FaShieldAlt,
  FaArrowLeft,
  FaClock,
  FaCheck,
  FaTimes,
  FaShareAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdVerified, MdLocalHospital, MdAccessTime, MdWorkspacePremium, MdSchedule } from "react-icons/md";
import { HiOutlineBadgeCheck, HiSparkles, HiLocationMarker } from "react-icons/hi";
import { BiTime, BiMessageRoundedDetail } from "react-icons/bi";
import { IoMdPulse } from "react-icons/io";
import { RiStethoscopeLine, RiMedalLine } from "react-icons/ri";
import { BsStarFill, BsStarHalf, BsStar, BsClockHistory, BsPatchCheckFill, BsCalendar3 } from "react-icons/bs";

const DoctorPublicProfile = () => {
  const { id } = useParams();
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareModal, setShowShareModal] = useState(false);

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

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(`/doctors/${id}`);
      if (response.success) {
        setDoctor(response.data);
      } else {
        setError(response.message || "Doctor not found");
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError("Failed to load doctor profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Dr. ${doctor?.user?.firstName} ${doctor?.user?.lastName} - ${doctor?.specialization}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
  };

  const renderStars = (rating, size = "text-base") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<BsStarFill key={i} className={`text-amber-400 ${size}`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className={`text-amber-400 ${size}`} />);
      } else {
        stars.push(<BsStar key={i} className={`text-gray-300 ${size}`} />);
      }
    }
    return stars;
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getExperienceBadge = (years) => {
    if (years >= 20) return { label: "Master", color: "from-amber-500 to-orange-600", icon: MdWorkspacePremium };
    if (years >= 10) return { label: "Expert", color: "from-purple-500 to-indigo-600", icon: RiMedalLine };
    if (years >= 5) return { label: "Experienced", color: "from-blue-500 to-cyan-600", icon: FaAward };
    return { label: "Rising Star", color: "from-emerald-500 to-teal-600", icon: HiSparkles };
  };

  const getConsultationTypes = (types) => {
    if (!types || types.length === 0) return [];
    const typeMap = {
      in_person: { icon: MdLocalHospital, label: "In-Person", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
      video: { icon: FaVideo, label: "Video", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
      phone: { icon: FaPhone, label: "Phone", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
      chat: { icon: FaComments, label: "Chat", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
    };
    return types.map((type) => typeMap[type]).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
            <RiStethoscopeLine className="absolute inset-0 m-auto text-2xl text-teal-500" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The doctor profile you're looking for doesn't exist or has been removed."}</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium shadow-lg shadow-teal-500/25"
          >
            <FaArrowLeft />
            Back to Find Doctors
          </Link>
        </motion.div>
      </div>
    );
  }

  const expBadge = getExperienceBadge(doctor.yearsOfExperience || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 hover:bg-white rounded-xl transition-all font-medium"
          >
            <FaArrowLeft />
            Back to Find Doctors
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6"
        >
          {/* Cover Gradient */}
          <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition"
              >
                <FaShareAlt />
              </button>
              <button
                onClick={toggleFavorite}
                className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition"
              >
                {isFavorite ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 bg-gradient-to-r ${expBadge.color} rounded-3xl blur-lg opacity-40`} />
                <div className="relative">
                  {doctor.user?.photoURL ? (
                    <img
                      src={doctor.user.photoURL}
                      alt={doctor.user.displayName}
                      className="w-36 h-36 rounded-3xl object-cover ring-4 ring-white shadow-2xl"
                    />
                  ) : (
                    <div className={`w-36 h-36 rounded-3xl bg-gradient-to-br ${expBadge.color} flex items-center justify-center ring-4 ring-white shadow-2xl`}>
                      <FaUserMd className="text-5xl text-white" />
                    </div>
                  )}
                  {/* Online Status */}
                  {doctor.isOnline && (
                    <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Online
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-0 md:pb-2">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                  </h1>
                  <BsPatchCheckFill className="text-teal-500 text-2xl flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <RiStethoscopeLine className="text-teal-500 text-xl flex-shrink-0" />
                  <span className="mt-6 text-xl font-semibold text-teal-600">{doctor.specialization}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Experience Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${expBadge.color} text-white font-bold shadow-lg`}>
                    <expBadge.icon className="text-lg" />
                    {expBadge.label} • {doctor.yearsOfExperience || 0} Years Experience
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-0.5">
                      {renderStars(doctor.ratings?.average || 0, "text-lg")}
                    </div>
                    <span className="font-bold text-gray-900">{(doctor.ratings?.average || 0).toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({doctor.ratings?.count || 0} reviews)</span>
                  </div>

                  {/* Accepts Patients */}
                  {doctor.acceptsNewPatients && (
                    <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-semibold border border-emerald-200">
                      <FaUserPlus />
                      Accepting New Patients
                    </span>
                  )}
                </div>
              </div>

              {/* Book Button */}
              <div className="flex-shrink-0">
                <Link
                  to={`/appointments/book?doctor=${doctor._id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all font-bold text-lg shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50"
                >
                  <FaCalendarCheck />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: FaUserMd },
                  { id: "qualifications", label: "Qualifications", icon: FaGraduationCap },
                  { id: "schedule", label: "Schedule", icon: FaClock },
                  { id: "reviews", label: "Reviews", icon: FaStar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition border-b-2 ${
                      activeTab === tab.id
                        ? "text-teal-600 border-teal-600 bg-teal-50/50"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Bio */}
                    {doctor.bio && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                          <div className="p-2 bg-teal-100 rounded-xl">
                            <FaQuoteLeft className="text-teal-600" />
                          </div>
                          About Dr. {doctor.user?.lastName}
                        </h3>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                          {doctor.bio}
                        </p>
                      </div>
                    )}

                    {/* Sub-specializations */}
                    {doctor.subSpecializations?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                          <div className="p-2 bg-purple-100 rounded-xl">
                            <RiStethoscopeLine className="text-purple-600" />
                          </div>
                          Areas of Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.subSpecializations.map((sub, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl font-medium border border-purple-100"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Consultation Types */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <BiMessageRoundedDetail className="text-blue-600" />
                        </div>
                        Consultation Types
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getConsultationTypes(doctor.consultationSettings?.types).map((type, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col items-center gap-2 p-4 ${type.bg} rounded-2xl border ${type.border}`}
                          >
                            <type.icon className={`text-2xl ${type.color}`} />
                            <span className={`font-semibold ${type.color}`}>{type.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    {doctor.languages?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                          <div className="p-2 bg-cyan-100 rounded-xl">
                            <FaLanguage className="text-cyan-600" />
                          </div>
                          Languages Spoken
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-xl font-medium border border-cyan-200"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hospital Affiliations */}
                    {doctor.hospitalAffiliations?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                          <div className="p-2 bg-rose-100 rounded-xl">
                            <FaHospital className="text-rose-600" />
                          </div>
                          Hospital Affiliations
                        </h3>
                        <div className="grid gap-3">
                          {doctor.hospitalAffiliations.map((hospital, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <MdLocalHospital className="text-2xl text-rose-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{hospital.name}</div>
                                {hospital.role && (
                                  <div className="text-gray-500 text-sm">{hospital.role}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Qualifications Tab */}
                {activeTab === "qualifications" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Education */}
                    {doctor.qualifications?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                          <div className="p-2 bg-blue-100 rounded-xl">
                            <FaGraduationCap className="text-blue-600" />
                          </div>
                          Education & Degrees
                        </h3>
                        <div className="space-y-3">
                          {doctor.qualifications.map((qual, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <FaGraduationCap className="text-xl text-blue-500" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg">{qual.degree}</div>
                                {qual.institution && (
                                  <div className="text-gray-600">{qual.institution}</div>
                                )}
                                {qual.year && (
                                  <div className="text-gray-400 text-sm mt-1">Class of {qual.year}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Board Certifications */}
                    {doctor.boardCertifications?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                          <div className="p-2 bg-amber-100 rounded-xl">
                            <FaCertificate className="text-amber-600" />
                          </div>
                          Board Certifications
                        </h3>
                        <div className="grid gap-3">
                          {doctor.boardCertifications.map((cert, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <HiOutlineBadgeCheck className="text-2xl text-amber-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{cert.name}</div>
                                {cert.issuingBody && (
                                  <div className="text-gray-500 text-sm">{cert.issuingBody}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* License Info */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-xl">
                          <FaIdCard className="text-emerald-600" />
                        </div>
                        License Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {doctor.licenseNumber && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">License Number</div>
                            <div className="font-semibold text-gray-900">{doctor.licenseNumber}</div>
                          </div>
                        )}
                        {doctor.licenseState && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">Licensed State</div>
                            <div className="font-semibold text-gray-900">{doctor.licenseState}</div>
                          </div>
                        )}
                        {doctor.npiNumber && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">NPI Number</div>
                            <div className="font-semibold text-gray-900">{doctor.npiNumber}</div>
                          </div>
                        )}
                        {doctor.licenseExpiry && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">License Valid Until</div>
                            <div className="font-semibold text-gray-900">
                              {new Date(doctor.licenseExpiry).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <div className="p-2 bg-teal-100 rounded-xl">
                          <BsCalendar3 className="text-teal-600" />
                        </div>
                        Weekly Schedule
                      </h3>
                      <div className="space-y-2">
                        {days.map((day) => {
                          const schedule = doctor.availability?.schedule?.[day];
                          const isAvailable = schedule?.isAvailable;

                          return (
                            <div
                              key={day}
                              className={`flex items-center justify-between p-4 rounded-xl ${
                                isAvailable ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isAvailable ? (
                                  <FaCheck className="text-emerald-500" />
                                ) : (
                                  <FaTimes className="text-gray-400" />
                                )}
                                <span className={`font-semibold capitalize ${isAvailable ? "text-gray-900" : "text-gray-400"}`}>
                                  {day}
                                </span>
                              </div>
                              <div>
                                {isAvailable && schedule?.slots?.length > 0 ? (
                                  <div className="flex flex-wrap gap-2 justify-end">
                                    {schedule.slots.map((slot, idx) => (
                                      <span key={idx} className="px-3 py-1 bg-white text-emerald-700 rounded-lg text-sm font-medium shadow-sm">
                                        {slot.start} - {slot.end}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Unavailable</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Consultation Settings */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <div className="p-2 bg-purple-100 rounded-xl">
                          <MdAccessTime className="text-purple-600" />
                        </div>
                        Appointment Details
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                          <BsClockHistory className="text-cyan-500 text-2xl mx-auto mb-2" />
                          <div className="font-bold text-gray-900 text-xl">{doctor.consultationSettings?.defaultDuration || 30}</div>
                          <div className="text-gray-500 text-sm">Minutes/Session</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <FaRegClock className="text-purple-500 text-2xl mx-auto mb-2" />
                          <div className="font-bold text-gray-900 text-xl">{doctor.consultationSettings?.bufferTime || 10}</div>
                          <div className="text-gray-500 text-sm">Buffer Time (min)</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                          <FaUserMd className="text-amber-500 text-2xl mx-auto mb-2" />
                          <div className="font-bold text-gray-900 text-xl">{doctor.consultationSettings?.maxPatientsPerDay || 20}</div>
                          <div className="text-gray-500 text-sm">Max Patients/Day</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Rating Summary */}
                    <div className="flex items-center gap-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-1">
                          {(doctor.ratings?.average || 0).toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 justify-center mb-1">
                          {renderStars(doctor.ratings?.average || 0, "text-xl")}
                        </div>
                        <div className="text-gray-500 text-sm">{doctor.ratings?.count || 0} reviews</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-8">{star} ★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews Placeholder */}
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaStar className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Reviews Coming Soon</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        We're working on bringing you verified patient reviews. Check back soon!
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Fee Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <FaMoneyBillWave className="text-emerald-600" />
                </div>
                Consultation Fees
              </h3>
              <div className="space-y-3">
                {doctor.fees?.inPersonConsultation > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MdLocalHospital className="text-emerald-500" />
                      <span className="text-gray-600">In-Person</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(doctor.fees.inPersonConsultation, doctor.fees?.currency)}
                    </span>
                  </div>
                )}
                {doctor.fees?.videoConsultation > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaVideo className="text-blue-500" />
                      <span className="text-gray-600">Video Call</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(doctor.fees.videoConsultation, doctor.fees?.currency)}
                    </span>
                  </div>
                )}
                {doctor.fees?.phoneConsultation > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-violet-500" />
                      <span className="text-gray-600">Phone</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(doctor.fees.phoneConsultation, doctor.fees?.currency)}
                    </span>
                  </div>
                )}
                {doctor.fees?.followUpDiscount > 0 && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FaThumbsUp className="text-emerald-500" />
                      <span className="text-emerald-700 font-medium">Follow-up Discount</span>
                    </div>
                    <span className="font-bold text-emerald-700 text-lg">
                      {doctor.fees.followUpDiscount}% OFF
                    </span>
                  </div>
                )}
              </div>

              <Link
                to={`/appointments/book?doctor=${doctor._id}`}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all font-bold shadow-lg shadow-teal-500/30"
              >
                <FaCalendarCheck />
                Book Appointment
              </Link>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <FaIdCard className="text-purple-600" />
                </div>
                Contact & Location
              </h3>
              <div className="space-y-4">
                {doctor.practiceInfo?.clinicName && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaHospital className="text-rose-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{doctor.practiceInfo.clinicName}</div>
                      {doctor.practiceInfo.clinicAddress && (
                        <div className="text-gray-500 text-sm mt-1">
                          {doctor.practiceInfo.clinicAddress.street && (
                            <div>{doctor.practiceInfo.clinicAddress.street}</div>
                          )}
                          <div>
                            {doctor.practiceInfo.clinicAddress.city && `${doctor.practiceInfo.clinicAddress.city}, `}
                            {doctor.practiceInfo.clinicAddress.state && `${doctor.practiceInfo.clinicAddress.state} `}
                            {doctor.practiceInfo.clinicAddress.zipCode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {doctor.practiceInfo?.clinicPhone && (
                  <a
                    href={`tel:${doctor.practiceInfo.clinicPhone}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                      <FaPhoneAlt className="text-violet-500" />
                    </div>
                    <span className="font-medium text-gray-700">{doctor.practiceInfo.clinicPhone}</span>
                  </a>
                )}

                {doctor.practiceInfo?.clinicEmail && (
                  <a
                    href={`mailto:${doctor.practiceInfo.clinicEmail}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaEnvelope className="text-blue-500" />
                    </div>
                    <span className="font-medium text-gray-700 truncate">{doctor.practiceInfo.clinicEmail}</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                <IoMdPulse className="text-xl" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">{doctor.stats?.totalPatients || 0}</div>
                  <div className="text-white/80 text-sm">Total Patients</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">{doctor.stats?.completedAppointments || 0}</div>
                  <div className="text-white/80 text-sm">Consultations</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold">{doctor.yearsOfExperience || 0}</div>
                  <div className="text-white/80 text-sm">Years Exp.</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <FaStar className="text-amber-300" />
                    {(doctor.ratings?.average || 0).toFixed(1)}
                  </div>
                  <div className="text-white/80 text-sm">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="text-3xl text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Verified Professional</h4>
              <p className="text-gray-500 text-sm">
                This doctor's credentials have been verified by our medical team
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Doctor Profile</h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-4">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 bg-transparent text-gray-600 text-sm outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium text-sm"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorPublicProfile;
