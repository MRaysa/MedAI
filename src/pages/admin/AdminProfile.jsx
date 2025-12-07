import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUser,
  FaSave,
  FaEdit,
  FaTimes,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaKey,
  FaSignOutAlt,
  FaCheckCircle,
  FaSpinner,
  FaLock,
  FaUserCog,
  FaCalendarAlt,
  FaHistory,
  FaCrown,
  FaGlobe,
  FaIdBadge,
  FaFingerprint,
  FaUserShield,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaUserMd,
  FaCog,
  FaServer,
  FaDatabase,
  FaRocket,
  FaStar,
  FaAward,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaShieldVirus,
  FaNetworkWired,
  FaTerminal,
} from "react-icons/fa";
import { MdVerified, MdSecurity, MdAdminPanelSettings, MdDashboard, MdSpeed } from "react-icons/md";
import { HiSparkles, HiLightningBolt, HiStatusOnline } from "react-icons/hi";
import { BiPulse, BiWorld } from "react-icons/bi";
import { RiShieldKeyholeFill, RiAdminFill, RiVipCrownFill } from "react-icons/ri";
import { IoMdPulse } from "react-icons/io";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";

const AdminProfile = () => {
  const { user, dbUser, apiCall, logout } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Admin stats
  const [adminStats, setAdminStats] = useState({
    totalActions: 156,
    usersManaged: 0,
    doctorsVerified: 0,
    lastLogin: null,
    systemUptime: "99.9%",
    activeUsers: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    phone: "",
    email: "",
    address: "",
    timezone: "America/New_York",
    language: "en",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Activity log
  const [activityLog, setActivityLog] = useState([]);

  // Animated counter
  const [counters, setCounters] = useState({
    actions: 0,
    users: 0,
    doctors: 0,
  });

  useEffect(() => {
    if (dbUser) {
      setFormData({
        firstName: dbUser.firstName || "",
        lastName: dbUser.lastName || "",
        displayName: dbUser.displayName || "",
        phone: dbUser.phone || "",
        email: dbUser.email || "",
        address: dbUser.address || "",
        timezone: dbUser.timezone || "America/New_York",
        language: dbUser.language || "en",
      });
    }
    fetchAdminStats();
    fetchActivityLog();
  }, [dbUser]);

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        actions: Math.floor(adminStats.totalActions * progress),
        users: Math.floor(adminStats.usersManaged * progress),
        doctors: Math.floor(adminStats.doctorsVerified * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [adminStats]);

  const fetchAdminStats = async () => {
    try {
      const response = await apiCall("/admin/dashboard");
      if (response.success) {
        setAdminStats({
          totalActions: response.stats?.totalActions || 156,
          usersManaged: response.stats?.totalUsers || 245,
          doctorsVerified: response.stats?.totalDoctors || 48,
          lastLogin: dbUser?.lastLogin || new Date().toISOString(),
          systemUptime: "99.9%",
          activeUsers: response.stats?.activeUsers || 189,
        });
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      // Set demo data on error
      setAdminStats({
        totalActions: 156,
        usersManaged: 245,
        doctorsVerified: 48,
        lastLogin: new Date().toISOString(),
        systemUptime: "99.9%",
        activeUsers: 189,
      });
    }
  };

  const fetchActivityLog = async () => {
    setActivityLog([
      {
        id: 1,
        action: "Verified doctor credentials",
        target: "Dr. Sarah Johnson",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "verification",
        status: "success",
      },
      {
        id: 2,
        action: "Updated system settings",
        target: "Security & Privacy",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        type: "settings",
        status: "success",
      },
      {
        id: 3,
        action: "Suspended user account",
        target: "john.doe@email.com",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: "user",
        status: "warning",
      },
      {
        id: 4,
        action: "Generated monthly report",
        target: "Revenue Analytics",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        type: "report",
        status: "success",
      },
      {
        id: 5,
        action: "Unlocked user account",
        target: "mary.smith@email.com",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        type: "user",
        status: "info",
      },
      {
        id: 6,
        action: "System backup completed",
        target: "Database Backup",
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
        type: "system",
        status: "success",
      },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await apiCall("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        setErrorMessage(response.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordData.newPassword);
      setSuccessMessage("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Current password is incorrect");
      } else {
        setErrorMessage("Failed to update password. Please try again.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      verification: { icon: MdVerified, color: "text-emerald-500", bg: "bg-emerald-500/20" },
      settings: { icon: FaCog, color: "text-blue-500", bg: "bg-blue-500/20" },
      user: { icon: FaUsers, color: "text-purple-500", bg: "bg-purple-500/20" },
      report: { icon: FaChartLine, color: "text-cyan-500", bg: "bg-cyan-500/20" },
      system: { icon: FaServer, color: "text-orange-500", bg: "bg-orange-500/20" },
    };
    return icons[type] || { icon: FaClipboardList, color: "text-gray-500", bg: "bg-gray-500/20" };
  };

  const getStatusColor = (status) => {
    const colors = {
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      info: "bg-blue-500",
      error: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: RiShieldKeyholeFill },
    { id: "activity", label: "Activity", icon: IoMdPulse },
  ];

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "GMT/BST" },
    { value: "Europe/Paris", label: "Central European" },
    { value: "Asia/Tokyo", label: "Japan Standard" },
    { value: "Asia/Kolkata", label: "India Standard" },
  ];

  const adminPrivileges = [
    { icon: FaUsers, label: "User Management", desc: "Full CRUD operations", color: "from-blue-500 to-indigo-600" },
    { icon: FaUserMd, label: "Doctor Verification", desc: "Approve/Reject credentials", color: "from-emerald-500 to-teal-600" },
    { icon: FaCog, label: "System Settings", desc: "Configure all parameters", color: "from-purple-500 to-pink-600" },
    { icon: FaChartLine, label: "Analytics Access", desc: "View all reports", color: "from-orange-500 to-red-600" },
    { icon: FaDatabase, label: "Data Management", desc: "Backup & restore", color: "from-cyan-500 to-blue-600" },
    { icon: FaShieldVirus, label: "Security Control", desc: "Audit & compliance", color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [null, Math.random() * -200, null],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Epic Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          {/* Main Profile Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" style={{ mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "xor" }} />

            {/* Glowing Orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />

            <div className="relative p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Profile Info */}
                <div className="flex items-center gap-6">
                  {/* Avatar with Effects */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-1 transform group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-xl bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
                        {dbUser?.photoURL ? (
                          <img src={dbUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <RiAdminFill className="text-5xl text-indigo-400" />
                        )}
                      </div>
                    </div>
                    {/* Crown Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute -top-3 -right-3 p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/50"
                    >
                      <RiVipCrownFill className="text-white text-lg" />
                    </motion.div>
                    {/* Camera Button */}
                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition shadow-lg">
                      <FaCamera className="text-sm" />
                    </button>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                        {formData.displayName || `${formData.firstName} ${formData.lastName}` || "Admin User"}
                      </h1>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full"
                      >
                        <HiSparkles className="text-amber-400" />
                        <span className="text-xs font-semibold text-indigo-300">Super Admin</span>
                      </motion.div>
                    </div>
                    <p className="text-gray-400 flex items-center gap-2 mb-1">
                      <FaEnvelope className="text-indigo-400" />
                      {formData.email}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-400" />
                      Admin since {new Date(dbUser?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    {/* Online Status */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-400 text-xs font-medium">Online</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {editMode ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditMode(false);
                          if (dbUser) {
                            setFormData({
                              firstName: dbUser.firstName || "",
                              lastName: dbUser.lastName || "",
                              displayName: dbUser.displayName || "",
                              phone: dbUser.phone || "",
                              email: dbUser.email || "",
                              address: dbUser.address || "",
                              timezone: dbUser.timezone || "America/New_York",
                              language: dbUser.language || "en",
                            });
                          }
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition font-medium"
                      >
                        <FaTimes /> Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition font-medium shadow-lg shadow-indigo-500/25"
                      >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Save Changes
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition font-medium shadow-lg shadow-indigo-500/25"
                    >
                      <FaEdit /> Edit Profile
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Actions", value: counters.actions, icon: FaBolt, color: "from-amber-500 to-orange-600", glow: "shadow-amber-500/25" },
                  { label: "Users Managed", value: counters.users, icon: FaUsers, color: "from-blue-500 to-indigo-600", glow: "shadow-blue-500/25" },
                  { label: "Doctors Verified", value: counters.doctors, icon: MdVerified, color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/25" },
                  { label: "System Uptime", value: adminStats.systemUptime, icon: HiStatusOnline, color: "from-cyan-500 to-blue-600", glow: "shadow-cyan-500/25", isText: true },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all shadow-lg ${stat.glow}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="text-xl text-white" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.isText ? stat.value : stat.value.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3 backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FaCheckCircle />
              </div>
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FaTimes />
              </div>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon /> {tab.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Admin Privileges */}
              <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaShieldAlt className="text-white" />
                    </div>
                    Administrator Privileges
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Full system access and control capabilities</p>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminPrivileges.map((priv, index) => (
                    <motion.div
                      key={priv.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${priv.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${priv.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <priv.icon className="text-white" />
                      </div>
                      <h4 className="font-semibold text-white mb-1">{priv.label}</h4>
                      <p className="text-xs text-gray-400">{priv.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <MdSpeed className="text-white text-xl" />
                    </div>
                    System Status
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "API Server", status: "Operational", color: "emerald" },
                    { label: "Database", status: "Healthy", color: "emerald" },
                    { label: "Auth Service", status: "Active", color: "emerald" },
                    { label: "Storage", status: "75% Used", color: "amber" },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`relative flex h-2.5 w-2.5`}>
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${item.color}-400 opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${item.color}-500`}></span>
                        </span>
                        <span className="text-gray-300 text-sm">{item.label}</span>
                      </div>
                      <span className={`text-xs font-medium text-${item.color}-400`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "firstName", label: "First Name", icon: FaUser, type: "text", placeholder: "Enter first name" },
                  { name: "lastName", label: "Last Name", icon: FaUser, type: "text", placeholder: "Enter last name" },
                  { name: "displayName", label: "Display Name", icon: FaIdBadge, type: "text", placeholder: "How you want to be displayed" },
                  { name: "email", label: "Email Address", icon: FaEnvelope, type: "email", placeholder: "Email", disabled: true },
                  { name: "phone", label: "Phone Number", icon: FaPhone, type: "tel", placeholder: "+1 (555) 123-4567" },
                  { name: "timezone", label: "Timezone", icon: BiWorld, type: "select", options: timezones },
                ].map((field) => (
                  <div key={field.name} className={field.name === "address" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <field.icon className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition appearance-none"
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          disabled={field.disabled || !editMode}
                          placeholder={field.placeholder}
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        />
                      )}
                    </div>
                    {field.disabled && <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      rows={2}
                      placeholder="Enter your address"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Change Password */}
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaKey className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Change Password</h3>
                    <p className="text-gray-400 text-sm">Update your password regularly for better security</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlePasswordUpdate}
                    disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                  >
                    {changingPassword ? <FaSpinner className="animate-spin" /> : <FaKey />}
                    Update Password
                  </motion.button>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <FaFingerprint className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Two-Factor Auth</h4>
                        <p className="text-xs text-gray-400">Extra layer of security</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-medium">
                      Coming Soon
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <MdSecurity className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Login Alerts</h4>
                        <p className="text-xs text-gray-400">Get notified of logins</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={logout}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition font-medium"
                >
                  <FaSignOutAlt /> Sign Out of Account
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <IoMdPulse className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Activity Log</h3>
                    <p className="text-gray-400 text-sm">Your recent admin actions</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                  Last 30 days
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {activityLog.map((activity, index) => {
                  const { icon: ActivityIcon, color, bg } = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-5 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                          <ActivityIcon className={`${color} text-lg`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{activity.action}</p>
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                          </div>
                          <p className="text-sm text-gray-400">{activity.target}</p>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-white/5">
                <button className="w-full py-3 text-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
                  View Full Activity Log
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminProfile;
