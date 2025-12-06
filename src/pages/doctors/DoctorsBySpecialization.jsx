import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
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
} from "react-icons/fa";
import { MdVerified, MdLocalHospital } from "react-icons/md";
import { BsStarFill, BsGridFill, BsListUl } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";

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

  const specializations = [
    { name: "General Practice", icon: "🩺", color: "from-blue-500 to-blue-600" },
    { name: "Internal Medicine", icon: "💊", color: "from-purple-500 to-purple-600" },
    { name: "Family Medicine", icon: "👨‍👩‍👧‍👦", color: "from-green-500 to-green-600" },
    { name: "Pediatrics", icon: "👶", color: "from-pink-500 to-pink-600" },
    { name: "Cardiology", icon: "❤️", color: "from-red-500 to-red-600" },
    { name: "Dermatology", icon: "🧴", color: "from-amber-500 to-amber-600" },
    { name: "Endocrinology", icon: "🧬", color: "from-teal-500 to-teal-600" },
    { name: "Gastroenterology", icon: "🫃", color: "from-orange-500 to-orange-600" },
    { name: "Neurology", icon: "🧠", color: "from-indigo-500 to-indigo-600" },
    { name: "Oncology", icon: "🎗️", color: "from-violet-500 to-violet-600" },
    { name: "Ophthalmology", icon: "👁️", color: "from-cyan-500 to-cyan-600" },
    { name: "Orthopedics", icon: "🦴", color: "from-slate-500 to-slate-600" },
    { name: "Psychiatry", icon: "🧘", color: "from-fuchsia-500 to-fuchsia-600" },
    { name: "Pulmonology", icon: "🫁", color: "from-sky-500 to-sky-600" },
    { name: "Radiology", icon: "📷", color: "from-gray-500 to-gray-600" },
    { name: "Rheumatology", icon: "🦵", color: "from-rose-500 to-rose-600" },
    { name: "Surgery", icon: "🔪", color: "from-emerald-500 to-emerald-600" },
    { name: "Urology", icon: "🩻", color: "from-lime-500 to-lime-600" },
    { name: "Gynecology", icon: "👩", color: "from-pink-400 to-pink-500" },
    { name: "Emergency Medicine", icon: "🚑", color: "from-red-600 to-red-700" },
    { name: "Nephrology", icon: "🫘", color: "from-amber-600 to-amber-700" },
    { name: "Allergy and Immunology", icon: "🤧", color: "from-yellow-500 to-yellow-600" },
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
    };
  };

  // Show specialization selection
  if (!selectedSpecialization) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaUserMd className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Find Doctors by Specialization</h1>
                <p className="text-gray-600">Browse our medical specialists by their field of expertise</p>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Specialization Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSpecializations.map((spec, index) => (
              <motion.button
                key={spec.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSpecializationSelect(spec.name)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all group text-left"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${spec.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {spec.icon}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">
                  {spec.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">View specialists</p>
              </motion.button>
            ))}
          </div>

          {filteredSpecializations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No specializations found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show doctors for selected specialization
  const specData = getSpecializationData(selectedSpecialization);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition"
          >
            <FaArrowLeft />
            <span>Back to all specializations</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${specData.color} flex items-center justify-center text-3xl`}
              >
                {specData.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedSpecialization}</h1>
                <p className="text-gray-600">
                  {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"} available
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid" ? "bg-teal-100 text-teal-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <BsGridFill />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list" ? "bg-teal-100 text-teal-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <BsListUl />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Doctors List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading doctors...</p>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserMd className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We currently don't have any doctors listed under {selectedSpecialization}.
              Please check back later or explore other specializations.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
            >
              <FaArrowLeft />
              Browse Other Specializations
            </button>
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                index={index}
                viewMode={viewMode}
                specData={specData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor, index, viewMode, specData }) => {
  const formatFee = (fee) => {
    if (!fee) return "N/A";
    return `$${fee}`;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition"
      >
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.user?.profileImage ? (
              <img
                src={doctor.user.profileImage}
                alt={`Dr. ${doctor.user?.firstName}`}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${specData.color} flex items-center justify-center text-white text-2xl font-bold`}
              >
                {doctor.user?.firstName?.charAt(0) || "D"}
              </div>
            )}
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <MdVerified className="text-white text-sm" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                </h3>
                <p className="text-teal-600 font-medium">{doctor.specialization}</p>
                {doctor.hospital && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <FaHospital className="text-gray-400" />
                    {doctor.hospital}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                <BsStarFill className="text-amber-500" />
                <span className="font-semibold text-amber-700">
                  {doctor.stats?.averageRating?.toFixed(1) || "New"}
                </span>
              </div>
            </div>

            {/* Details Row */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {doctor.experience && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <FaGraduationCap className="text-gray-400" />
                  {doctor.experience} years exp.
                </span>
              )}
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <FaMoneyBillWave className="text-gray-400" />
                {formatFee(doctor.fees?.inPersonConsultation)}
              </span>
              <div className="flex items-center gap-2">
                {doctor.consultationSettings?.videoConsultation && (
                  <span className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
                    <FaVideo className="text-sm" />
                  </span>
                )}
                {doctor.consultationSettings?.phoneConsultation && (
                  <span className="p-1.5 bg-violet-50 text-violet-500 rounded-lg">
                    <FaPhone className="text-sm" />
                  </span>
                )}
                {doctor.consultationSettings?.chatConsultation && (
                  <span className="p-1.5 bg-pink-50 text-pink-500 rounded-lg">
                    <FaComments className="text-sm" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link
              to={`/doctors/${doctor._id}`}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium text-sm"
            >
              View Profile
            </Link>
            <Link
              to={`/appointments/book?doctor=${doctor._id}`}
              className="px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium text-sm flex items-center gap-1"
            >
              <FaCalendarCheck />
              Book
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
    >
      {/* Header */}
      <div className={`h-24 bg-gradient-to-br ${specData.color} relative`}>
        {doctor.isVerified && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <MdVerified className="text-white text-sm" />
            <span className="text-white text-xs font-medium">Verified</span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-12">
        <div className="relative inline-block">
          {doctor.user?.profileImage ? (
            <img
              src={doctor.user.profileImage}
              alt={`Dr. ${doctor.user?.firstName}`}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
              {doctor.user?.firstName?.charAt(0) || "D"}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <h3 className="font-bold text-gray-900 text-lg">
          Dr. {doctor.user?.firstName} {doctor.user?.lastName}
        </h3>
        <p className="text-teal-600 font-medium text-sm">{doctor.specialization}</p>

        {doctor.hospital && (
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
            <FaHospital className="text-gray-400" />
            {doctor.hospital}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <BsStarFill className="text-amber-500" />
            <span className="font-semibold text-gray-900">
              {doctor.stats?.averageRating?.toFixed(1) || "New"}
            </span>
          </div>
          {doctor.experience && (
            <span className="text-sm text-gray-500">{doctor.experience} yrs exp.</span>
          )}
        </div>

        {/* Fee */}
        <div className="flex items-center gap-2 mt-3 text-gray-600">
          <FaMoneyBillWave className="text-green-500" />
          <span className="font-medium">{formatFee(doctor.fees?.inPersonConsultation)}</span>
          <span className="text-sm text-gray-400">per visit</span>
        </div>

        {/* Consultation Types */}
        <div className="flex items-center gap-2 mt-4">
          {doctor.consultationSettings?.inPersonConsultation !== false && (
            <span className="p-2 bg-teal-50 text-teal-500 rounded-lg" title="In-Person">
              <MdLocalHospital />
            </span>
          )}
          {doctor.consultationSettings?.videoConsultation && (
            <span className="p-2 bg-blue-50 text-blue-500 rounded-lg" title="Video Call">
              <FaVideo />
            </span>
          )}
          {doctor.consultationSettings?.phoneConsultation && (
            <span className="p-2 bg-violet-50 text-violet-500 rounded-lg" title="Phone Call">
              <FaPhone />
            </span>
          )}
          {doctor.consultationSettings?.chatConsultation && (
            <span className="p-2 bg-pink-50 text-pink-500 rounded-lg" title="Chat">
              <FaComments />
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <Link
            to={`/doctors/${doctor._id}`}
            className="flex-1 py-2.5 text-center border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
          >
            View Profile
          </Link>
          <Link
            to={`/appointments/book?doctor=${doctor._id}`}
            className="flex-1 py-2.5 text-center bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium text-sm flex items-center justify-center gap-1"
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
