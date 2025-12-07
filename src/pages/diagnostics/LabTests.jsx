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
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { MdScience, MdBiotech, MdLocalHospital } from "react-icons/md";
import { BsDropletFill, BsGraphUp, BsClockHistory } from "react-icons/bs";
import { HiBeaker } from "react-icons/hi";
import { TbScan } from "react-icons/tb";

const LabTests = () => {
  const { apiCall, dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [labTests, setLabTests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    abnormal: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const userRole = dbUser?.role;
  const isDoctor = userRole === "doctor";
  const isPatient = userRole === "patient";

  // Test categories (Note: Imaging studies like X-Ray, CT, MRI are managed in Medical Imaging page)
  const testCategories = [
    { id: "blood", name: "Blood Tests", icon: FaTint, color: "red" },
    { id: "urine", name: "Urine Tests", icon: BsDropletFill, color: "yellow" },
    { id: "cardiac", name: "Cardiac Tests", icon: FaHeartbeat, color: "pink" },
    { id: "metabolic", name: "Metabolic Panel", icon: MdScience, color: "green" },
    { id: "hormone", name: "Hormone Tests", icon: FaThermometerHalf, color: "purple" },
    { id: "pathology", name: "Pathology", icon: HiBeaker, color: "orange" },
    { id: "microbiology", name: "Microbiology", icon: MdBiotech, color: "blue" },
    { id: "other", name: "Other Tests", icon: FaFlask, color: "gray" },
  ];

  useEffect(() => {
    fetchLabTests();
  }, [statusFilter, categoryFilter, dateRange, pagination.page]);

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await apiCall(`/lab-tests?${params.toString()}`);

      if (response.success) {
        setLabTests(response.data || []);
        setStats(response.stats || { total: 0, pending: 0, completed: 0, abnormal: 0 });
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching lab tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: FaClock,
      },
      in_progress: {
        label: "In Progress",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: FaFlask,
      },
      completed: {
        label: "Completed",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: FaCheck,
      },
      cancelled: {
        label: "Cancelled",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: FaTimes,
      },
    };
    return configs[status] || configs.pending;
  };

  const getResultStatus = (result) => {
    if (!result) return null;
    if (result.isAbnormal) {
      return {
        label: "Abnormal",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: FaExclamationTriangle,
      };
    }
    return {
      label: "Normal",
      bg: "bg-green-100",
      text: "text-green-700",
      icon: FaCheck,
    };
  };

  const getCategoryIcon = (category) => {
    const cat = testCategories.find((c) => c.id === category);
    return cat ? cat.icon : FaFlask;
  };

  const getCategoryColor = (category) => {
    const colors = {
      blood: "from-red-500 to-red-600",
      urine: "from-yellow-500 to-yellow-600",
      cardiac: "from-pink-500 to-pink-600",
      metabolic: "from-green-500 to-green-600",
      hormone: "from-purple-500 to-purple-600",
      pathology: "from-orange-500 to-orange-600",
      microbiology: "from-blue-500 to-blue-600",
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

  const filteredTests = labTests.filter((test) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      test.testName?.toLowerCase().includes(search) ||
      test.category?.toLowerCase().includes(search) ||
      test.orderedBy?.name?.toLowerCase().includes(search) ||
      test.patient?.name?.toLowerCase().includes(search)
    );
  });

  // Print Lab Test Report
  const handlePrintTest = (test) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the report");
      return;
    }

    const resultStatus = test.result?.isAbnormal ? "Abnormal" : "Normal";
    const resultColor = test.result?.isAbnormal ? "#dc2626" : "#16a34a";

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lab Test Report - ${test.testName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #1f2937;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { color: #7c3aed; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #6b7280; font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #7c3aed;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { background: #f9fafb; padding: 12px; border-radius: 8px; }
          .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
          .info-value { font-size: 14px; font-weight: 500; color: #1f2937; }
          .result-box {
            background: ${test.result?.isAbnormal ? '#fef2f2' : '#f0fdf4'};
            border: 2px solid ${resultColor};
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .result-value { font-size: 32px; font-weight: 700; color: ${resultColor}; }
          .result-unit { font-size: 18px; color: #6b7280; }
          .result-status {
            display: inline-block;
            padding: 4px 12px;
            background: ${resultColor};
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
          }
          .reference { font-size: 13px; color: #6b7280; margin-top: 10px; }
          .notes {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lab Test Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</p>
        </div>

        <div class="section">
          <div class="section-title">Test Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Test Name</div>
              <div class="info-value">${test.testName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Category</div>
              <div class="info-value" style="text-transform: capitalize;">${test.category?.replace('_', ' ')} Test</div>
            </div>
            <div class="info-item">
              <div class="info-label">Order Date</div>
              <div class="info-value">${formatDate(test.orderedDate)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Completed Date</div>
              <div class="info-value">${test.completedDate ? formatDate(test.completedDate) : 'Pending'}</div>
            </div>
            ${test.lab ? `
            <div class="info-item">
              <div class="info-label">Laboratory</div>
              <div class="info-value">${test.lab}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value" style="text-transform: capitalize;">${test.status?.replace('_', ' ')}</div>
            </div>
          </div>
        </div>

        ${test.patient ? `
        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Patient Name</div>
              <div class="info-value">${test.patient.name}</div>
            </div>
            ${test.patient.email ? `
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${test.patient.email}</div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        ${test.orderedBy ? `
        <div class="section">
          <div class="section-title">Ordering Physician</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Doctor Name</div>
              <div class="info-value">Dr. ${test.orderedBy.name}</div>
            </div>
            ${test.orderedBy.specialization ? `
            <div class="info-item">
              <div class="info-label">Specialization</div>
              <div class="info-value">${test.orderedBy.specialization}</div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        ${test.result ? `
        <div class="section">
          <div class="section-title">Test Results</div>
          <div class="result-box">
            <div class="result-value">${test.result.value || 'N/A'}</div>
            <div class="result-unit">${test.result.unit || ''}</div>
            <div class="result-status">${resultStatus}</div>
            ${test.result.referenceRange ? `<div class="reference">Reference Range: ${test.result.referenceRange}</div>` : ''}
          </div>
          ${test.result.interpretation ? `
          <div class="notes" style="margin-top: 15px;">
            <strong>Interpretation:</strong><br/>
            ${test.result.interpretation}
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${test.doctorNotes ? `
        <div class="section">
          <div class="section-title">Doctor's Notes</div>
          <div class="notes">${test.doctorNotes}</div>
        </div>
        ` : ''}

        ${test.notes ? `
        <div class="section">
          <div class="section-title">Additional Notes</div>
          <div class="notes">${test.notes}</div>
        </div>
        ` : ''}

        <div class="footer">
          <p>This is a computer-generated report from MedAI Healthcare System</p>
          <p>For any queries, please contact your healthcare provider</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaFlask className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lab Tests</h1>
                <p className="text-gray-600">
                  {isDoctor
                    ? "Manage and review patient lab tests"
                    : "View your lab test results and history"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick Navigation Links */}
              <Link
                to="/diagnostics/imaging"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
              >
                <TbScan />
                Imaging
              </Link>
              <Link
                to="/diagnostics/results"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition font-medium text-sm"
              >
                <FaNotesMedical />
                Results
              </Link>
              {isDoctor && (
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium shadow-lg"
                >
                  <FaPlus />
                  Order New Test
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-xl text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Tests</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheck className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-xl text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.abnormal}</p>
                <p className="text-sm text-gray-500">Abnormal Results</p>
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
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {testCategories.map((cat) => (
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
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Lab Tests List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading lab tests...</p>
            </div>
          </div>
        ) : filteredTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFlask className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Lab Tests Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isDoctor
                ? "No lab tests match your current filters. Try adjusting your search criteria."
                : "You don't have any lab tests yet. Your doctor will order tests as needed."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test, index) => {
              const status = getStatusConfig(test.status);
              const resultStatus = getResultStatus(test.result);
              const CategoryIcon = getCategoryIcon(test.category);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(
                          test.category
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <CategoryIcon className="text-2xl text-white" />
                      </div>

                      {/* Test Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {test.testName}
                            </h3>
                            <p className="text-gray-500 text-sm capitalize">
                              {test.category?.replace("_", " ")} Test
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}
                            >
                              <StatusIcon className="text-xs" />
                              {status.label}
                            </span>
                            {resultStatus && (
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${resultStatus.bg} ${resultStatus.text}`}
                              >
                                <resultStatus.icon className="text-xs" />
                                {resultStatus.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-gray-400" />
                            Ordered: {formatDate(test.orderedDate)}
                          </span>
                          {test.completedDate && (
                            <span className="flex items-center gap-1.5">
                              <FaCheck className="text-green-500" />
                              Completed: {formatDate(test.completedDate)}
                            </span>
                          )}
                          {isDoctor && test.patient && (
                            <span className="flex items-center gap-1.5">
                              <FaUser className="text-gray-400" />
                              Patient: {test.patient.name}
                            </span>
                          )}
                          {isPatient && test.orderedBy && (
                            <span className="flex items-center gap-1.5">
                              <FaUserMd className="text-gray-400" />
                              Dr. {test.orderedBy.name}
                            </span>
                          )}
                          {test.lab && (
                            <span className="flex items-center gap-1.5">
                              <MdLocalHospital className="text-gray-400" />
                              {test.lab}
                            </span>
                          )}
                        </div>

                        {/* Result Preview (if completed) */}
                        {test.status === "completed" && test.result && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BsGraphUp className="text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Result Summary
                                </span>
                              </div>
                              {test.result.value && (
                                <span className="text-sm font-semibold text-gray-900">
                                  {test.result.value} {test.result.unit}
                                </span>
                              )}
                            </div>
                            {test.result.referenceRange && (
                              <p className="text-xs text-gray-500 mt-1">
                                Reference Range: {test.result.referenceRange}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedTest(test);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition font-medium text-sm"
                      >
                        <FaEye />
                        View Details
                      </button>
                      {isDoctor && (test.status === "pending" || test.status === "in_progress") && (
                        <button
                          onClick={() => {
                            setSelectedTest(test);
                            setShowUpdateModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium text-sm"
                        >
                          <FaEdit />
                          Update Results
                        </button>
                      )}
                      {test.status === "completed" && (
                        <>
                          {test.reportUrl && (
                            <a
                              href={test.reportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                            >
                              <FaDownload />
                              Download
                            </a>
                          )}
                          <button
                            onClick={() => handlePrintTest(test)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                          >
                            <FaPrint />
                            Print
                          </button>
                        </>
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

        {/* Test Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedTest && (
            <TestDetailModal
              test={selectedTest}
              userRole={userRole}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedTest(null);
              }}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              getStatusConfig={getStatusConfig}
              getResultStatus={getResultStatus}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
              onPrint={handlePrintTest}
            />
          )}
        </AnimatePresence>

        {/* Order Test Modal (Doctor Only) */}
        <AnimatePresence>
          {showOrderModal && isDoctor && (
            <OrderTestModal
              apiCall={apiCall}
              onClose={() => setShowOrderModal(false)}
              onSuccess={() => {
                setShowOrderModal(false);
                fetchLabTests();
              }}
              testCategories={testCategories}
            />
          )}
        </AnimatePresence>

        {/* Update Results Modal (Doctor Only) */}
        <AnimatePresence>
          {showUpdateModal && isDoctor && selectedTest && (
            <UpdateLabTestModal
              test={selectedTest}
              apiCall={apiCall}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedTest(null);
              }}
              onSuccess={() => {
                setShowUpdateModal(false);
                setSelectedTest(null);
                fetchLabTests();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Test Detail Modal
const TestDetailModal = ({
  test,
  userRole,
  onClose,
  formatDate,
  formatDateTime,
  getStatusConfig,
  getResultStatus,
  getCategoryIcon,
  getCategoryColor,
  onPrint,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    results: true,
    notes: true,
  });

  const status = getStatusConfig(test.status);
  const resultStatus = getResultStatus(test.result);
  const CategoryIcon = getCategoryIcon(test.category);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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
        <div
          className={`bg-gradient-to-br ${getCategoryColor(
            test.category
          )} p-6 text-white`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CategoryIcon className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{test.testName}</h2>
                <p className="text-white/80 capitalize">
                  {test.category?.replace("_", " ")} Test
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
              <status.icon className="text-sm" />
              {status.label}
            </span>
            {resultStatus && (
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 flex items-center gap-1.5`}
              >
                <resultStatus.icon className="text-sm" />
                {resultStatus.label}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Test Details Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3"
            >
              <span className="font-semibold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="text-purple-500" />
                Test Details
              </span>
              {expandedSections.details ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.details && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(test.orderedDate)}
                  </p>
                </div>
                {test.completedDate && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Completed Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(test.completedDate)}
                    </p>
                  </div>
                )}
                {test.orderedBy && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Ordered By</p>
                    <p className="font-medium text-gray-900">
                      Dr. {test.orderedBy.name}
                    </p>
                  </div>
                )}
                {test.patient && userRole === "doctor" && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Patient</p>
                    <p className="font-medium text-gray-900">{test.patient.name}</p>
                  </div>
                )}
                {test.lab && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Laboratory</p>
                    <p className="font-medium text-gray-900">{test.lab}</p>
                  </div>
                )}
                {test.sampleType && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Sample Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {test.sampleType}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          {test.status === "completed" && test.result && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection("results")}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3"
              >
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <BsGraphUp className="text-purple-500" />
                  Test Results
                </span>
                {expandedSections.results ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedSections.results && (
                <div
                  className={`p-4 rounded-xl border-2 ${
                    test.result.isAbnormal
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Result Value</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {test.result.value} {test.result.unit}
                    </span>
                  </div>
                  {test.result.referenceRange && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Reference Range</span>
                      <span className="text-gray-700">{test.result.referenceRange}</span>
                    </div>
                  )}
                  {test.result.interpretation && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Interpretation: </span>
                        {test.result.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notes Section */}
          {(test.notes || test.doctorNotes) && (
            <div>
              <button
                onClick={() => toggleSection("notes")}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3"
              >
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaNotesMedical className="text-purple-500" />
                  Notes
                </span>
                {expandedSections.notes ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedSections.notes && (
                <div className="space-y-3">
                  {test.notes && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Test Notes</p>
                      <p className="text-gray-700">{test.notes}</p>
                    </div>
                  )}
                  {test.doctorNotes && (
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="text-xs text-purple-600 mb-1">Doctor's Notes</p>
                      <p className="text-gray-700">{test.doctorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
          {test.reportUrl && (
            <a
              href={test.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-medium"
            >
              <FaDownload />
              Download Report
            </a>
          )}
          {test.status === "completed" && (
            <button
              onClick={() => onPrint(test)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium"
            >
              <FaPrint />
              Print
            </button>
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

// Order Test Modal (Doctor Only)
const OrderTestModal = ({ apiCall, onClose, onSuccess, testCategories }) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    testName: "",
    category: "",
    priority: "normal",
    notes: "",
    lab: "",
  });

  // Common lab tests by category
  // Note: Imaging studies (X-Ray, CT, MRI, etc.) are ordered from the Medical Imaging page
  const commonTests = {
    blood: [
      "Complete Blood Count (CBC)",
      "Blood Glucose (Fasting)",
      "Lipid Profile",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Thyroid Profile (T3, T4, TSH)",
      "HbA1c",
      "Vitamin D",
      "Vitamin B12",
      "Iron Studies",
    ],
    urine: [
      "Urinalysis",
      "Urine Culture",
      "24-Hour Urine Protein",
      "Urine Microalbumin",
    ],
    cardiac: ["ECG", "Echocardiogram", "Stress Test", "Holter Monitor", "Troponin"],
    metabolic: [
      "Basic Metabolic Panel",
      "Comprehensive Metabolic Panel",
      "Electrolyte Panel",
    ],
    hormone: [
      "Testosterone",
      "Estrogen",
      "Cortisol",
      "Growth Hormone",
      "Insulin",
      "FSH/LH",
    ],
    pathology: ["Biopsy", "Pap Smear", "Tumor Markers", "Histopathology"],
    microbiology: [
      "Blood Culture",
      "Stool Culture",
      "Throat Swab Culture",
      "Wound Culture",
      "Sputum Culture",
      "CSF Culture",
    ],
    other: ["Allergy Panel", "Drug Screening", "Genetic Testing"],
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
    if (!formData.patientId || !formData.testName || !formData.category) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("/lab-tests", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error ordering test:", error);
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
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaPlus className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Order Lab Test</h2>
                <p className="text-white/80 text-sm">Request a new lab test for patient</p>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient.odlUserId || patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  testName: "",
                }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {testCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Name *
            </label>
            {formData.category && commonTests[formData.category] ? (
              <select
                value={formData.testName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, testName: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select test</option>
                {commonTests[formData.category].map((test) => (
                  <option key={test} value={test}>
                    {test}
                  </option>
                ))}
                <option value="other">Other (specify in notes)</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.testName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, testName: e.target.value }))
                }
                placeholder="Enter test name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              {["normal", "urgent", "stat"].map((priority) => (
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
                        : "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Lab */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Laboratory
            </label>
            <input
              type="text"
              value={formData.lab}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lab: e.target.value }))
              }
              placeholder="e.g., City Diagnostics Lab"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add any special instructions or clinical context..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ordering...
              </>
            ) : (
              <>
                <FaFlask />
                Order Test
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Update Lab Test Modal (Doctor Only - for entering results)
const UpdateLabTestModal = ({ test, apiCall, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: test.status || "pending",
    result: {
      value: test.result?.value || "",
      unit: test.result?.unit || "",
      referenceRange: test.result?.referenceRange || "",
      isAbnormal: test.result?.isAbnormal || false,
      interpretation: test.result?.interpretation || "",
    },
    doctorNotes: test.doctorNotes || "",
    reportUrl: test.reportUrl || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare the update data
      const updateData = {
        status: formData.status,
        doctorNotes: formData.doctorNotes,
        reportUrl: formData.reportUrl || null,
      };

      // Only include result if we have values
      if (formData.result.value) {
        updateData.result = {
          value: formData.result.value,
          unit: formData.result.unit,
          referenceRange: formData.result.referenceRange,
          isAbnormal: formData.result.isAbnormal,
          interpretation: formData.result.interpretation,
        };
      }

      const response = await apiCall(`/lab-tests/${test._id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating lab test:", error);
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
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaEdit className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Update Lab Test Results</h2>
                <p className="text-white/80 text-sm">{test.testName}</p>
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
          {/* Patient Info (Read-only) */}
          {test.patient && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Patient</p>
              <p className="font-medium text-gray-900">{test.patient.name}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Result Section */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BsGraphUp className="text-purple-500" />
              Test Results
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Value */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Result Value
                </label>
                <input
                  type="text"
                  value={formData.result.value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      result: { ...prev.result, value: e.target.value },
                    }))
                  }
                  placeholder="e.g., 5.2"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.result.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      result: { ...prev.result, unit: e.target.value },
                    }))
                  }
                  placeholder="e.g., mg/dL"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Reference Range */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Reference Range
              </label>
              <input
                type="text"
                value={formData.result.referenceRange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    result: { ...prev.result, referenceRange: e.target.value },
                  }))
                }
                placeholder="e.g., 4.0 - 6.0 mg/dL"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Is Abnormal */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.result.isAbnormal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      result: { ...prev.result, isAbnormal: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Mark as Abnormal Result
              </span>
              {formData.result.isAbnormal && (
                <FaExclamationTriangle className="text-red-500" />
              )}
            </div>

            {/* Interpretation */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Result Interpretation
              </label>
              <textarea
                value={formData.result.interpretation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    result: { ...prev.result, interpretation: e.target.value },
                  }))
                }
                placeholder="Clinical interpretation of the results..."
                rows={2}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              />
            </div>
          </div>

          {/* Doctor Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor's Notes
            </label>
            <textarea
              value={formData.doctorNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, doctorNotes: e.target.value }))
              }
              placeholder="Add any additional clinical notes, recommendations, or follow-up instructions..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Report URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report URL (Optional)
            </label>
            <input
              type="url"
              value={formData.reportUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reportUrl: e.target.value }))
              }
              placeholder="https://example.com/report.pdf"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Results
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LabTests;
