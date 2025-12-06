import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
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
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaHospital,
  FaMoneyBillWave,
  FaChevronDown,
  FaTimes,
  FaCheckCircle,
  FaLanguage,
  FaUserPlus,
} from "react-icons/fa";
import { MdVerified, MdLocalHospital } from "react-icons/md";

const FindDoctors = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  const getConsultationTypes = (types) => {
    if (!types || types.length === 0) return [];
    const typeMap = {
      in_person: { icon: MdLocalHospital, label: "In-Person", color: "text-green-600" },
      video: { icon: FaVideo, label: "Video", color: "text-blue-600" },
      phone: { icon: FaPhone, label: "Phone", color: "text-purple-600" },
      chat: { icon: FaComments, label: "Chat", color: "text-teal-600" },
    };
    return types.map((type) => typeMap[type]).filter(Boolean);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FaStar key={i} className="text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStar key={i} className="text-amber-400 opacity-50" />
        );
      } else {
        stars.push(
          <FaStar key={i} className="text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Your Doctor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our network of verified healthcare professionals and book your appointment today.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by specialization, location, or clinic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              <FaFilter />
              Filters
              <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </form>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange("specialization", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.slice(1).map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange("minRating", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                {/* Max Fee Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Consultation Fee
                  </label>
                  <select
                    value={filters.maxFee}
                    onChange={(e) => handleFilterChange("maxFee", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Any Price</option>
                    <option value="50">Under $50</option>
                    <option value="100">Under $100</option>
                    <option value="150">Under $150</option>
                    <option value="200">Under $200</option>
                  </select>
                </div>

                {/* Consultation Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Type
                  </label>
                  <select
                    value={filters.consultationType}
                    onChange={(e) => handleFilterChange("consultationType", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Types</option>
                    <option value="in_person">In-Person</option>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="fee">Lowest Fee</option>
                    <option value="newest">Recently Joined</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <FaTimes /> Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? (
              "Loading..."
            ) : (
              <>
                Found <span className="font-semibold text-gray-900">{pagination.total}</span> verified doctors
              </>
            )}
          </p>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding doctors...</p>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserMd className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Doctors Found
            </h2>
            <p className="text-gray-500 mb-6">
              {searchTerm || filters.specialization !== "all"
                ? "Try adjusting your search criteria or filters."
                : "No verified doctors are available at the moment."}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Doctor Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {doctor.user?.photoURL ? (
                        <img
                          src={doctor.user.photoURL}
                          alt={doctor.user.displayName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                          <FaUserMd className="text-2xl text-teal-600" />
                        </div>
                      )}
                      {doctor.isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Name and Specialization */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                        </h3>
                        <MdVerified className="text-teal-500" title="Verified Doctor" />
                      </div>
                      <p className="text-teal-600 font-medium text-sm">
                        {doctor.specialization}
                      </p>
                      {doctor.yearsOfExperience > 0 && (
                        <p className="text-gray-500 text-sm">
                          {doctor.yearsOfExperience} years experience
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                      {renderStars(doctor.ratings?.average || 0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {doctor.ratings?.average?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({doctor.ratings?.count || 0} reviews)
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="mt-4 space-y-2">
                    {/* Location */}
                    {doctor.practiceInfo?.clinicAddress?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>
                          {doctor.practiceInfo.clinicAddress.city}
                          {doctor.practiceInfo.clinicAddress.state && `, ${doctor.practiceInfo.clinicAddress.state}`}
                        </span>
                      </div>
                    )}

                    {/* Hospital/Clinic */}
                    {doctor.practiceInfo?.clinicName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaHospital className="text-gray-400" />
                        <span className="truncate">{doctor.practiceInfo.clinicName}</span>
                      </div>
                    )}

                    {/* Fee */}
                    {doctor.fees?.inPersonConsultation > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMoneyBillWave className="text-gray-400" />
                        <span>
                          ${doctor.fees.inPersonConsultation} consultation
                        </span>
                      </div>
                    )}

                    {/* Languages */}
                    {doctor.languages?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaLanguage className="text-gray-400" />
                        <span>{doctor.languages.slice(0, 3).join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Consultation Types */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {getConsultationTypes(doctor.consultationSettings?.types).map((type, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        <type.icon className={type.color} />
                        {type.label}
                      </span>
                    ))}
                  </div>

                  {/* Accepts New Patients Badge */}
                  {doctor.acceptsNewPatients && (
                    <div className="flex items-center gap-1 mt-3 text-green-600 text-sm">
                      <FaUserPlus />
                      <span>Accepting new patients</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="flex-1 text-center px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium text-sm"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/appointments/book?doctor=${doctor._id}`}
                    className="flex-1 text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
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
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === pageNum
                        ? "bg-teal-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
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
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
