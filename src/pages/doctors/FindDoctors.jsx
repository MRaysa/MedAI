import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaVideo,
  FaComments,
  FaGraduationCap,
  FaHospital,
  FaMoneyBillWave,
  FaChevronDown,
  FaTimes,
  FaLanguage,
  FaUserPlus,
  FaAward,
  FaBriefcaseMedical,
  FaIdCard,
  FaChevronUp,
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
} from "react-icons/fa";
import { MdVerified, MdLocalHospital, MdAccessTime, MdWorkspacePremium } from "react-icons/md";
import { HiOutlineBadgeCheck, HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiTime, BiMessageRoundedDetail } from "react-icons/bi";
import { IoMdPulse } from "react-icons/io";
import { RiStethoscopeLine, RiMedalLine } from "react-icons/ri";
import { BsStarFill, BsStarHalf, BsStar, BsClockHistory, BsPatchCheckFill } from "react-icons/bs";

const FindDoctors = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filters, setFilters] = useState({
    specialization: "all",
    minRating: "",
    maxFee: "",
    consultationType: "",
    sortBy: "rating",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const specializations = [
    "All Specializations",
    "General Practice",
    "Internal Medicine",
    "Family Medicine",
    "Pediatrics",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery",
    "Urology",
    "Gynecology",
    "Emergency Medicine",
    "Nephrology",
    "Allergy and Immunology",
  ];

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
    fetchDoctors();
  }, [pagination.page, filters]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
      });

      if (filters.specialization && filters.specialization !== "all") {
        params.append("specialization", filters.specialization);
      }
      if (filters.minRating) {
        params.append("minRating", filters.minRating);
      }
      if (filters.maxFee) {
        params.append("maxFee", filters.maxFee);
      }
      if (filters.consultationType) {
        params.append("consultationType", filters.consultationType);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await apiCall(`/doctors?${params.toString()}`);

      if (response.success) {
        setDoctors(response.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
          pages: response.pages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchDoctors();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      specialization: "all",
      minRating: "",
      maxFee: "",
      consultationType: "",
      sortBy: "rating",
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleExpandCard = (doctorId) => {
    setExpandedCard(expandedCard === doctorId ? null : doctorId);
  };

  const toggleFavorite = (doctorId) => {
    setFavorites(prev =>
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
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

  const getRatingBadge = (rating) => {
    if (rating >= 4.8) return { label: "Outstanding", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (rating >= 4.5) return { label: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (rating >= 4.0) return { label: "Very Good", color: "text-blue-600 bg-blue-50 border-blue-200" };
    return { label: "Good", color: "text-gray-600 bg-gray-50 border-gray-200" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 mb-4">
            <IoMdPulse className="text-teal-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Trusted Healthcare Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-gray-900 via-teal-800 to-teal-600 bg-clip-text text-transparent">
              Find Your Perfect Doctor
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Connect with verified healthcare professionals tailored to your needs
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{pagination.total}+</div>
              <div className="text-sm text-gray-500">Verified Doctors</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="text-sm text-gray-500">Specializations</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-6 mb-8"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full pl-14 pr-6 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all text-gray-700"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 flex items-center justify-center gap-2"
            >
              <FaSearch />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-medium ${
                showFilters
                  ? "bg-teal-50 text-teal-700 border-2 border-teal-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FaFilter />
              Filters
              <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                {Object.values(filters).filter(v => v && v !== "all" && v !== "rating").length}
              </span>
              <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </form>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Specialization */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🏥 Specialization
                      </label>
                      <select
                        value={filters.specialization}
                        onChange={(e) => handleFilterChange("specialization", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                      >
                        <option value="all">All Specializations</option>
                        {specializations.slice(1).map((spec) => (
                          <option key={spec} value={spec}>
                            {specializationIcons[spec] || "🏥"} {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⭐ Minimum Rating
                      </label>
                      <select
                        value={filters.minRating}
                        onChange={(e) => handleFilterChange("minRating", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                      >
                        <option value="">Any Rating</option>
                        <option value="4.5">⭐ 4.5+ Outstanding</option>
                        <option value="4">⭐ 4.0+ Excellent</option>
                        <option value="3.5">⭐ 3.5+ Very Good</option>
                        <option value="3">⭐ 3.0+ Good</option>
                      </select>
                    </div>

                    {/* Fee */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        💰 Max Fee
                      </label>
                      <select
                        value={filters.maxFee}
                        onChange={(e) => handleFilterChange("maxFee", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                      >
                        <option value="">Any Price</option>
                        <option value="50">Under $50</option>
                        <option value="100">Under $100</option>
                        <option value="150">Under $150</option>
                        <option value="200">Under $200</option>
                      </select>
                    </div>

                    {/* Consultation Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📞 Consultation Type
                      </label>
                      <select
                        value={filters.consultationType}
                        onChange={(e) => handleFilterChange("consultationType", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                      >
                        <option value="">All Types</option>
                        <option value="in_person">🏥 In-Person</option>
                        <option value="video">📹 Video Call</option>
                        <option value="phone">📱 Phone</option>
                        <option value="chat">💬 Chat</option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔄 Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                      >
                        <option value="rating">⭐ Highest Rated</option>
                        <option value="experience">👨‍⚕️ Most Experienced</option>
                        <option value="fee">💵 Lowest Fee</option>
                        <option value="newest">🆕 Recently Joined</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
                    >
                      <FaTimes /> Clear all filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent" />
                  Loading...
                </span>
              ) : (
                <>
                  Found <span className="font-bold text-teal-600">{pagination.total}</span> verified doctors
                </>
              )}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                viewMode === "grid" ? "bg-white shadow text-teal-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                viewMode === "list" ? "bg-white shadow text-teal-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Doctors Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
                <RiStethoscopeLine className="absolute inset-0 m-auto text-2xl text-teal-500" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Finding the best doctors for you...</p>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserMd className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filters.specialization !== "all"
                ? "Try adjusting your search criteria or filters to find more doctors."
                : "No verified doctors are available at the moment."}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium shadow-lg shadow-teal-500/25"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
            {doctors.map((doctor, index) => {
              const expBadge = getExperienceBadge(doctor.yearsOfExperience || 0);
              const ratingBadge = getRatingBadge(doctor.ratings?.average || 0);
              const isFavorite = favorites.includes(doctor._id);

              return (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Card Header with Gradient */}
                  <div className={`relative ${viewMode === "list" ? "w-72 flex-shrink-0" : ""}`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-2xl" />

                    <div className="relative p-6">
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(doctor._id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:scale-110 transition-transform z-10"
                      >
                        {isFavorite ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-lg hover:text-red-400" />
                        )}
                      </button>

                      {/* Doctor Avatar & Basic Info */}
                      <div className="flex items-start gap-4">
                        {/* Avatar with Status Ring */}
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${expBadge.color} rounded-2xl blur-lg opacity-30`} />
                          <div className="relative">
                            {doctor.user?.photoURL ? (
                              <img
                                src={doctor.user.photoURL}
                                alt={doctor.user.displayName}
                                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                              />
                            ) : (
                              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${expBadge.color} flex items-center justify-center ring-4 ring-white shadow-xl`}>
                                <FaUserMd className="text-3xl text-white" />
                              </div>
                            )}
                            {/* Online Indicator */}
                            {doctor.isOnline && (
                              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                            </h3>
                            <BsPatchCheckFill className="text-teal-500 text-lg flex-shrink-0" />
                          </div>

                          {/* Specialization with Icon */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{specializationIcons[doctor.specialization] || "🏥"}</span>
                            <span className="font-semibold text-teal-600">{doctor.specialization}</span>
                          </div>

                          {/* Experience Badge */}
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${expBadge.color} text-white text-xs font-bold shadow-lg`}>
                            <expBadge.icon className="text-sm" />
                            {expBadge.label} • {doctor.yearsOfExperience || 0} yrs
                          </div>
                        </div>
                      </div>

                      {/* Rating Section */}
                      <div className="mt-4 flex items-center gap-4 flex-wrap">
                        {/* Star Rating */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
                          <div className="flex items-center gap-0.5">
                            {renderStars(doctor.ratings?.average || 0, "text-lg")}
                          </div>
                          <span className="font-bold text-gray-900 text-lg">
                            {(doctor.ratings?.average || 0).toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({doctor.ratings?.count || 0})
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${ratingBadge.color}`}>
                          {ratingBadge.label}
                        </span>

                        {/* Accepts New Patients */}
                        {doctor.acceptsNewPatients && (
                          <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                            <FaUserPlus />
                            Accepting Patients
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1 border-l border-gray-100" : "pt-0"}`}>
                    {/* Sub-specializations */}
                    {doctor.subSpecializations?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.subSpecializations.slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Location & Clinic */}
                    <div className="space-y-2 mb-4">
                      {doctor.practiceInfo?.clinicName && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaHospital className="text-teal-500" />
                          <span className="font-medium truncate">{doctor.practiceInfo.clinicName}</span>
                        </div>
                      )}
                      {doctor.practiceInfo?.clinicAddress?.city && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaMapMarkerAlt className="text-red-400" />
                          <span>
                            {doctor.practiceInfo.clinicAddress.city}
                            {doctor.practiceInfo.clinicAddress.state && `, ${doctor.practiceInfo.clinicAddress.state}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <div className="relative mb-4 p-3 bg-gray-50 rounded-xl">
                        <FaQuoteLeft className="absolute top-2 left-2 text-gray-200 text-lg" />
                        <p className="text-gray-600 text-sm line-clamp-2 pl-6 italic">
                          {doctor.bio}
                        </p>
                      </div>
                    )}

                    {/* Qualifications */}
                    {doctor.qualifications?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.qualifications.slice(0, 3).map((qual, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100"
                          >
                            <FaGraduationCap className="text-blue-500" />
                            {qual.degree}
                          </span>
                        ))}
                        {doctor.qualifications.length > 3 && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            +{doctor.qualifications.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                        <FaMoneyBillWave className="text-teal-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900 text-sm">
                          {formatCurrency(doctor.fees?.inPersonConsultation, doctor.fees?.currency)}
                        </div>
                        <div className="text-gray-500 text-xs">In-Person</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <FaVideo className="text-blue-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900 text-sm">
                          {formatCurrency(doctor.fees?.videoConsultation, doctor.fees?.currency)}
                        </div>
                        <div className="text-gray-500 text-xs">Video</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <BiTime className="text-purple-500 mx-auto text-lg mb-1" />
                        <div className="font-bold text-gray-900 text-sm">
                          {doctor.consultationSettings?.defaultDuration || 30}m
                        </div>
                        <div className="text-gray-500 text-xs">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                        <FaCalendarCheck className="text-amber-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900 text-sm">
                          {doctor.stats?.totalConsultations || 0}+
                        </div>
                        <div className="text-gray-500 text-xs">Consults</div>
                      </div>
                    </div>

                    {/* Consultation Types */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getConsultationTypes(doctor.consultationSettings?.types).map((type, idx) => (
                        <span
                          key={idx}
                          className={`flex items-center gap-1.5 px-3 py-1.5 ${type.bg} ${type.color} rounded-lg text-sm font-semibold border ${type.border}`}
                        >
                          <type.icon />
                          {type.label}
                        </span>
                      ))}
                    </div>

                    {/* Languages */}
                    {doctor.languages?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <FaLanguage className="text-gray-400" />
                        <span className="font-medium">Speaks:</span>
                        <span>{doctor.languages.join(", ")}</span>
                      </div>
                    )}

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleExpandCard(doctor._id)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl text-sm font-semibold transition-all"
                    >
                      {expandedCard === doctor._id ? (
                        <>
                          <FaChevronUp />
                          Show Less
                        </>
                      ) : (
                        <>
                          <FaChevronDown />
                          View Full Details
                        </>
                      )}
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedCard === doctor._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-gray-100 space-y-5">
                            {/* Hospital Affiliations */}
                            {doctor.hospitalAffiliations?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                  <div className="p-1.5 bg-teal-100 rounded-lg">
                                    <FaHospital className="text-teal-600" />
                                  </div>
                                  Hospital Affiliations
                                </h4>
                                <div className="grid gap-2">
                                  {doctor.hospitalAffiliations.map((hospital, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                      <MdLocalHospital className="text-gray-400" />
                                      <div>
                                        <span className="font-semibold text-gray-800">{hospital.name}</span>
                                        {hospital.role && (
                                          <span className="text-gray-500 text-sm ml-2">• {hospital.role}</span>
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
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                  <div className="p-1.5 bg-amber-100 rounded-lg">
                                    <FaCertificate className="text-amber-600" />
                                  </div>
                                  Board Certifications
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {doctor.boardCertifications.map((cert, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-800 rounded-xl text-sm font-medium border border-amber-200"
                                    >
                                      <HiOutlineBadgeCheck className="text-amber-500" />
                                      {cert.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Full Qualifications */}
                            {doctor.qualifications?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                  <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <FaGraduationCap className="text-blue-600" />
                                  </div>
                                  Education & Qualifications
                                </h4>
                                <div className="grid gap-2">
                                  {doctor.qualifications.map((qual, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FaGraduationCap className="text-blue-500 text-sm" />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-800">{qual.degree}</div>
                                        {qual.institution && (
                                          <div className="text-gray-500 text-sm">{qual.institution}</div>
                                        )}
                                        {qual.year && (
                                          <div className="text-gray-400 text-xs">Class of {qual.year}</div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Fee Structure */}
                            {doctor.fees && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                                    <FaMoneyBillWave className="text-emerald-600" />
                                  </div>
                                  Fee Structure
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {doctor.fees.inPersonConsultation > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                      <div className="flex items-center gap-2">
                                        <MdLocalHospital className="text-emerald-500" />
                                        <span className="text-gray-600 text-sm">In-Person</span>
                                      </div>
                                      <span className="font-bold text-gray-900">
                                        {formatCurrency(doctor.fees.inPersonConsultation, doctor.fees.currency)}
                                      </span>
                                    </div>
                                  )}
                                  {doctor.fees.videoConsultation > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                      <div className="flex items-center gap-2">
                                        <FaVideo className="text-blue-500" />
                                        <span className="text-gray-600 text-sm">Video</span>
                                      </div>
                                      <span className="font-bold text-gray-900">
                                        {formatCurrency(doctor.fees.videoConsultation, doctor.fees.currency)}
                                      </span>
                                    </div>
                                  )}
                                  {doctor.fees.phoneConsultation > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                      <div className="flex items-center gap-2">
                                        <FaPhone className="text-violet-500" />
                                        <span className="text-gray-600 text-sm">Phone</span>
                                      </div>
                                      <span className="font-bold text-gray-900">
                                        {formatCurrency(doctor.fees.phoneConsultation, doctor.fees.currency)}
                                      </span>
                                    </div>
                                  )}
                                  {doctor.fees.followUpDiscount > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                      <div className="flex items-center gap-2">
                                        <FaThumbsUp className="text-emerald-500" />
                                        <span className="text-emerald-700 text-sm font-medium">Follow-up Discount</span>
                                      </div>
                                      <span className="font-bold text-emerald-700">
                                        {doctor.fees.followUpDiscount}% OFF
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Contact & Location */}
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                <div className="p-1.5 bg-purple-100 rounded-lg">
                                  <FaIdCard className="text-purple-600" />
                                </div>
                                Contact Information
                              </h4>
                              <div className="grid gap-3">
                                {doctor.practiceInfo?.clinicPhone && (
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                      <FaPhoneAlt className="text-violet-500" />
                                    </div>
                                    <span className="font-medium text-gray-700">{doctor.practiceInfo.clinicPhone}</span>
                                  </div>
                                )}
                                {doctor.practiceInfo?.clinicEmail && (
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <FaEnvelope className="text-blue-500" />
                                    </div>
                                    <span className="font-medium text-gray-700 truncate">{doctor.practiceInfo.clinicEmail}</span>
                                  </div>
                                )}
                                {doctor.practiceInfo?.clinicAddress && (
                                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <FaMapMarkerAlt className="text-red-500" />
                                    </div>
                                    <div className="text-gray-700">
                                      {doctor.practiceInfo.clinicAddress.street && (
                                        <div className="font-medium">{doctor.practiceInfo.clinicAddress.street}</div>
                                      )}
                                      <div className="text-gray-500 text-sm">
                                        {doctor.practiceInfo.clinicAddress.city && `${doctor.practiceInfo.clinicAddress.city}, `}
                                        {doctor.practiceInfo.clinicAddress.state && `${doctor.practiceInfo.clinicAddress.state} `}
                                        {doctor.practiceInfo.clinicAddress.zipCode}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Consultation Settings */}
                            {doctor.consultationSettings && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                  <div className="p-1.5 bg-cyan-100 rounded-lg">
                                    <MdAccessTime className="text-cyan-600" />
                                  </div>
                                  Consultation Settings
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                                    <BsClockHistory className="text-cyan-500 text-xl mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{doctor.consultationSettings.defaultDuration || 30} min</div>
                                    <div className="text-gray-500 text-xs">Session Duration</div>
                                  </div>
                                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                    <FaRegClock className="text-purple-500 text-xl mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{doctor.consultationSettings.bufferTime || 10} min</div>
                                    <div className="text-gray-500 text-xs">Buffer Time</div>
                                  </div>
                                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                                    <FaUserMd className="text-amber-500 text-xl mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{doctor.consultationSettings.maxPatientsPerDay || 20}</div>
                                    <div className="text-gray-500 text-xs">Max Patients/Day</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-teal-50/30 to-blue-50/30 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition-all font-semibold group/btn"
                      >
                        <FaUserMd className="group-hover/btn:scale-110 transition-transform" />
                        View Profile
                      </Link>
                      <Link
                        to={`/appointments/book?doctor=${doctor._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 group/btn"
                      >
                        <FaCalendarCheck className="group-hover/btn:scale-110 transition-transform" />
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-4 py-2.5 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <FaChevronUp className="rotate-[-90deg]" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination((prev) => ({ ...prev, page: pageNum }))}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                        pagination.page === pageNum
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2.5 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                Next
                <FaChevronUp className="rotate-90" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
