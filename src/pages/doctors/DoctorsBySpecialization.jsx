import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaComments,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaArrowLeft,
  FaHospital,
  FaGraduationCap,
  FaHeart,
  FaClock,
  FaAward,
  FaCheckCircle,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { MdVerified, MdLocalHospital, MdAccessTime } from "react-icons/md";
import { BsStarFill, BsGridFill, BsListUl, BsLightningChargeFill } from "react-icons/bs";
import { HiSparkles, HiLocationMarker } from "react-icons/hi";
import { RiStethoscopeLine } from "react-icons/ri";

const DoctorsBySpecialization = () => {
  const { apiCall } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get("spec") || ""
  );
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const specializations = [
    { name: "General Practice", icon: "🩺", color: "from-blue-500 to-blue-600", lightColor: "bg-blue-50", textColor: "text-blue-600" },
    { name: "Internal Medicine", icon: "💊", color: "from-purple-500 to-purple-600", lightColor: "bg-purple-50", textColor: "text-purple-600" },
    { name: "Family Medicine", icon: "👨‍👩‍👧‍👦", color: "from-green-500 to-green-600", lightColor: "bg-green-50", textColor: "text-green-600" },
    { name: "Pediatrics", icon: "👶", color: "from-pink-500 to-pink-600", lightColor: "bg-pink-50", textColor: "text-pink-600" },
    { name: "Cardiology", icon: "❤️", color: "from-red-500 to-red-600", lightColor: "bg-red-50", textColor: "text-red-600" },
    { name: "Dermatology", icon: "🧴", color: "from-amber-500 to-amber-600", lightColor: "bg-amber-50", textColor: "text-amber-600" },
    { name: "Endocrinology", icon: "🧬", color: "from-teal-500 to-teal-600", lightColor: "bg-teal-50", textColor: "text-teal-600" },
    { name: "Gastroenterology", icon: "🫃", color: "from-orange-500 to-orange-600", lightColor: "bg-orange-50", textColor: "text-orange-600" },
    { name: "Neurology", icon: "🧠", color: "from-indigo-500 to-indigo-600", lightColor: "bg-indigo-50", textColor: "text-indigo-600" },
    { name: "Oncology", icon: "🎗️", color: "from-violet-500 to-violet-600", lightColor: "bg-violet-50", textColor: "text-violet-600" },
    { name: "Ophthalmology", icon: "👁️", color: "from-cyan-500 to-cyan-600", lightColor: "bg-cyan-50", textColor: "text-cyan-600" },
    { name: "Orthopedics", icon: "🦴", color: "from-slate-500 to-slate-600", lightColor: "bg-slate-50", textColor: "text-slate-600" },
    { name: "Psychiatry", icon: "🧘", color: "from-fuchsia-500 to-fuchsia-600", lightColor: "bg-fuchsia-50", textColor: "text-fuchsia-600" },
    { name: "Pulmonology", icon: "🫁", color: "from-sky-500 to-sky-600", lightColor: "bg-sky-50", textColor: "text-sky-600" },
    { name: "Radiology", icon: "📷", color: "from-gray-500 to-gray-600", lightColor: "bg-gray-100", textColor: "text-gray-600" },
    { name: "Rheumatology", icon: "🦵", color: "from-rose-500 to-rose-600", lightColor: "bg-rose-50", textColor: "text-rose-600" },
    { name: "Surgery", icon: "🔪", color: "from-emerald-500 to-emerald-600", lightColor: "bg-emerald-50", textColor: "text-emerald-600" },
    { name: "Urology", icon: "🩻", color: "from-lime-500 to-lime-600", lightColor: "bg-lime-50", textColor: "text-lime-600" },
    { name: "Gynecology", icon: "👩", color: "from-pink-400 to-pink-500", lightColor: "bg-pink-50", textColor: "text-pink-500" },
    { name: "Emergency Medicine", icon: "🚑", color: "from-red-600 to-red-700", lightColor: "bg-red-50", textColor: "text-red-600" },
    { name: "Nephrology", icon: "🫘", color: "from-amber-600 to-amber-700", lightColor: "bg-amber-50", textColor: "text-amber-600" },
    { name: "Allergy and Immunology", icon: "🤧", color: "from-yellow-500 to-yellow-600", lightColor: "bg-yellow-50", textColor: "text-yellow-600" },
  ];

  useEffect(() => {
    if (selectedSpecialization) {
      fetchDoctorsBySpecialization();
    } else {
      setLoading(false);
    }
  }, [selectedSpecialization]);

  const fetchDoctorsBySpecialization = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        `/doctors/specialization/${encodeURIComponent(selectedSpecialization)}`
      );
      if (response.success) {
        setDoctors(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationSelect = (specName) => {
    setSelectedSpecialization(specName);
    setSearchParams({ spec: specName });
  };

  const handleBack = () => {
    setSelectedSpecialization("");
    setSearchParams({});
    setDoctors([]);
  };

  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpecializationData = (name) => {
    return specializations.find((s) => s.name === name) || {
      icon: "🩺",
      color: "from-teal-500 to-teal-600",
      lightColor: "bg-teal-50",
      textColor: "text-teal-600",
    };
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0);
      case "experience":
        return (b.experience || 0) - (a.experience || 0);
      case "price-low":
        return (a.fees?.inPersonConsultation || 0) - (b.fees?.inPersonConsultation || 0);
      case "price-high":
        return (b.fees?.inPersonConsultation || 0) - (a.fees?.inPersonConsultation || 0);
      default:
        return 0;
    }
  });

  // Show specialization selection
  if (!selectedSpecialization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 py-16">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                <HiSparkles className="text-yellow-300" />
                Find Your Perfect Specialist
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Browse by Specialization
              </h1>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                Discover expert doctors across 22+ medical specializations.
                Your health journey starts with the right specialist.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mt-10"
            >
              <div className="relative">
                <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search specializations (e.g., Cardiology, Neurology...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-2xl shadow-teal-900/20 focus:ring-4 focus:ring-white/30 focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Specializations Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: "Specializations", value: "22+", icon: RiStethoscopeLine, color: "from-teal-500 to-teal-600" },
              { label: "Verified Doctors", value: "500+", icon: MdVerified, color: "from-blue-500 to-blue-600" },
              { label: "Happy Patients", value: "10K+", icon: FaHeart, color: "from-rose-500 to-pink-500" },
              { label: "Avg Rating", value: "4.8", icon: FaStar, color: "from-amber-500 to-orange-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="text-xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Section Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Specializations</h2>
              <p className="text-gray-500 mt-1">Choose a category to find your doctor</p>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredSpecializations.length} categories
            </span>
          </div>

          {/* Specialization Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredSpecializations.map((spec, index) => (
              <motion.button
                key={spec.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleSpecializationSelect(spec.name)}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${spec.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${spec.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      {spec.icon}
                    </div>
                    <div className={`px-3 py-1 ${spec.lightColor} ${spec.textColor} rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity`}>
                      View All
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-teal-600 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaUserMd className="text-gray-400" />
                    Browse specialists
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>

          {filteredSpecializations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-500">No specializations match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition font-medium"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Show doctors for selected specialization
  const specData = getSpecializationData(selectedSpecialization);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${specData.color} py-12`}>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to all specializations</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-xl">
                {specData.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedSpecialization}</h1>
                <p className="text-white/80 mt-1 flex items-center gap-2">
                  <FaUserMd />
                  {doctors.length} {doctors.length === 1 ? "specialist" : "specialists"} available
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                <option value="rating" className="text-gray-900">Top Rated</option>
                <option value="experience" className="text-gray-900">Most Experienced</option>
                <option value="price-low" className="text-gray-900">Price: Low to High</option>
                <option value="price-high" className="text-gray-900">Price: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "grid" ? "bg-white text-teal-600" : "text-white/70 hover:text-white"
                  }`}
                >
                  <BsGridFill />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "list" ? "bg-white text-teal-600" : "text-white/70 hover:text-white"
                  }`}
                >
                  <BsListUl />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 animate-pulse" />
                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Finding the best specialists...</p>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserMd className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Specialists Yet</h2>
            <p className="text-gray-500 mb-8">
              We're working on bringing {selectedSpecialization} specialists to our platform.
              Check back soon or explore other specializations.
            </p>
            <button
              onClick={handleBack}
              className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${specData.color} text-white rounded-xl hover:shadow-lg transition font-semibold`}
            >
              <FaArrowLeft />
              Browse Other Specializations
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {sortedDoctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  index={index}
                  viewMode={viewMode}
                  specData={specData}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// Enhanced Doctor Card Component
const DoctorCard = ({ doctor, index, viewMode, specData }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatFee = (fee) => {
    if (!fee) return "Contact";
    return `$${fee.toLocaleString()}`;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-teal-100 transition-all duration-300 group"
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.user?.profileImage ? (
              <img
                src={doctor.user.profileImage}
                alt={`Dr. ${doctor.user?.firstName}`}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-shadow"
              />
            ) : (
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${specData.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
              >
                {doctor.user?.firstName?.charAt(0) || "D"}
              </div>
            )}
            {doctor.verificationStatus === "approved" && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                <MdVerified className="text-white text-lg" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-xl group-hover:text-teal-600 transition-colors">
                  Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                </h3>
                <p className={`${specData.textColor} font-semibold`}>{doctor.specialization}</p>
                {doctor.practiceInfo?.clinicName && (
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                    <FaHospital className="text-gray-400" />
                    {doctor.practiceInfo.clinicName}
                  </p>
                )}
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
                <FaStar className="text-amber-500" />
                <span className="font-bold text-amber-700">
                  {doctor.ratings?.average?.toFixed(1) || "New"}
                </span>
                {doctor.ratings?.count > 0 && (
                  <span className="text-amber-600/70 text-sm">({doctor.ratings.count})</span>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {doctor.yearsOfExperience && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                  <FaGraduationCap className="text-gray-500" />
                  {doctor.yearsOfExperience} yrs exp.
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg text-sm text-green-700">
                <FaMoneyBillWave className="text-green-500" />
                {formatFee(doctor.fees?.inPersonConsultation)} / visit
              </span>
              {doctor.consultationSettings?.defaultDuration && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <FaClock className="text-blue-500" />
                  {doctor.consultationSettings.defaultDuration} min session
                </span>
              )}
            </div>

            {/* Consultation Types */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-gray-500">Available via:</span>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-teal-100 text-teal-600 rounded-lg" title="In-Person">
                  <MdLocalHospital />
                </span>
                {doctor.consultationSettings?.videoConsultation && (
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg" title="Video Call">
                    <FaVideo />
                  </span>
                )}
                {doctor.consultationSettings?.phoneConsultation && (
                  <span className="p-2 bg-violet-100 text-violet-600 rounded-lg" title="Phone Call">
                    <FaPhone />
                  </span>
                )}
                {doctor.consultationSettings?.chatConsultation && (
                  <span className="p-2 bg-pink-100 text-pink-600 rounded-lg" title="Chat">
                    <FaComments />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/doctors/${doctor._id}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold text-center"
            >
              View Profile
            </Link>
            <Link
              to={`/appointments/book?doctor=${doctor._id}`}
              className={`px-6 py-3 bg-gradient-to-r ${specData.color} text-white rounded-xl hover:shadow-lg transition font-semibold flex items-center justify-center gap-2`}
            >
              <FaCalendarCheck />
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View - Premium Card Design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-500"
    >
      {/* Card Header - Gradient Background */}
      <div className={`relative h-32 bg-gradient-to-br ${specData.color}`}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full" />
        </div>

        {/* Verified Badge */}
        {doctor.verificationStatus === "approved" && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-full"
          >
            <MdVerified className="text-white" />
            <span className="text-white text-xs font-semibold">Verified</span>
          </motion.div>
        )}

        {/* Quick Book Badge */}
        {doctor.isAvailable && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 rounded-full">
            <BsLightningChargeFill className="text-white text-xs" />
            <span className="text-white text-xs font-semibold">Available</span>
          </div>
        )}
      </div>

      {/* Avatar - Overlapping */}
      <div className="px-6 -mt-14 relative z-10">
        <div className="relative inline-block">
          {doctor.user?.profileImage ? (
            <img
              src={doctor.user.profileImage}
              alt={`Dr. ${doctor.user?.firstName}`}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${specData.color} flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300`}>
              {doctor.user?.firstName?.charAt(0) || "D"}
            </div>
          )}

          {/* Online Indicator */}
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-xl group-hover:text-teal-600 transition-colors">
            Dr. {doctor.user?.firstName} {doctor.user?.lastName}
          </h3>
          <p className={`${specData.textColor} font-semibold text-sm`}>{doctor.specialization}</p>
        </div>

        {doctor.practiceInfo?.clinicName && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaHospital className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{doctor.practiceInfo.clinicName}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-100">
          <div className="flex items-center gap-1.5">
            <FaStar className="text-amber-500" />
            <span className="font-bold text-gray-900">
              {doctor.ratings?.average?.toFixed(1) || "New"}
            </span>
            <span className="text-gray-400 text-sm">
              ({doctor.ratings?.count || 0})
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <FaGraduationCap className="text-gray-400" />
            <span className="font-medium">{doctor.yearsOfExperience || 0} yrs</span>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Fee</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatFee(doctor.fees?.inPersonConsultation)}
              <span className="text-sm font-normal text-gray-500 ml-1">/ visit</span>
            </p>
          </div>

          {/* Consultation Icons */}
          <div className="flex items-center gap-1.5">
            <span className={`p-2 ${specData.lightColor} ${specData.textColor} rounded-xl`} title="In-Person">
              <MdLocalHospital />
            </span>
            {doctor.consultationSettings?.videoConsultation && (
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl" title="Video">
                <FaVideo />
              </span>
            )}
            {doctor.consultationSettings?.phoneConsultation && (
              <span className="p-2 bg-violet-50 text-violet-600 rounded-xl" title="Phone">
                <FaPhone />
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            to={`/doctors/${doctor._id}`}
            className="flex-1 py-3 text-center bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
          >
            View Profile
          </Link>
          <Link
            to={`/appointments/book?doctor=${doctor._id}`}
            className={`flex-1 py-3 text-center bg-gradient-to-r ${specData.color} text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-semibold flex items-center justify-center gap-2`}
          >
            <FaCalendarCheck />
            Book
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorsBySpecialization;
