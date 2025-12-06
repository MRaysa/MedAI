import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUsers,
  FaUserMd,
  FaUserInjured,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaTimesCircle,
  FaUnlock,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSignInAlt,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

const AdminUsers = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const roles = [
    { value: "", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "doctor", label: "Doctor" },
    { value: "patient", label: "Patient" },
  ];

  const statuses = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
    { value: "pending_verification", label: "Pending Verification" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (searchTerm) params.append("search", searchTerm);

      const response = await apiCall(`/admin/users?${params.toString()}`);

      if (response.success) {
        setUsers(response.users || []);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ role: "", status: "" });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await apiCall(`/admin/users/${userId}`);
      if (response.success) {
        setSelectedUser(response);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await apiCall(`/admin/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.success) {
        fetchUsers();
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const unlockUser = async (userId) => {
    setActionLoading(true);
    try {
      const response = await apiCall(`/admin/users/${userId}/unlock`, {
        method: "POST",
      });

      if (response.success) {
        fetchUsers();
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error("Error unlocking user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    try {
      const response = await apiCall(`/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.success) {
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <MdAdminPanelSettings className="text-purple-500" />;
      case "doctor":
        return <FaUserMd className="text-teal-500" />;
      case "patient":
        return <FaUserInjured className="text-blue-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      doctor: "bg-teal-100 text-teal-700 border-teal-200",
      patient: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return styles[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
      pending_verification: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/admin/dashboard" className="hover:text-teal-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">User Management</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl text-white shadow-lg shadow-teal-500/25">
                  <FaUsers className="text-xl" />
                </div>
                User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage all users, update statuses, and view detailed profiles
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2">
                <span className="text-2xl font-bold text-teal-600">{pagination.total}</span>
                <span className="text-gray-500 ml-2">Total Users</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </form>

            {/* Filter Toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
                  showFilters
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaFilter />
                Filters
                {(filters.role || filters.status) && (
                  <span className="w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                    {(filters.role ? 1 : 0) + (filters.status ? 1 : 0)}
                  </span>
                )}
              </button>

              {(filters.role || filters.status || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition"
                >
                  <FaTimes />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => handleFilterChange("role", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-teal-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {user.displayName || `${user.firstName} ${user.lastName}` || "N/A"}
                              {user.isEmailVerified && (
                                <MdVerified className="text-blue-500" title="Email Verified" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status === "active" && <FaCheckCircle />}
                          {user.status === "suspended" && <FaBan />}
                          {user.status === "inactive" && <FaTimesCircle />}
                          {user.status?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user.id ? null : user.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <FaEllipsisV className="text-gray-500" />
                          </button>

                          <AnimatePresence>
                            {activeDropdown === user.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => viewUserDetails(user.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <FaEye className="text-gray-400" />
                                  View Details
                                </button>

                                {user.status !== "active" && (
                                  <button
                                    onClick={() => updateUserStatus(user.id, "active")}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition"
                                  >
                                    <FaCheckCircle className="text-green-500" />
                                    Activate
                                  </button>
                                )}

                                {user.status !== "suspended" && (
                                  <button
                                    onClick={() => updateUserStatus(user.id, "suspended")}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition"
                                  >
                                    <FaBan className="text-orange-500" />
                                    Suspend
                                  </button>
                                )}

                                <button
                                  onClick={() => unlockUser(user.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition"
                                >
                                  <FaUnlock className="text-blue-500" />
                                  Unlock Account
                                </button>

                                <div className="border-t border-gray-200 my-2"></div>

                                <button
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setShowDeleteModal(true);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition"
                                >
                                  <FaTrash className="text-red-500" />
                                  Delete User
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} users
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <div className="flex items-center gap-1">
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
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          pagination.page === pageNum
                            ? "bg-teal-500 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* User Details Modal */}
        <AnimatePresence>
          {showUserModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUserModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        {getRoleIcon(selectedUser.user?.role)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {selectedUser.user?.displayName || "User Details"}
                        </h3>
                        <p className="text-teal-100">{selectedUser.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUserShield className="text-teal-500" />
                        Account Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 uppercase">First Name</label>
                          <p className="font-medium">{selectedUser.user?.firstName || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Last Name</label>
                          <p className="font-medium">{selectedUser.user?.lastName || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Role</label>
                          <p className="font-medium capitalize">{selectedUser.user?.role}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Status</label>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              selectedUser.user?.status
                            )}`}
                          >
                            {selectedUser.user?.status?.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaEnvelope className="text-teal-500" />
                        Contact
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Email</label>
                          <p className="font-medium text-sm">{selectedUser.user?.email}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Phone</label>
                          <p className="font-medium">{selectedUser.user?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Activity Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-500" />
                        Activity
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Joined</label>
                          <p className="font-medium text-sm">
                            {formatDate(selectedUser.user?.createdAt)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Last Login</label>
                          <p className="font-medium text-sm">
                            {formatDate(selectedUser.user?.lastLogin)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUserShield className="text-teal-500" />
                        Security
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Email Verified</label>
                          <p className="font-medium flex items-center gap-2">
                            {selectedUser.user?.isEmailVerified ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaTimesCircle className="text-red-500" />
                            )}
                            {selectedUser.user?.isEmailVerified ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Login Attempts</label>
                          <p className="font-medium">{selectedUser.user?.loginAttempts || 0}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">Auth Provider</label>
                          <p className="font-medium capitalize">
                            {selectedUser.user?.authProvider || "Email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Info (if doctor or patient) */}
                    {selectedUser.profile && (
                      <div className="col-span-2 bg-teal-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <HiSparkles className="text-teal-500" />
                          {selectedUser.user?.role === "doctor" ? "Doctor Profile" : "Patient Profile"}
                        </h4>
                        {selectedUser.user?.role === "doctor" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 uppercase">Specialization</label>
                              <p className="font-medium">{selectedUser.profile?.specialization || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase">Verification Status</label>
                              <p className="font-medium capitalize">
                                {selectedUser.profile?.verificationStatus || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase">License Number</label>
                              <p className="font-medium">{selectedUser.profile?.licenseNumber || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase">Experience</label>
                              <p className="font-medium">
                                {selectedUser.profile?.yearsOfExperience || 0} years
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && userToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-2xl text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{userToDelete.displayName || userToDelete.email}</span>
                  ? This will permanently remove their account and all associated data.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteUser}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                    Delete User
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

export default AdminUsers;
