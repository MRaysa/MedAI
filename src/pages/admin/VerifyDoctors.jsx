import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaSearch,
  FaFilter,
  FaArrowLeft,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaHospital,
  FaIdCard,
  FaFileAlt,
  FaTimes,
  FaSpinner,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdVerified, MdPending, MdGavel } from "react-icons/md";

const VerifyDoctors = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPendingDoctors();
  }, [pagination.page]);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/admin/doctors/pending?page=${pagination.page}&limit=${pagination.limit}`
      );
      if (response.success) {
        setDoctors(response.doctors || []);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (doctor) => {
    try {
      const response = await apiCall(`/admin/doctors/${doctor._id}`);
      if (response.success) {
        setSelectedDoctor(response.doctor);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      // Use the basic doctor info if detailed fetch fails
      setSelectedDoctor(doctor);
      setShowDetailsModal(true);
    }
  };

  const handleVerify = async (doctorId, status, reason = "") => {
    setVerifying(true);
    try {
      const response = await apiCall(`/admin/doctors/${doctorId}/verify`, {
        method: "PUT",
        body: JSON.stringify({ status, reason }),
      });

      if (response.success) {
        // Remove verified doctor from the list
        setDoctors((prev) => prev.filter((d) => d._id !== doctorId));
        setShowDetailsModal(false);
        setSelectedDoctor(null);
        // Update total count
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
      }
    } catch (error) {
      console.error("Error verifying doctor:", error);
      alert("Failed to update verification status. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <MdPending /> Pending
          </span>
        );
      case "under_review":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <FaEye /> Under Review
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <MdVerified /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <FaTimesCircle /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.user?.displayName?.toLowerCase().includes(searchLower) ||
      doctor.user?.email?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower) ||
      doctor.licenseNumber?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && doctors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Doctor Verification
              </h1>
              <p className="mt-1 text-gray-500">
                Review and verify doctor applications
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium">
                <MdPending />
                {pagination.total} Pending
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdVerified className="text-4xl text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-500">
              {searchTerm
                ? "No doctors match your search criteria."
                : "There are no pending doctor verifications at the moment."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doctor.user?.displayName ||
                            `${doctor.user?.firstName || ""} ${
                              doctor.user?.lastName || ""
                            }`.trim() ||
                            "Doctor"}
                        </h3>
                        {getStatusBadge(doctor.verificationStatus)}
                      </div>
                      <p className="text-gray-600 mt-1">
                        {doctor.specialization || "General Practice"}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        {doctor.user?.email && (
                          <span className="flex items-center gap-1">
                            <FaEnvelope className="text-gray-400" />
                            {doctor.user.email}
                          </span>
                        )}
                        {doctor.licenseNumber && (
                          <span className="flex items-center gap-1">
                            <FaIdCard className="text-gray-400" />
                            License: {doctor.licenseNumber}
                          </span>
                        )}
                        {doctor.yearsOfExperience > 0 && (
                          <span className="flex items-center gap-1">
                            <FaStar className="text-gray-400" />
                            {doctor.yearsOfExperience} years exp.
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        <FaCalendarAlt className="inline mr-1" />
                        Applied: {formatDate(doctor.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 lg:flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(doctor)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      <FaEye /> View Details
                    </button>
                    <button
                      onClick={() => handleVerify(doctor._id, "approved")}
                      disabled={verifying}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleVerify(
                          doctor._id,
                          "rejected",
                          "Does not meet requirements"
                        )
                      }
                      disabled={verifying}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.pages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Doctor Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Doctor Profile Review
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Basic Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaUserMd className="text-3xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedDoctor.user?.displayName ||
                          `${selectedDoctor.user?.firstName || ""} ${
                            selectedDoctor.user?.lastName || ""
                          }`.trim() ||
                          "Doctor"}
                      </h3>
                      <p className="text-lg text-purple-600">
                        {selectedDoctor.specialization || "General Practice"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(selectedDoctor.verificationStatus)}
                        {selectedDoctor.profileCompleteness !== undefined && (
                          <span className="text-sm text-gray-500">
                            Profile: {selectedDoctor.profileCompleteness}%
                            complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaEnvelope className="text-purple-500" /> Contact
                      Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {selectedDoctor.user?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedDoctor.user?.phone ||
                            selectedDoctor.practiceInfo?.clinicPhone ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaIdCard className="text-purple-500" /> Professional
                      Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-medium">
                          {selectedDoctor.licenseNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">License State</p>
                        <p className="font-medium">
                          {selectedDoctor.licenseState || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">License Expiry</p>
                        <p className="font-medium">
                          {formatDate(selectedDoctor.licenseExpiry)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">NPI Number</p>
                        <p className="font-medium">
                          {selectedDoctor.npiNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Years of Experience
                        </p>
                        <p className="font-medium">
                          {selectedDoctor.yearsOfExperience || 0} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium">
                          {selectedDoctor.specialization || "General Practice"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  {selectedDoctor.qualifications?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-purple-500" />{" "}
                        Qualifications
                      </h4>
                      <div className="space-y-2">
                        {selectedDoctor.qualifications.map((qual, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <p className="font-medium">{qual.degree}</p>
                            <p className="text-sm text-gray-500">
                              {qual.institution} • {qual.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Info */}
                  {selectedDoctor.practiceInfo?.clinicName && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaHospital className="text-purple-500" /> Practice
                        Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Clinic Name</p>
                          <p className="font-medium">
                            {selectedDoctor.practiceInfo.clinicName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">
                            {selectedDoctor.practiceInfo.clinicAddress?.city ||
                              "N/A"}
                            ,{" "}
                            {selectedDoctor.practiceInfo.clinicAddress?.state ||
                              ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Documents */}
                  {selectedDoctor.verificationDocuments?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaFileAlt className="text-purple-500" /> Verification
                        Documents
                      </h4>
                      <div className="space-y-2">
                        {selectedDoctor.verificationDocuments.map(
                          (doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <FaFileAlt className="text-gray-400" />
                                <div>
                                  <p className="font-medium">{doc.fileName}</p>
                                  <p className="text-sm text-gray-500">
                                    {doc.documentType} •{" "}
                                    {formatDate(doc.uploadedAt)}
                                  </p>
                                </div>
                              </div>
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {selectedDoctor.bio && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Bio</h4>
                      <p className="text-gray-700">{selectedDoctor.bio}</p>
                    </div>
                  )}

                  {/* Verification History */}
                  {selectedDoctor.verificationHistory?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MdGavel className="text-purple-500" /> Verification
                        History
                      </h4>
                      <div className="space-y-2">
                        {selectedDoctor.verificationHistory.map(
                          (history, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div>
                                <p className="font-medium capitalize">
                                  {history.status.replace("_", " ")}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {history.reason}
                                </p>
                              </div>
                              <span className="text-sm text-gray-400">
                                {formatDate(history.changedAt)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() =>
                      handleVerify(
                        selectedDoctor._id,
                        "rejected",
                        "Does not meet requirements"
                      )
                    }
                    disabled={verifying}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {verifying ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTimesCircle />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleVerify(selectedDoctor._id, "approved")
                    }
                    disabled={verifying}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                  >
                    {verifying ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheckCircle />
                    )}
                    Approve
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyDoctors;
