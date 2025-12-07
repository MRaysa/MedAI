import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaPlus,
  FaTimes,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaUserMd,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaFileInvoiceDollar,
  FaHistory,
  FaBuilding,
  FaIdCard,
  FaUpload,
  FaPaperPlane,
  FaInfoCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdHealthAndSafety, MdVerified } from "react-icons/md";
import { HiCurrencyDollar, HiDocumentText } from "react-icons/hi";

const InsuranceClaims = () => {
  const { apiCall, dbUser, loading: authLoading, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalClaimAmount: 0,
    totalApprovedAmount: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchClaims();
    fetchBills();
  }, [statusFilter, pagination.page]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await apiCall(`/billing/insurance-claims?${params.toString()}`);

      if (response.success) {
        setClaims(response.data || []);
        setStats(response.stats || {});
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await apiCall("/billing/bills?status=pending&limit=100");
      if (response.success) {
        setBills(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: FaClock,
        color: "amber",
      },
      processing: {
        label: "Processing",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: FaHourglassHalf,
        color: "blue",
      },
      approved: {
        label: "Approved",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: FaCheck,
        color: "green",
      },
      rejected: {
        label: "Rejected",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: FaTimesCircle,
        color: "red",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount || 0);
  };

  const filteredClaims = claims.filter((claim) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      claim.insuranceProvider?.toLowerCase().includes(search) ||
      claim.policyNumber?.toLowerCase().includes(search) ||
      claim.description?.toLowerCase().includes(search)
    );
  });

  // Show loading if auth is still loading
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShieldAlt className="text-4xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your insurance claims.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium"
          >
            Sign In
          </Link>
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Insurance Claims</h1>
                <p className="text-gray-600">
                  Submit and track your insurance claims
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/billing"
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition font-medium text-sm"
              >
                <FaFileInvoiceDollar />
                My Bills
              </Link>
              <Link
                to="/billing/history"
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition font-medium text-sm"
              >
                <FaHistory />
                Payment History
              </Link>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium shadow-lg"
              >
                <FaPlus />
                Submit Claim
              </button>
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
                <HiDocumentText className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Claims</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending + stats.processing}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheck className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalApprovedAmount)}</p>
                <p className="text-sm text-gray-500">{stats.approved} Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-xl text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-500">Rejected</p>
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
                placeholder="Search by provider or policy number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Claims List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading claims...</p>
            </div>
          </div>
        ) : filteredClaims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-4xl text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Insurance Claims</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't submitted any insurance claims yet. Submit a claim to get reimbursed for your medical expenses.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium"
            >
              <FaPlus />
              Submit Your First Claim
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredClaims.map((claim, index) => {
              const status = getStatusConfig(claim.status);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={claim._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <MdHealthAndSafety className="text-2xl text-white" />
                      </div>

                      {/* Claim Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {claim.insuranceProvider}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Policy: {claim.policyNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(claim.claimAmount)}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                            >
                              <StatusIcon className="text-xs" />
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-gray-400" />
                            Submitted: {formatDate(claim.submittedAt)}
                          </span>
                          {claim.billDetails?.doctorName && (
                            <span className="flex items-center gap-1.5">
                              <FaUserMd className="text-gray-400" />
                              {claim.billDetails.doctorName}
                            </span>
                          )}
                          {claim.status === "approved" && claim.approvedAmount && (
                            <span className="flex items-center gap-1.5 text-green-600">
                              <MdVerified className="text-green-500" />
                              Approved: {formatCurrency(claim.approvedAmount)}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {claim.description && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {claim.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedClaim(claim);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
                      >
                        <FaEye />
                        View Details
                      </button>
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

        {/* Claim Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedClaim && (
            <ClaimDetailModal
              claim={selectedClaim}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedClaim(null);
              }}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusConfig={getStatusConfig}
            />
          )}
        </AnimatePresence>

        {/* Submit Claim Modal */}
        <AnimatePresence>
          {showSubmitModal && (
            <SubmitClaimModal
              bills={bills}
              apiCall={apiCall}
              onClose={() => setShowSubmitModal(false)}
              onSuccess={() => {
                setShowSubmitModal(false);
                fetchClaims();
              }}
              formatCurrency={formatCurrency}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Claim Detail Modal
const ClaimDetailModal = ({
  claim,
  onClose,
  formatDate,
  formatCurrency,
  getStatusConfig,
}) => {
  const status = getStatusConfig(claim.status);
  const StatusIcon = status.icon;

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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaShieldAlt className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Claim Details</h2>
                <p className="text-white/80">{claim.insuranceProvider}</p>
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
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 flex items-center gap-1.5">
              <StatusIcon className="text-sm" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm text-gray-500 mb-1">Claim Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(claim.claimAmount)}
              </p>
            </div>
            {claim.status === "approved" && (
              <div className="p-4 bg-green-50 rounded-2xl text-center">
                <p className="text-sm text-green-600 mb-1">Approved Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(claim.approvedAmount)}
                </p>
              </div>
            )}
          </div>

          {/* Insurance Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              Insurance Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Provider</p>
                <p className="font-medium text-gray-900">{claim.insuranceProvider}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Policy Number</p>
                <p className="font-medium text-gray-900">{claim.policyNumber}</p>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          {claim.billDetails && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaFileInvoiceDollar className="text-blue-500" />
                Bill Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-medium text-gray-900">{claim.billDetails.doctorName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-medium text-gray-900">{claim.billDetails.serviceName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Bill Amount</p>
                  <p className="font-medium text-gray-900">{formatCurrency(claim.billDetails.totalAmount)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Appointment Date</p>
                  <p className="font-medium text-gray-900">{formatDate(claim.billDetails.appointmentDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Submitted On</p>
              <p className="font-medium text-gray-900">{formatDate(claim.submittedAt)}</p>
            </div>
            {claim.processedAt && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Processed On</p>
                <p className="font-medium text-gray-900">{formatDate(claim.processedAt)}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {claim.description && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{claim.description}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {claim.status === "rejected" && claim.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-xs text-red-600 mb-1">Rejection Reason</p>
              <p className="text-red-700">{claim.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Submit Claim Modal
const SubmitClaimModal = ({ bills, apiCall, onClose, onSuccess, formatCurrency }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    billId: "",
    insuranceProvider: "",
    policyNumber: "",
    claimAmount: "",
    description: "",
  });

  const selectedBill = bills.find((b) => b._id === formData.billId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.billId || !formData.insuranceProvider || !formData.policyNumber || !formData.claimAmount) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiCall("/billing/insurance-claims", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || "Failed to submit claim");
      }
    } catch (err) {
      setError("Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const insuranceProviders = [
    "Blue Cross Blue Shield",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Medicare",
    "Medicaid",
    "Other",
  ];

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
                <FaPaperPlane className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Submit Insurance Claim</h2>
                <p className="text-white/80 text-sm">Get reimbursed for your medical expenses</p>
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
          {/* Select Bill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bill *
            </label>
            <select
              value={formData.billId}
              onChange={(e) => {
                const bill = bills.find((b) => b._id === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  billId: e.target.value,
                  claimAmount: bill ? bill.totalAmount.toString() : "",
                }));
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a bill</option>
              {bills.map((bill) => (
                <option key={bill._id} value={bill._id}>
                  {bill.serviceName} - {formatCurrency(bill.totalAmount)} - {bill.doctorName}
                </option>
              ))}
            </select>
            {bills.length === 0 && (
              <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                <FaInfoCircle />
                No pending bills available for claims
              </p>
            )}
          </div>

          {/* Selected Bill Info */}
          {selectedBill && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Service:</span>
                <span className="font-medium text-blue-800">{selectedBill.serviceName}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-blue-600">Doctor:</span>
                <span className="font-medium text-blue-800">{selectedBill.doctorName}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-blue-600">Amount:</span>
                <span className="font-medium text-blue-800">{formatCurrency(selectedBill.totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Insurance Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Provider *
            </label>
            <select
              value={formData.insuranceProvider}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, insuranceProvider: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select provider</option>
              {insuranceProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          {/* Policy Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Number *
            </label>
            <input
              type="text"
              value={formData.policyNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, policyNumber: e.target.value }))
              }
              placeholder="Enter your policy number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Claim Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.claimAmount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, claimAmount: e.target.value }))
              }
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Any additional information for your claim..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <FaExclamationTriangle />
                {error}
              </p>
            </div>
          )}
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
            disabled={loading || !formData.billId}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Submit Claim
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsuranceClaims;
