import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaFlask,
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
  FaVial,
  FaHeartbeat,
  FaTint,
  FaThermometerHalf,
  FaUserMd,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaShare,
  FaNotesMedical,
  FaClipboardList,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaUpload,
  FaStethoscope,
} from "react-icons/fa";
import { MdScience, MdBiotech, MdLocalHospital, MdOutlineAnalytics } from "react-icons/md";
import { BsDropletFill, BsGraphUp, BsClockHistory, BsFileEarmarkMedical } from "react-icons/bs";
import { HiBeaker, HiDocumentReport } from "react-icons/hi";
import { GiMicroscope, GiDna1 } from "react-icons/gi";
import { TbScan } from "react-icons/tb";

const DiagnosticResults = () => {
  const { apiCall, dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    abnormal: 0,
    critical: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const userRole = dbUser?.role;
  const isDoctor = userRole === "doctor";
  const isPatient = userRole === "patient";

  // Result categories
  const resultCategories = [
    { id: "blood", name: "Blood Work", icon: FaTint, color: "red" },
    { id: "urine", name: "Urinalysis", icon: BsDropletFill, color: "yellow" },
    { id: "imaging", name: "Imaging/Radiology", icon: MdBiotech, color: "blue" },
    { id: "cardiac", name: "Cardiac Tests", icon: FaHeartbeat, color: "pink" },
    { id: "pathology", name: "Pathology", icon: GiMicroscope, color: "purple" },
    { id: "genetic", name: "Genetic Tests", icon: GiDna1, color: "indigo" },
    { id: "microbiology", name: "Microbiology", icon: MdScience, color: "green" },
    { id: "other", name: "Other Results", icon: FaFileAlt, color: "gray" },
  ];

  useEffect(() => {
    fetchResults();
  }, [resultFilter, categoryFilter, dateRange, pagination.page, activeTab]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (resultFilter !== "all") params.append("resultStatus", resultFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      if (activeTab !== "all") params.append("timeframe", activeTab);

      const response = await apiCall(`/diagnostic-results?${params.toString()}`);

      if (response.success) {
        setResults(response.data || []);
        setStats(response.stats || { total: 0, normal: 0, abnormal: 0, critical: 0 });
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching diagnostic results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResultStatusConfig = (status) => {
    const configs = {
      normal: {
        label: "Normal",
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: FaCheck,
        gradient: "from-green-500 to-emerald-600",
      },
      abnormal: {
        label: "Abnormal",
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: FaExclamationTriangle,
        gradient: "from-amber-500 to-orange-600",
      },
      critical: {
        label: "Critical",
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: FaExclamationTriangle,
        gradient: "from-red-500 to-red-600",
      },
      pending: {
        label: "Pending Review",
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: FaClock,
        gradient: "from-blue-500 to-indigo-600",
      },
    };
    return configs[status] || configs.pending;
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <FaArrowUp className="text-red-500" />;
    if (trend === "down") return <FaArrowDown className="text-green-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  const getCategoryIcon = (category) => {
    const cat = resultCategories.find((c) => c.id === category);
    return cat ? cat.icon : FaFileAlt;
  };

  const getCategoryColor = (category) => {
    const colors = {
      blood: "from-red-500 to-red-600",
      urine: "from-yellow-500 to-yellow-600",
      imaging: "from-blue-500 to-blue-600",
      cardiac: "from-pink-500 to-pink-600",
      pathology: "from-purple-500 to-purple-600",
      genetic: "from-indigo-500 to-indigo-600",
      microbiology: "from-green-500 to-green-600",
      other: "from-gray-500 to-gray-600",
    };
    return colors[category] || colors.other;
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

  const filteredResults = results.filter((result) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      result.testName?.toLowerCase().includes(search) ||
      result.category?.toLowerCase().includes(search) ||
      result.orderedBy?.name?.toLowerCase().includes(search) ||
      result.patient?.name?.toLowerCase().includes(search) ||
      result.lab?.toLowerCase().includes(search)
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
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HiDocumentReport className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Diagnostic Results</h1>
                <p className="text-gray-600">
                  {isDoctor
                    ? "Review and analyze patient diagnostic results"
                    : "View your diagnostic test results and reports"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick Navigation Links */}
              <Link
                to="/diagnostics/lab-tests"
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition font-medium text-sm"
              >
                <FaFlask />
                Lab Tests
              </Link>
              <Link
                to="/diagnostics/imaging"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
              >
                <TbScan />
                Imaging
              </Link>
              {isDoctor && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-medium shadow-lg"
                >
                  <FaUpload />
                  Upload Results
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BsFileEarmarkMedical className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Results</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheck className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.normal}</p>
                <p className="text-sm text-gray-500">Normal</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.abnormal}</p>
                <p className="text-sm text-gray-500">Abnormal</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-xl text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
                <p className="text-sm text-gray-500">Critical</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6"
        >
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "all", label: "All Results", icon: BsFileEarmarkMedical },
              { id: "recent", label: "Recent (7 days)", icon: BsClockHistory },
              { id: "abnormal", label: "Needs Attention", icon: FaExclamationTriangle },
              { id: "pending", label: "Pending Review", icon: FaClock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
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
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Result Status Filter */}
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
              <option value="critical">Critical</option>
              <option value="pending">Pending Review</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {resultCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Results List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading diagnostic results...</p>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiDocumentReport className="text-4xl text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isDoctor
                ? "No diagnostic results match your current filters. Try adjusting your search criteria."
                : "You don't have any diagnostic results yet. Results will appear here after your tests are completed."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              const statusConfig = getResultStatusConfig(result.resultStatus);
              const CategoryIcon = getCategoryIcon(result.category);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={result._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-md transition ${statusConfig.border}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(
                          result.category
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <CategoryIcon className="text-2xl text-white" />
                      </div>

                      {/* Result Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {result.testName}
                            </h3>
                            <p className="text-gray-500 text-sm capitalize">
                              {result.category?.replace("_", " ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              <StatusIcon className="text-xs" />
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(result.resultDate)}
                          </span>
                          {isDoctor && result.patient && (
                            <span className="flex items-center gap-1.5">
                              <FaUser className="text-gray-400" />
                              {result.patient.name}
                            </span>
                          )}
                          {isPatient && result.orderedBy && (
                            <span className="flex items-center gap-1.5">
                              <FaUserMd className="text-gray-400" />
                              Dr. {result.orderedBy.name}
                            </span>
                          )}
                          {result.lab && (
                            <span className="flex items-center gap-1.5">
                              <MdLocalHospital className="text-gray-400" />
                              {result.lab}
                            </span>
                          )}
                        </div>

                        {/* Key Findings Preview */}
                        {result.keyFindings && result.keyFindings.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-medium text-gray-500 mb-2">Key Findings</p>
                            <div className="flex flex-wrap gap-2">
                              {result.keyFindings.slice(0, 3).map((finding, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                    finding.status === "abnormal"
                                      ? "bg-amber-100 text-amber-700"
                                      : finding.status === "critical"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {finding.name}: {finding.value} {finding.unit}
                                  {finding.trend && getTrendIcon(finding.trend)}
                                </span>
                              ))}
                              {result.keyFindings.length > 3 && (
                                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600">
                                  +{result.keyFindings.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Doctor's Summary (if available) */}
                        {result.doctorSummary && (
                          <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1">
                              <FaStethoscope />
                              Doctor's Summary
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {result.doctorSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition font-medium text-sm"
                      >
                        <FaEye />
                        View Details
                      </button>
                      {result.reportUrl && (
                        <>
                          <a
                            href={result.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                          >
                            <FaDownload />
                            Download
                          </a>
                          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm">
                            <FaPrint />
                            Print
                          </button>
                        </>
                      )}
                      {isDoctor && result.resultStatus === "pending" && (
                        <button className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition font-medium text-sm">
                          <FaNotesMedical />
                          Add Review
                        </button>
                      )}
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

        {/* Result Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedResult && (
            <ResultDetailModal
              result={selectedResult}
              userRole={userRole}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedResult(null);
              }}
              onUpdate={fetchResults}
              apiCall={apiCall}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              getResultStatusConfig={getResultStatusConfig}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
              getTrendIcon={getTrendIcon}
            />
          )}
        </AnimatePresence>

        {/* Upload Results Modal (Doctor Only) */}
        <AnimatePresence>
          {showUploadModal && isDoctor && (
            <UploadResultsModal
              apiCall={apiCall}
              onClose={() => setShowUploadModal(false)}
              onSuccess={() => {
                setShowUploadModal(false);
                fetchResults();
              }}
              resultCategories={resultCategories}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Result Detail Modal
const ResultDetailModal = ({
  result,
  userRole,
  onClose,
  onUpdate,
  apiCall,
  formatDate,
  formatDateTime,
  getResultStatusConfig,
  getCategoryIcon,
  getCategoryColor,
  getTrendIcon,
}) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [doctorNotes, setDoctorNotes] = useState(result.doctorSummary || "");
  const [saving, setSaving] = useState(false);

  const statusConfig = getResultStatusConfig(result.resultStatus);
  const CategoryIcon = getCategoryIcon(result.category);
  const isDoctor = userRole === "doctor";

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await apiCall(`/diagnostic-results/${result._id}`, {
        method: "PUT",
        body: JSON.stringify({
          doctorSummary: doctorNotes,
          resultStatus: result.resultStatus === "pending" ? "normal" : result.resultStatus,
        }),
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
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
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-br ${getCategoryColor(result.category)} p-6 text-white`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CategoryIcon className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{result.testName}</h2>
                <p className="text-white/80 capitalize">
                  {result.category?.replace("_", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 flex items-center gap-1.5`}
            >
              <statusConfig.icon className="text-sm" />
              {statusConfig.label}
            </span>
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
              {formatDate(result.resultDate)}
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {[
            { id: "overview", label: "Overview", icon: MdOutlineAnalytics },
            { id: "findings", label: "Findings", icon: BsGraphUp },
            { id: "report", label: "Full Report", icon: HiDocumentReport },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 -mb-px ${
                activeSection === section.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <section.icon />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Test Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Test Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(result.resultDate)}
                  </p>
                </div>
                {result.orderedBy && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Ordered By</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {result.orderedBy.name}
                    </p>
                  </div>
                )}
                {result.patient && userRole === "doctor" && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Patient</p>
                    <p className="font-semibold text-gray-900">{result.patient.name}</p>
                  </div>
                )}
                {result.lab && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Laboratory</p>
                    <p className="font-semibold text-gray-900">{result.lab}</p>
                  </div>
                )}
              </div>

              {/* Doctor's Summary */}
              {isDoctor ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <label className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-2">
                    <FaStethoscope />
                    Doctor's Summary / Notes
                  </label>
                  <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Add your clinical notes and interpretation..."
                    rows={4}
                    className="w-full mt-2 p-3 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium text-sm disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              ) : result.doctorSummary ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-2">
                    <FaStethoscope />
                    Doctor's Summary
                  </p>
                  <p className="text-gray-700">{result.doctorSummary}</p>
                </div>
              ) : null}

              {/* Interpretation */}
              {result.interpretation && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">Interpretation</p>
                  <p className="text-gray-700">{result.interpretation}</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "findings" && (
            <div className="space-y-4">
              {result.findings && result.findings.length > 0 ? (
                result.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      finding.status === "critical"
                        ? "border-red-200 bg-red-50"
                        : finding.status === "abnormal"
                        ? "border-amber-200 bg-amber-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{finding.name}</span>
                      <div className="flex items-center gap-2">
                        {finding.trend && getTrendIcon(finding.trend)}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            finding.status === "critical"
                              ? "bg-red-200 text-red-800"
                              : finding.status === "abnormal"
                              ? "bg-amber-200 text-amber-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {finding.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {finding.value} {finding.unit}
                      </span>
                      {finding.referenceRange && (
                        <span className="text-sm text-gray-500">
                          Ref: {finding.referenceRange}
                        </span>
                      )}
                    </div>
                    {finding.notes && (
                      <p className="mt-2 text-sm text-gray-600">{finding.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BsGraphUp className="text-4xl mx-auto mb-3 text-gray-300" />
                  <p>No detailed findings available</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "report" && (
            <div className="space-y-4">
              {result.reportUrl ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaFilePdf className="text-4xl text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full Report Available</h3>
                  <p className="text-gray-500 mb-4">
                    Download or print the complete diagnostic report
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={result.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium"
                    >
                      <FaDownload />
                      Download PDF
                    </a>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium">
                      <FaPrint />
                      Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium">
                      <FaShare />
                      Share
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaFileAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                  <p>No report file available</p>
                </div>
              )}

              {/* Images */}
              {result.images && result.images.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Attached Images</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {result.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video bg-gray-100 rounded-xl overflow-hidden hover:opacity-80 transition"
                      >
                        <img
                          src={img.url}
                          alt={img.label || `Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
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

// Upload Results Modal (Doctor Only)
const UploadResultsModal = ({ apiCall, onClose, onSuccess, resultCategories }) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    testName: "",
    category: "",
    resultStatus: "normal",
    resultDate: new Date().toISOString().split("T")[0],
    lab: "",
    interpretation: "",
    doctorSummary: "",
    findings: [],
  });
  const [newFinding, setNewFinding] = useState({
    name: "",
    value: "",
    unit: "",
    referenceRange: "",
    status: "normal",
  });

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

  const addFinding = () => {
    if (newFinding.name && newFinding.value) {
      setFormData((prev) => ({
        ...prev,
        findings: [...prev.findings, { ...newFinding }],
      }));
      setNewFinding({
        name: "",
        value: "",
        unit: "",
        referenceRange: "",
        status: "normal",
      });
    }
  };

  const removeFinding = (index) => {
    setFormData((prev) => ({
      ...prev,
      findings: prev.findings.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.testName || !formData.category) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("/diagnostic-results", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error uploading results:", error);
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
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUpload className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Upload Diagnostic Results</h2>
                <p className="text-white/80 text-sm">Add new results for a patient</p>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            {/* Test Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Name *
              </label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, testName: e.target.value }))
                }
                placeholder="e.g., Complete Blood Count"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {resultCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Result Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result Date *
              </label>
              <input
                type="date"
                value={formData.resultDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resultDate: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Result Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Result
              </label>
              <select
                value={formData.resultStatus}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resultStatus: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
                <option value="critical">Critical</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Lab */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Laboratory
            </label>
            <input
              type="text"
              value={formData.lab}
              onChange={(e) => setFormData((prev) => ({ ...prev, lab: e.target.value }))}
              placeholder="e.g., City Diagnostics Lab"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Findings Section */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Test Findings
            </label>

            {/* Added Findings */}
            {formData.findings.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      finding.status === "critical"
                        ? "bg-red-50 border border-red-200"
                        : finding.status === "abnormal"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gray-900">{finding.name}</span>
                      <span className="text-gray-600 ml-2">
                        {finding.value} {finding.unit}
                      </span>
                      {finding.referenceRange && (
                        <span className="text-gray-400 text-sm ml-2">
                          (Ref: {finding.referenceRange})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFinding(idx)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Finding */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newFinding.name}
                  onChange={(e) =>
                    setNewFinding((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Parameter name"
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFinding.value}
                    onChange={(e) =>
                      setNewFinding((prev) => ({ ...prev, value: e.target.value }))
                    }
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={newFinding.unit}
                    onChange={(e) =>
                      setNewFinding((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    placeholder="Unit"
                    className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newFinding.referenceRange}
                  onChange={(e) =>
                    setNewFinding((prev) => ({ ...prev, referenceRange: e.target.value }))
                  }
                  placeholder="Reference range (e.g., 4.0-11.0)"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                />
                <select
                  value={newFinding.status}
                  onChange={(e) =>
                    setNewFinding((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="critical">Critical</option>
                </select>
                <button
                  type="button"
                  onClick={addFinding}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Doctor's Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor's Summary
            </label>
            <textarea
              value={formData.doctorSummary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, doctorSummary: e.target.value }))
              }
              placeholder="Add your clinical interpretation and recommendations..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
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
            disabled={loading || !formData.patientId || !formData.testName || !formData.category}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload Results
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DiagnosticResults;
