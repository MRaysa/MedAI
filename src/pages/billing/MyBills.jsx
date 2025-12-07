import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  FaFileInvoiceDollar,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaCreditCard,
  FaTimes,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaUserMd,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaReceipt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHistory,
  FaPercent,
  FaStethoscope,
} from "react-icons/fa";
import { MdPayment, MdLocalHospital } from "react-icons/md";
import { BsCreditCard2Front, BsBank } from "react-icons/bs";
import { HiCurrencyDollar } from "react-icons/hi";

const MyBills = () => {
  const { apiCall, dbUser, loading: authLoading, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    paid: 0,
    paidAmount: 0,
    pending: 0,
    pendingAmount: 0,
    overdue: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [stripeError, setStripeError] = useState(null);
  const [generatingBills, setGeneratingBills] = useState(false);
  const [billsGenerated, setBillsGenerated] = useState(false);

  const userRole = dbUser?.role;
  const isPatient = userRole === "patient";

  useEffect(() => {
    fetchStripeConfig();
  }, []);

  useEffect(() => {
    fetchBills();
  }, [statusFilter, dateRange, pagination.page]);

  const fetchStripeConfig = async () => {
    try {
      setStripeLoading(true);
      setStripeError(null);
      console.log("Fetching Stripe config...");
      const response = await apiCall("/billing/stripe-config");
      console.log("Stripe config response:", response);
      if (response.success && response.publishableKey) {
        console.log("Loading Stripe with key:", response.publishableKey.substring(0, 20) + "...");
        const stripeInstance = loadStripe(response.publishableKey);
        setStripePromise(stripeInstance);
        console.log("Stripe loaded successfully");
      } else {
        console.error("Invalid Stripe config response:", response);
        setStripeError("Failed to load payment configuration");
      }
    } catch (error) {
      console.error("Error fetching Stripe config:", error);
      setStripeError(error?.message || "Failed to load payment system");
    } finally {
      setStripeLoading(false);
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await apiCall(`/billing/bills?${params.toString()}`);

      if (response.success) {
        setBills(response.data || []);
        setStats(response.stats || {});
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));

        // If no bills found and not already generated, try generating bills from appointments
        if ((response.data || []).length === 0 && !billsGenerated) {
          await generateBillsFromAppointments();
        }
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateBillsFromAppointments = async () => {
    try {
      setGeneratingBills(true);
      const response = await apiCall("/billing/generate-bills-for-appointments", {
        method: "POST",
      });

      if (response.success && response.billsCreated > 0) {
        setBillsGenerated(true);
        // Refetch bills after generating
        const params = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
        });
        const billsResponse = await apiCall(`/billing/bills?${params.toString()}`);
        if (billsResponse.success) {
          setBills(billsResponse.data || []);
          setStats(billsResponse.stats || {});
          setPagination((prev) => ({
            ...prev,
            total: billsResponse.pagination?.total || 0,
            totalPages: billsResponse.pagination?.totalPages || 0,
          }));
        }
      }
      setBillsGenerated(true);
    } catch (error) {
      console.error("Error generating bills:", error);
      setBillsGenerated(true);
    } finally {
      setGeneratingBills(false);
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
      paid: {
        label: "Paid",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: FaCheck,
      },
      overdue: {
        label: "Overdue",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: FaExclamationTriangle,
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

  const filteredBills = bills.filter((bill) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      bill.description?.toLowerCase().includes(search) ||
      bill.doctorName?.toLowerCase().includes(search) ||
      bill.serviceName?.toLowerCase().includes(search)
    );
  });

  const handlePayBill = async (bill) => {
    // If Stripe not loaded yet, try loading it first
    if (!stripePromise && !stripeLoading) {
      await fetchStripeConfig();
    }
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaFileInvoiceDollar className="text-4xl text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your bills.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium"
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
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaFileInvoiceDollar className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bills</h1>
                <p className="text-gray-600">
                  View and pay your medical bills
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/billing/insurance"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
              >
                <FaShieldAlt />
                Insurance Claims
              </Link>
              <Link
                to="/billing/history"
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition font-medium text-sm"
              >
                <FaHistory />
                Payment History
              </Link>
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
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <FaReceipt className="text-xl text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Bills</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
                <p className="text-sm text-gray-500">{stats.pending} Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheck className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
                <p className="text-sm text-gray-500">{stats.paid} Paid</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-xl text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                <p className="text-sm text-gray-500">Overdue</p>
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
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Bills List */}
        {loading || generatingBills ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">
                {generatingBills ? "Generating bills from your appointments..." : "Loading bills..."}
              </p>
            </div>
          </div>
        ) : filteredBills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFileInvoiceDollar className="text-4xl text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bills Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              You don't have any bills yet. Bills will appear here after you book appointments.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBills.map((bill, index) => {
              const status = getStatusConfig(bill.status);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={bill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <FaStethoscope className="text-2xl text-white" />
                      </div>

                      {/* Bill Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {bill.serviceName || "Medical Consultation"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {bill.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(bill.totalAmount, bill.currency)}
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
                            <FaUserMd className="text-gray-400" />
                            {bill.doctorName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(bill.createdAt)}
                          </span>
                          {bill.discount && (
                            <span className="flex items-center gap-1.5 text-green-600">
                              <FaPercent className="text-green-500" />
                              {bill.discount.value}% {bill.discount.reason}
                            </span>
                          )}
                          {bill.dueDate && bill.status === "pending" && (
                            <span className="flex items-center gap-1.5 text-amber-600">
                              <FaClock className="text-amber-500" />
                              Due: {formatDate(bill.dueDate)}
                            </span>
                          )}
                        </div>

                        {/* Fee Summary Preview */}
                        {bill.lineItems && bill.lineItems.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Consultation Fee</span>
                              <span className="font-medium">{formatCurrency(bill.subtotal, bill.currency)}</span>
                            </div>
                            {bill.discount && (
                              <div className="flex items-center justify-between text-sm text-green-600">
                                <span>{bill.discount.reason}</span>
                                <span>-{formatCurrency(bill.discount.amount, bill.currency)}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-medium">{bill.duration || 30} mins</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-teal-600 bg-teal-50 rounded-xl hover:bg-teal-100 transition font-medium text-sm"
                      >
                        <FaEye />
                        View Details
                      </button>
                      {bill.status === "pending" && isPatient && (
                        <button
                          onClick={() => handlePayBill(bill)}
                          className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium text-sm"
                        >
                          <FaCreditCard />
                          Pay Now
                        </button>
                      )}
                      {bill.status === "paid" && (
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                        >
                          <FaPrint />
                          Print Receipt
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

        {/* Bill Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedBill && (
            <BillDetailModal
              bill={selectedBill}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedBill(null);
              }}
              onPay={() => {
                setShowDetailModal(false);
                setShowPaymentModal(true);
              }}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusConfig={getStatusConfig}
              isPatient={isPatient}
            />
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedBill && (
            <>
              {stripeLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
                    <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading payment system...</p>
                  </div>
                </motion.div>
              ) : stripeError || !stripePromise ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBill(null);
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaExclamationTriangle className="text-3xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment System Unavailable</h3>
                    <p className="text-gray-500 mb-6">
                      {stripeError || "Unable to load payment system. Please try again later."}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          fetchStripeConfig();
                        }}
                        className="px-5 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
                      >
                        Retry
                      </button>
                      <button
                        onClick={() => {
                          setShowPaymentModal(false);
                          setSelectedBill(null);
                        }}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <Elements stripe={stripePromise}>
                  <PaymentModal
                    bill={selectedBill}
                    apiCall={apiCall}
                    onClose={() => {
                      setShowPaymentModal(false);
                      setSelectedBill(null);
                    }}
                    onSuccess={() => {
                      setShowPaymentModal(false);
                      setSelectedBill(null);
                      fetchBills();
                    }}
                    formatCurrency={formatCurrency}
                  />
                </Elements>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Bill Detail Modal
const BillDetailModal = ({
  bill,
  onClose,
  onPay,
  formatDate,
  formatCurrency,
  getStatusConfig,
  isPatient,
}) => {
  const status = getStatusConfig(bill.status);
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
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaFileInvoiceDollar className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bill Details</h2>
                <p className="text-white/80">{bill.serviceName}</p>
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
          {/* Amount */}
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(bill.totalAmount, bill.currency)}
            </p>
          </div>

          {/* Fee Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <HiCurrencyDollar className="text-teal-500" />
              Fee Summary
            </h3>
            <div className="space-y-2 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-medium">{formatCurrency(bill.subtotal, bill.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{bill.duration || 30} mins</span>
              </div>
              {bill.discount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{bill.discount.reason}</span>
                  <span className="font-medium">
                    {bill.discount.type === "percentage"
                      ? `${bill.discount.value}% OFF`
                      : `-${formatCurrency(bill.discount.amount, bill.currency)}`}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-teal-600">{formatCurrency(bill.totalAmount, bill.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Doctor</p>
                <p className="font-medium text-gray-900">{bill.doctorName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Specialization</p>
                <p className="font-medium text-gray-900">{bill.doctorSpecialization}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Bill Date</p>
                <p className="font-medium text-gray-900">{formatDate(bill.createdAt)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                <p className="font-medium text-gray-900">{formatDate(bill.dueDate)}</p>
              </div>
            </div>

            {bill.paidAt && (
              <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-600 mb-1">Paid On</p>
                <p className="font-medium text-green-700">{formatDate(bill.paidAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
          {bill.status === "pending" && isPatient && (
            <button
              onClick={onPay}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium"
            >
              <FaCreditCard />
              Pay Now
            </button>
          )}
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

// Payment Modal with Stripe
const PaymentModal = ({ bill, apiCall, onClose, onSuccess, formatCurrency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [initializingPayment, setInitializingPayment] = useState(true);

  useEffect(() => {
    createPaymentIntent();
  }, [bill._id]);

  const createPaymentIntent = async () => {
    try {
      setInitializingPayment(true);
      setError(null);
      console.log("Creating payment intent for bill:", bill._id);

      const response = await apiCall("/billing/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billId: bill._id }),
      });

      console.log("Payment intent response:", response);

      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
      } else {
        setError(response.message || "Failed to initialize payment. Please try again.");
      }
    } catch (err) {
      console.error("Payment intent creation error:", err);
      // Extract error message from the error object
      const errorMessage = err?.message || "Failed to initialize payment. Please check your connection and try again.";
      setError(errorMessage);
    } finally {
      setInitializingPayment(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm payment on backend
        const confirmResponse = await apiCall("/billing/confirm-payment", {
          method: "POST",
          body: JSON.stringify({
            billId: bill._id,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (confirmResponse.success) {
          onSuccess();
        } else {
          setError("Payment successful but failed to update records. Please contact support.");
        }
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#374151",
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
    hidePostalCode: true, // Hide postal code field for simpler checkout
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
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaCreditCard className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Payment</h2>
                <p className="text-white/80 text-sm">Secure payment with Stripe</p>
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

        {/* Content */}
        <div className="p-6">
          {/* Amount */}
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(bill.totalAmount, bill.currency)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{bill.serviceName}</p>
          </div>

          {/* Show loading while initializing payment */}
          {initializingPayment ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Initializing secure payment...</p>
            </div>
          ) : error && !clientSecret ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={createPaymentIntent}
                className="px-5 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            /* Payment Form */
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Test card: 4242 4242 4242 4242, any future date, any CVC
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <FaShieldAlt className="text-green-500" />
                <span>Your payment is secured by Stripe</span>
              </div>

              <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay {formatCurrency(bill.totalAmount, bill.currency)}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyBills;
