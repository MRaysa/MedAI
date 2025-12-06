import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaPlus,
  FaTimes,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaUserMd,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaShare,
  FaNotesMedical,
  FaClipboardList,
  FaUpload,
  FaExpand,
  FaCompress,
  FaSearchPlus,
  FaSearchMinus,
  FaArrowLeft,
  FaArrowRight,
  FaImages,
} from "react-icons/fa";
import { MdLocalHospital, MdMedicalServices } from "react-icons/md";
import { BsFileEarmarkMedical, BsClockHistory } from "react-icons/bs";
import { TbScan, TbRadioactive } from "react-icons/tb";
import { RiBodyScanLine, RiUserHeartLine } from "react-icons/ri";

const Imaging = () => {
  const { apiCall, dbUser, loading: authLoading, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagingStudies, setImagingStudies] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    xray: 0,
    ct: 0,
    mri: 0,
    ultrasound: 0,
    pending: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bodyPartFilter, setBodyPartFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const userRole = dbUser?.role;
  const isDoctor = userRole === "doctor";
  const isPatient = userRole === "patient";

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TbScan className="text-4xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your imaging studies.</p>
          <a
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Imaging types
  const imagingTypes = [
    { id: "xray", name: "X-Ray", icon: TbScan, color: "from-blue-500 to-blue-600" },
    { id: "ct", name: "CT Scan", icon: TbScan, color: "from-purple-500 to-purple-600" },
    { id: "mri", name: "MRI", icon: RiBodyScanLine, color: "from-indigo-500 to-indigo-600" },
    { id: "ultrasound", name: "Ultrasound", icon: TbScan, color: "from-teal-500 to-teal-600" },
    { id: "mammography", name: "Mammography", icon: MdMedicalServices, color: "from-pink-500 to-pink-600" },
    { id: "pet", name: "PET Scan", icon: TbRadioactive, color: "from-orange-500 to-orange-600" },
    { id: "dexa", name: "DEXA Scan", icon: FaUser, color: "from-gray-500 to-gray-600" },
    { id: "fluoroscopy", name: "Fluoroscopy", icon: TbScan, color: "from-cyan-500 to-cyan-600" },
  ];

  // Body parts
  const bodyParts = [
    { id: "head", name: "Head/Brain", icon: FaUser },
    { id: "chest", name: "Chest/Lungs", icon: RiBodyScanLine },
    { id: "heart", name: "Heart", icon: RiUserHeartLine },
    { id: "abdomen", name: "Abdomen", icon: RiBodyScanLine },
    { id: "spine", name: "Spine", icon: RiBodyScanLine },
    { id: "pelvis", name: "Pelvis", icon: RiBodyScanLine },
    { id: "extremities", name: "Extremities", icon: FaUser },
    { id: "kidney", name: "Kidneys", icon: RiBodyScanLine },
    { id: "whole_body", name: "Whole Body", icon: RiBodyScanLine },
  ];

  useEffect(() => {
    fetchImagingStudies();
  }, [typeFilter, statusFilter, bodyPartFilter, dateRange, pagination.page]);

  const fetchImagingStudies = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (typeFilter !== "all") params.append("imagingType", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (bodyPartFilter !== "all") params.append("bodyPart", bodyPartFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await apiCall(`/imaging?${params.toString()}`);

      if (response.success) {
        setImagingStudies(response.data || []);
        setStats(response.stats || { total: 0, xray: 0, ct: 0, mri: 0, ultrasound: 0, pending: 0 });
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching imaging studies:", error);
      setError(error.message || "Failed to load imaging studies");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: {
        label: "Scheduled",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: FaCalendarAlt,
      },
      in_progress: {
        label: "In Progress",
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: FaClock,
      },
      completed: {
        label: "Completed",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: FaCheck,
      },
      pending_review: {
        label: "Pending Review",
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: FaClock,
      },
      cancelled: {
        label: "Cancelled",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: FaTimes,
      },
    };
    return configs[status] || configs.scheduled;
  };

  const getFindingStatus = (finding) => {
    if (!finding) return null;
    const configs = {
      normal: { label: "Normal", bg: "bg-green-100", text: "text-green-700" },
      abnormal: { label: "Abnormal", bg: "bg-amber-100", text: "text-amber-700" },
      critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700" },
    };
    return configs[finding] || configs.normal;
  };

  const getImagingTypeConfig = (type) => {
    return imagingTypes.find((t) => t.id === type) || imagingTypes[0];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredStudies = imagingStudies.filter((study) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      study.studyName?.toLowerCase().includes(search) ||
      study.imagingType?.toLowerCase().includes(search) ||
      study.bodyPart?.toLowerCase().includes(search) ||
      study.radiologist?.name?.toLowerCase().includes(search) ||
      study.patient?.name?.toLowerCase().includes(search) ||
      study.facility?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TbScan className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Imaging</h1>
                <p className="text-gray-600">
                  {isDoctor
                    ? "Order and review patient imaging studies"
                    : "View your imaging studies and reports"}
                </p>
              </div>
            </div>
            {isDoctor && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium shadow-lg"
              >
                <FaPlus />
                Order Imaging
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaImages className="text-lg text-gray-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TbScan className="text-lg text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.xray}</p>
                <p className="text-xs text-gray-500">X-Ray</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <TbScan className="text-lg text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.ct}</p>
                <p className="text-xs text-gray-500">CT Scan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <RiBodyScanLine className="text-lg text-indigo-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.mri}</p>
                <p className="text-xs text-gray-500">MRI</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <TbScan className="text-lg text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.ultrasound}</p>
                <p className="text-xs text-gray-500">Ultrasound</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-lg text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search imaging studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {imagingTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending_review">Pending Review</option>
            </select>

            {/* Body Part Filter */}
            <select
              value={bodyPartFilter}
              onChange={(e) => setBodyPartFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
          >
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <div>
              <p className="text-red-700 font-medium">Error loading imaging studies</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchImagingStudies}
              className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Imaging Studies List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading imaging studies...</p>
            </div>
          </div>
        ) : filteredStudies.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TbScan className="text-4xl text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Imaging Studies Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isDoctor
                ? "No imaging studies match your current filters. Try adjusting your search criteria."
                : "You don't have any imaging studies yet. Your doctor will order imaging as needed."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudies.map((study, index) => {
              const status = getStatusConfig(study.status);
              const typeConfig = getImagingTypeConfig(study.imagingType);
              const findingStatus = getFindingStatus(study.findingStatus);
              const TypeIcon = typeConfig.icon;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={study._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div
                      className={`w-32 h-full min-h-[160px] bg-gradient-to-br ${typeConfig.color} flex items-center justify-center relative`}
                    >
                      {study.thumbnailUrl ? (
                        <img
                          src={study.thumbnailUrl}
                          alt={study.studyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TypeIcon className="text-4xl text-white/80" />
                      )}
                      {study.imageCount > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                          <FaImages />
                          {study.imageCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{study.studyName}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {typeConfig.name} • {study.bodyPart?.replace("_", " ")}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}
                          >
                            <StatusIcon className="text-xs" />
                            {status.label}
                          </span>
                          {findingStatus && study.status === "completed" && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${findingStatus.bg} ${findingStatus.text}`}
                            >
                              {findingStatus.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{formatDate(study.studyDate)}</span>
                        </div>
                        {isDoctor && study.patient && (
                          <div className="flex items-center gap-1.5">
                            <FaUser className="text-gray-400" />
                            <span>{study.patient.name}</span>
                          </div>
                        )}
                        {isPatient && study.orderedBy && (
                          <div className="flex items-center gap-1.5">
                            <FaUserMd className="text-gray-400" />
                            <span>Dr. {study.orderedBy.name}</span>
                          </div>
                        )}
                        {study.facility && (
                          <div className="flex items-center gap-1.5">
                            <MdLocalHospital className="text-gray-400" />
                            <span>{study.facility}</span>
                          </div>
                        )}
                      </div>

                      {/* Impression Preview */}
                      {study.impression && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 p-2 bg-gray-50 rounded-lg">
                          <span className="font-medium">Impression:</span> {study.impression}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudy(study);
                            setShowDetailModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                        >
                          <FaEye />
                          View
                        </button>
                        {study.reportUrl && (
                          <a
                            href={study.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                          >
                            <FaDownload />
                            Report
                          </a>
                        )}
                        {study.images && study.images.length > 0 && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                            <FaImages />
                            Images
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Study Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedStudy && (
            <ImagingDetailModal
              study={selectedStudy}
              userRole={userRole}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedStudy(null);
              }}
              onUpdate={fetchImagingStudies}
              apiCall={apiCall}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              getStatusConfig={getStatusConfig}
              getFindingStatus={getFindingStatus}
              getImagingTypeConfig={getImagingTypeConfig}
            />
          )}
        </AnimatePresence>

        {/* Order Imaging Modal (Doctor Only) */}
        <AnimatePresence>
          {showOrderModal && isDoctor && (
            <OrderImagingModal
              apiCall={apiCall}
              onClose={() => setShowOrderModal(false)}
              onSuccess={() => {
                setShowOrderModal(false);
                fetchImagingStudies();
              }}
              imagingTypes={imagingTypes}
              bodyParts={bodyParts}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Imaging Detail Modal
const ImagingDetailModal = ({
  study,
  userRole,
  onClose,
  onUpdate,
  apiCall,
  formatDate,
  formatDateTime,
  getStatusConfig,
  getFindingStatus,
  getImagingTypeConfig,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addingReport, setAddingReport] = useState(false);
  const [reportData, setReportData] = useState({
    findings: study.findings || "",
    impression: study.impression || "",
    recommendations: study.recommendations || "",
    findingStatus: study.findingStatus || "normal",
  });

  const status = getStatusConfig(study.status);
  const typeConfig = getImagingTypeConfig(study.imagingType);
  const findingStatus = getFindingStatus(study.findingStatus);
  const TypeIcon = typeConfig.icon;
  const isDoctor = userRole === "doctor";

  const handleSaveReport = async () => {
    try {
      setAddingReport(true);
      await apiCall(`/imaging/${study._id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...reportData,
          status: "completed",
        }),
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setAddingReport(false);
    }
  };

  const nextImage = () => {
    if (study.images && currentImageIndex < study.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${
          isFullscreen ? "w-full h-full max-w-none max-h-none" : "max-w-4xl w-full max-h-[90vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${typeConfig.color} p-6 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <TypeIcon className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{study.studyName}</h2>
                <p className="text-white/80 capitalize">
                  {typeConfig.name} • {study.bodyPart?.replace("_", " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/20 rounded-xl transition"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 flex items-center gap-1.5">
              <status.icon className="text-sm" />
              {status.label}
            </span>
            {findingStatus && study.status === "completed" && (
              <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
                {findingStatus.label}
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
              {formatDate(study.studyDate)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {[
            { id: "details", label: "Details", icon: FaFileAlt },
            { id: "images", label: "Images", icon: FaImages, count: study.images?.length || 0 },
            { id: "report", label: "Report", icon: FaNotesMedical },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon />
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Study Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Study Date</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(study.studyDate)}</p>
                </div>
                {study.orderedBy && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Ordered By</p>
                    <p className="font-semibold text-gray-900">Dr. {study.orderedBy.name}</p>
                  </div>
                )}
                {study.patient && userRole === "doctor" && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Patient</p>
                    <p className="font-semibold text-gray-900">{study.patient.name}</p>
                  </div>
                )}
                {study.facility && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Facility</p>
                    <p className="font-semibold text-gray-900">{study.facility}</p>
                  </div>
                )}
                {study.radiologist && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Radiologist</p>
                    <p className="font-semibold text-gray-900">Dr. {study.radiologist.name}</p>
                  </div>
                )}
                {study.accessionNumber && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Accession Number</p>
                    <p className="font-semibold text-gray-900">{study.accessionNumber}</p>
                  </div>
                )}
              </div>

              {/* Clinical Info */}
              {study.clinicalInfo && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">Clinical Information</p>
                  <p className="text-gray-700">{study.clinicalInfo}</p>
                </div>
              )}

              {/* Reason for Study */}
              {study.reason && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">Reason for Study</p>
                  <p className="text-gray-600">{study.reason}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "images" && (
            <div>
              {study.images && study.images.length > 0 ? (
                <div>
                  {/* Main Image Viewer */}
                  <div className="relative bg-black rounded-2xl overflow-hidden mb-4">
                    <img
                      src={study.images[currentImageIndex]?.url}
                      alt={study.images[currentImageIndex]?.label || `Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-contain"
                    />

                    {/* Navigation */}
                    {study.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition"
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          disabled={currentImageIndex === study.images.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition"
                        >
                          <FaArrowRight />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {study.images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {study.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {study.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                            idx === currentImageIndex ? "border-blue-500" : "border-transparent"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.label || `Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaImages className="text-4xl mx-auto mb-3 text-gray-300" />
                  <p>No images available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "report" && (
            <div className="space-y-4">
              {isDoctor && (study.status === "pending_review" || study.status === "in_progress") ? (
                // Editable report for doctor
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Findings
                    </label>
                    <textarea
                      value={reportData.findings}
                      onChange={(e) =>
                        setReportData((prev) => ({ ...prev, findings: e.target.value }))
                      }
                      placeholder="Describe the findings..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impression
                    </label>
                    <textarea
                      value={reportData.impression}
                      onChange={(e) =>
                        setReportData((prev) => ({ ...prev, impression: e.target.value }))
                      }
                      placeholder="Summarize the impression..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommendations
                    </label>
                    <textarea
                      value={reportData.recommendations}
                      onChange={(e) =>
                        setReportData((prev) => ({ ...prev, recommendations: e.target.value }))
                      }
                      placeholder="Any recommendations..."
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Finding Status
                    </label>
                    <div className="flex gap-3">
                      {["normal", "abnormal", "critical"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setReportData((prev) => ({ ...prev, findingStatus: status }))
                          }
                          className={`flex-1 px-4 py-2.5 rounded-xl font-medium capitalize transition ${
                            reportData.findingStatus === status
                              ? status === "critical"
                                ? "bg-red-500 text-white"
                                : status === "abnormal"
                                ? "bg-amber-500 text-white"
                                : "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveReport}
                    disabled={addingReport}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50"
                  >
                    {addingReport ? "Saving..." : "Save Report & Complete"}
                  </button>
                </>
              ) : (
                // Read-only report view
                <>
                  {study.findings && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-medium text-gray-700 mb-2">Findings</p>
                      <p className="text-gray-600 whitespace-pre-wrap">{study.findings}</p>
                    </div>
                  )}

                  {study.impression && (
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        study.findingStatus === "critical"
                          ? "bg-red-50 border-red-200"
                          : study.findingStatus === "abnormal"
                          ? "bg-amber-50 border-amber-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700 mb-2">Impression</p>
                      <p className="text-gray-700">{study.impression}</p>
                    </div>
                  )}

                  {study.recommendations && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm font-medium text-blue-700 mb-2">Recommendations</p>
                      <p className="text-gray-700">{study.recommendations}</p>
                    </div>
                  )}

                  {!study.findings && !study.impression && (
                    <div className="text-center py-8 text-gray-500">
                      <FaNotesMedical className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>Report not yet available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
          {study.reportUrl && (
            <a
              href={study.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium"
            >
              <FaDownload />
              Download Report
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Order Imaging Modal (Doctor Only)
const OrderImagingModal = ({ apiCall, onClose, onSuccess, imagingTypes, bodyParts }) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    imagingType: "",
    bodyPart: "",
    studyName: "",
    priority: "routine",
    reason: "",
    clinicalInfo: "",
    facility: "",
    scheduledDate: "",
  });

  // Common study names based on type
  const studyNames = {
    xray: ["Chest X-Ray", "Abdominal X-Ray", "Spine X-Ray", "Extremity X-Ray", "Skull X-Ray"],
    ct: ["CT Head", "CT Chest", "CT Abdomen/Pelvis", "CT Spine", "CT Angiography"],
    mri: ["MRI Brain", "MRI Spine", "MRI Knee", "MRI Shoulder", "MRI Abdomen"],
    ultrasound: ["Abdominal Ultrasound", "Pelvic Ultrasound", "Thyroid Ultrasound", "Echocardiogram", "Carotid Doppler"],
    mammography: ["Screening Mammogram", "Diagnostic Mammogram"],
    pet: ["PET/CT Whole Body", "PET/CT Brain"],
    dexa: ["DEXA Bone Density Scan"],
    fluoroscopy: ["Upper GI Series", "Barium Swallow", "Barium Enema"],
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await apiCall("/doctors/me/patients");
      if (response.success) {
        setPatients(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.imagingType || !formData.studyName) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("/imaging", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error ordering imaging:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TbScan className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Order Imaging Study</h2>
                <p className="text-white/80 text-sm">Request imaging for a patient</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            {loadingPatients ? (
              <div className="p-3 bg-gray-50 rounded-xl text-gray-500 text-sm">
                Loading patients...
              </div>
            ) : (
              <select
                value={formData.patientId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, patientId: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Imaging Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imaging Type *
              </label>
              <select
                value={formData.imagingType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    imagingType: e.target.value,
                    studyName: "",
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select type</option>
                {imagingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Part */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Part
              </label>
              <select
                value={formData.bodyPart}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bodyPart: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select body part</option>
                {bodyParts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Study Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Name *
            </label>
            {formData.imagingType && studyNames[formData.imagingType] ? (
              <select
                value={formData.studyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, studyName: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select study</option>
                {studyNames[formData.imagingType].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value="other">Other (specify in notes)</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.studyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, studyName: e.target.value }))
                }
                placeholder="Enter study name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {["routine", "urgent", "stat"].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium capitalize transition ${
                    formData.priority === priority
                      ? priority === "stat"
                        ? "bg-red-500 text-white"
                        : priority === "urgent"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Facility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Facility
            </label>
            <input
              type="text"
              value={formData.facility}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, facility: e.target.value }))
              }
              placeholder="e.g., City Imaging Center"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Reason for Study */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Study
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Why is this imaging study needed?"
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Clinical Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Information
            </label>
            <textarea
              value={formData.clinicalInfo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, clinicalInfo: e.target.value }))
              }
              placeholder="Relevant clinical history, symptoms, etc."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.patientId || !formData.imagingType || !formData.studyName}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ordering...
              </>
            ) : (
              <>
                <TbScan />
                Order Study
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Imaging;
