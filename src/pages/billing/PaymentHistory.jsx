import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaHistory,
  FaSearch,
  FaCalendarAlt,
  FaEye,
  FaTimes,
  FaCheck,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaReceipt,
  FaCreditCard,
  FaUserMd,
  FaPrint,
  FaDownload,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdPayment, MdReceipt } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsCreditCard2Front, BsBank } from "react-icons/bs";
import { SiStripe } from "react-icons/si";

const PaymentHistory = () => {
  const { apiCall, dbUser, loading: authLoading, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, [dateRange, pagination.page]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await apiCall(`/billing/payment-history?${params.toString()}`);

      if (response.success) {
        setPayments(response.data || []);
        setStats(response.stats || { totalPayments: 0, totalAmount: 0 });
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount || 0);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "stripe":
        return <SiStripe className="text-indigo-500" />;
      case "card":
        return <BsCreditCard2Front className="text-blue-500" />;
      case "bank":
        return <BsBank className="text-green-500" />;
      default:
        return <FaCreditCard className="text-gray-500" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "stripe":
        return "Stripe";
      case "card":
        return "Credit Card";
      case "bank":
        return "Bank Transfer";
      default:
        return "Online Payment";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      payment.bill?.description?.toLowerCase().includes(search) ||
      payment.bill?.doctorName?.toLowerCase().includes(search) ||
      payment.stripePaymentIntentId?.toLowerCase().includes(search)
    );
  });

  const handlePrintReceipt = (payment) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - MedAI</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
            color: #1f2937;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0d9488;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { color: #0d9488; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #6b7280; font-size: 14px; }
          .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #d1fae5;
            color: #065f46;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
          }
          .amount {
            text-align: center;
            padding: 20px;
            background: #f0fdfa;
            border-radius: 12px;
            margin: 20px 0;
          }
          .amount p { font-size: 14px; color: #6b7280; }
          .amount h2 { font-size: 36px; color: #0d9488; font-weight: 700; }
          .details { margin: 20px 0; }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { font-weight: 500; color: #1f2937; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MedAI Healthcare</h1>
          <p>Payment Receipt</p>
        </div>

        <div style="text-align: center;">
          <div class="success-badge">Payment Successful</div>
        </div>

        <div class="amount">
          <p>Amount Paid</p>
          <h2>${formatCurrency(payment.amount, payment.currency)}</h2>
        </div>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Transaction ID</span>
            <span class="detail-value">${payment.stripePaymentIntentId || payment._id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Date</span>
            <span class="detail-value">${formatDateTime(payment.createdAt)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method</span>
            <span class="detail-value">${getPaymentMethodLabel(payment.paymentMethod)}</span>
          </div>
          ${payment.bill ? `
          <div class="detail-row">
            <span class="detail-label">Service</span>
            <span class="detail-value">${payment.bill.description || 'Medical Consultation'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Doctor</span>
            <span class="detail-value">${payment.bill.doctorName || 'N/A'}</span>
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>Thank you for your payment!</p>
          <p>This is a computer-generated receipt from MedAI Healthcare System</p>
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

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHistory className="text-4xl text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your payment history.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium"
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaHistory className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600">
                  View all your past payments and transactions
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
                to="/billing/insurance"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
              >
                <FaShieldAlt />
                Insurance Claims
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaReceipt className="text-2xl text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPayments}</p>
                <p className="text-gray-500">Total Transactions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-gray-500">Total Amount Paid</p>
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
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

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

        {/* Payments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading payment history...</p>
            </div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHistory className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Payment History</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't made any payments yet. Once you pay for your medical bills, they will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment, index) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-2xl text-white" />
                    </div>

                    {/* Payment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {payment.bill?.description || "Medical Payment"}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Transaction ID: {payment.stripePaymentIntentId?.slice(-12) || payment._id.slice(-12)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <FaCheck className="text-xs" />
                            Completed
                          </span>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-gray-400" />
                          {formatDateTime(payment.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          {getPaymentMethodLabel(payment.paymentMethod)}
                        </span>
                        {payment.bill?.doctorName && (
                          <span className="flex items-center gap-1.5">
                            <FaUserMd className="text-gray-400" />
                            {payment.bill.doctorName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowDetailModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition font-medium text-sm"
                    >
                      <FaEye />
                      View Details
                    </button>
                    <button
                      onClick={() => handlePrintReceipt(payment)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                    >
                      <FaPrint />
                      Print Receipt
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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

        {/* Payment Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedPayment && (
            <PaymentDetailModal
              payment={selectedPayment}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedPayment(null);
              }}
              onPrint={() => handlePrintReceipt(selectedPayment)}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              formatCurrency={formatCurrency}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getPaymentMethodLabel={getPaymentMethodLabel}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Payment Detail Modal
const PaymentDetailModal = ({
  payment,
  onClose,
  onPrint,
  formatDate,
  formatDateTime,
  formatCurrency,
  getPaymentMethodIcon,
  getPaymentMethodLabel,
}) => {
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
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaCheckCircle className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Payment Successful</h2>
                <p className="text-white/80">Transaction completed</p>
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
          <div className="text-center mb-6 p-4 bg-green-50 rounded-2xl">
            <p className="text-sm text-green-600 mb-1">Amount Paid</p>
            <p className="text-4xl font-bold text-green-700">
              {formatCurrency(payment.amount, payment.currency)}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm">Transaction ID</span>
              <span className="font-medium text-gray-900 text-sm">
                {payment.stripePaymentIntentId?.slice(-12) || payment._id.slice(-12)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm">Date & Time</span>
              <span className="font-medium text-gray-900 text-sm">
                {formatDateTime(payment.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm">Payment Method</span>
              <span className="font-medium text-gray-900 text-sm flex items-center gap-2">
                {getPaymentMethodIcon(payment.paymentMethod)}
                {getPaymentMethodLabel(payment.paymentMethod)}
              </span>
            </div>
            {payment.bill && (
              <>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm">Service</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {payment.bill.description || "Medical Consultation"}
                  </span>
                </div>
                {payment.bill.doctorName && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 text-sm">Doctor</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {payment.bill.doctorName}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-medium"
          >
            <FaPrint />
            Print Receipt
          </button>
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

export default PaymentHistory;
