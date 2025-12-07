import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaCog,
  FaBell,
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoon,
  FaSun,
  FaGlobe,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrash,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaPalette,
  FaArrowLeft,
  FaDatabase,
  FaServer,
  FaUsersCog,
  FaFileAlt,
  FaChartBar,
  FaClock,
  FaHospital,
  FaMoneyBillWave,
  FaPercent,
  FaToggleOn,
  FaToggleOff,
  FaCloud,
  FaEnvelopeOpen,
  FaCalendarAlt,
  FaExclamationCircle,
  FaTimes,
  FaCheck,
  FaDesktop,
  FaMobile,
} from "react-icons/fa";
import { MdSecurity, MdNotifications, MdSettings, MdBackup, MdEmail } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { BiData } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";

const AdminSettings = () => {
  const { user, dbUser, signOutUser, apiCall } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    // General Settings
    siteName: "MedAI Healthcare",
    siteDescription: "AI-Powered Healthcare Management System",
    contactEmail: "support@medai.com",
    contactPhone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",

    // Appointment Settings
    defaultAppointmentDuration: 30,
    appointmentBufferTime: 10,
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 2,
    allowCancellationHours: 24,
    autoConfirmAppointments: false,
    sendAppointmentReminders: true,
    reminderHoursBefore: 24,

    // Billing Settings
    consultationFeeMin: 50,
    consultationFeeMax: 500,
    platformFeePercent: 10,
    taxRate: 0,
    enableOnlinePayments: true,
    enableInsuranceClaims: true,

    // Notification Settings
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    adminAlertEmail: "admin@medai.com",
    sendDailyReports: true,
    sendWeeklyReports: true,

    // Security Settings
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    sessionTimeoutMinutes: 60,
    requireEmailVerification: true,
    require2FA: false,
    passwordMinLength: 8,
    passwordRequireSpecial: true,

    // Doctor Verification Settings
    autoApproveVerifiedDoctors: false,
    requireLicenseVerification: true,
    requireIDVerification: true,
    verificationExpiryDays: 365,

    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
    backupFrequency: "daily",
    dataRetentionDays: 365,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const tabs = [
    { id: "general", label: "General", icon: FaCog },
    { id: "appointments", label: "Appointments", icon: FaCalendarAlt },
    { id: "billing", label: "Billing", icon: FaMoneyBillWave },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "verification", label: "Verification", icon: FaUsersCog },
    { id: "maintenance", label: "Maintenance", icon: FaServer },
  ];

  // Fetch system settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/admin/settings");
      if (response.success && response.settings) {
        setSystemSettings((prev) => ({
          ...prev,
          ...response.settings,
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Use default settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await apiCall("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ settings: systemSettings }),
      });

      if (response.success) {
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.message || "Failed to save settings");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to save settings. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import(
        "firebase/auth"
      );

      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);

      setSuccessMessage("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Current password is incorrect.");
      } else {
        setErrorMessage("Failed to update password. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-teal-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (!user || dbUser?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Admin access required</p>
          <button
            onClick={() => navigate("/signin")}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-200" />
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition mb-4"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/25">
                <RiAdminFill className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                <p className="text-gray-500">Configure system-wide settings and preferences</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                Administrator
              </span>
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="text-green-700">{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <span className="text-red-700">{errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="ml-auto">
                <FaTimes className="text-red-400 hover:text-red-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="text-lg" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaCog className="text-violet-600" />
                    General Settings
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={systemSettings.siteName}
                        onChange={(e) => handleSettingChange("siteName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={systemSettings.contactEmail}
                          onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={systemSettings.contactPhone}
                          onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={systemSettings.timezone}
                          onChange={(e) => handleSettingChange("timezone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition appearance-none"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Asia/Kolkata">India Standard Time (IST)</option>
                          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                          <option value="Asia/Dhaka">Bangladesh Standard Time (BST)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={systemSettings.dateFormat}
                        onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <div className="relative">
                        <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={systemSettings.currency}
                          onChange={(e) => handleSettingChange("currency", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition appearance-none"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="INR">INR - Indian Rupee</option>
                          <option value="BDT">BDT - Bangladeshi Taka</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={systemSettings.siteDescription}
                      onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Appointment Settings */}
              {activeTab === "appointments" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-violet-600" />
                    Appointment Settings
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.defaultAppointmentDuration}
                        onChange={(e) =>
                          handleSettingChange("defaultAppointmentDuration", parseInt(e.target.value))
                        }
                        min={15}
                        max={120}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer Time Between Appointments (minutes)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.appointmentBufferTime}
                        onChange={(e) =>
                          handleSettingChange("appointmentBufferTime", parseInt(e.target.value))
                        }
                        min={0}
                        max={60}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Advance Booking (days)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.maxAdvanceBookingDays}
                        onChange={(e) =>
                          handleSettingChange("maxAdvanceBookingDays", parseInt(e.target.value))
                        }
                        min={1}
                        max={365}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Advance Booking (hours)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.minAdvanceBookingHours}
                        onChange={(e) =>
                          handleSettingChange("minAdvanceBookingHours", parseInt(e.target.value))
                        }
                        min={0}
                        max={72}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Notice (hours)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.allowCancellationHours}
                        onChange={(e) =>
                          handleSettingChange("allowCancellationHours", parseInt(e.target.value))
                        }
                        min={0}
                        max={72}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Hours Before
                      </label>
                      <input
                        type="number"
                        value={systemSettings.reminderHoursBefore}
                        onChange={(e) =>
                          handleSettingChange("reminderHoursBefore", parseInt(e.target.value))
                        }
                        min={1}
                        max={72}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Auto-confirm Appointments</p>
                        <p className="text-sm text-gray-500">
                          Automatically confirm appointments without doctor approval
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.autoConfirmAppointments}
                        onChange={(val) => handleSettingChange("autoConfirmAppointments", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Send Appointment Reminders</p>
                        <p className="text-sm text-gray-500">
                          Email/SMS reminders before appointments
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.sendAppointmentReminders}
                        onChange={(val) => handleSettingChange("sendAppointmentReminders", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaMoneyBillWave className="text-violet-600" />
                    Billing Settings
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Consultation Fee ({systemSettings.currency})
                      </label>
                      <input
                        type="number"
                        value={systemSettings.consultationFeeMin}
                        onChange={(e) =>
                          handleSettingChange("consultationFeeMin", parseInt(e.target.value))
                        }
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Consultation Fee ({systemSettings.currency})
                      </label>
                      <input
                        type="number"
                        value={systemSettings.consultationFeeMax}
                        onChange={(e) =>
                          handleSettingChange("consultationFeeMax", parseInt(e.target.value))
                        }
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Fee (%)
                      </label>
                      <div className="relative">
                        <FaPercent className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={systemSettings.platformFeePercent}
                          onChange={(e) =>
                            handleSettingChange("platformFeePercent", parseFloat(e.target.value))
                          }
                          min={0}
                          max={50}
                          step={0.5}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <div className="relative">
                        <FaPercent className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={systemSettings.taxRate}
                          onChange={(e) =>
                            handleSettingChange("taxRate", parseFloat(e.target.value))
                          }
                          min={0}
                          max={50}
                          step={0.5}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Enable Online Payments</p>
                        <p className="text-sm text-gray-500">Accept payments through the platform</p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.enableOnlinePayments}
                        onChange={(val) => handleSettingChange("enableOnlinePayments", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Enable Insurance Claims</p>
                        <p className="text-sm text-gray-500">
                          Allow patients to submit insurance claims
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.enableInsuranceClaims}
                        onChange={(val) => handleSettingChange("enableInsuranceClaims", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaBell className="text-violet-600" />
                    Notification Settings
                  </h2>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-700">Email Notifications</p>
                          <p className="text-sm text-gray-500">Send notifications via email</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.enableEmailNotifications}
                        onChange={(val) => handleSettingChange("enableEmailNotifications", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaMobile className="text-green-500" />
                        <div>
                          <p className="font-medium text-gray-700">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Send notifications via SMS</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.enableSMSNotifications}
                        onChange={(val) => handleSettingChange("enableSMSNotifications", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaBell className="text-amber-500" />
                        <div>
                          <p className="font-medium text-gray-700">Push Notifications</p>
                          <p className="text-sm text-gray-500">Browser push notifications</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.enablePushNotifications}
                        onChange={(val) => handleSettingChange("enablePushNotifications", val)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Alert Email
                      </label>
                      <input
                        type="email"
                        value={systemSettings.adminAlertEmail}
                        onChange={(e) => handleSettingChange("adminAlertEmail", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Admin Reports</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Daily Summary Reports</p>
                        <p className="text-sm text-gray-500">Receive daily activity summary</p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.sendDailyReports}
                        onChange={(val) => handleSettingChange("sendDailyReports", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Weekly Analytics Reports</p>
                        <p className="text-sm text-gray-500">Receive weekly analytics digest</p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.sendWeeklyReports}
                        onChange={(val) => handleSettingChange("sendWeeklyReports", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaShieldAlt className="text-violet-600" />
                    Security Settings
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={systemSettings.maxLoginAttempts}
                        onChange={(e) =>
                          handleSettingChange("maxLoginAttempts", parseInt(e.target.value))
                        }
                        min={3}
                        max={10}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.lockoutDurationMinutes}
                        onChange={(e) =>
                          handleSettingChange("lockoutDurationMinutes", parseInt(e.target.value))
                        }
                        min={5}
                        max={120}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.sessionTimeoutMinutes}
                        onChange={(e) =>
                          handleSettingChange("sessionTimeoutMinutes", parseInt(e.target.value))
                        }
                        min={15}
                        max={480}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Password Length
                      </label>
                      <input
                        type="number"
                        value={systemSettings.passwordMinLength}
                        onChange={(e) =>
                          handleSettingChange("passwordMinLength", parseInt(e.target.value))
                        }
                        min={6}
                        max={32}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Require Email Verification</p>
                        <p className="text-sm text-gray-500">
                          Users must verify email before access
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.requireEmailVerification}
                        onChange={(val) => handleSettingChange("requireEmailVerification", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Require 2FA for Admins</p>
                        <p className="text-sm text-gray-500">
                          Two-factor authentication for admin accounts
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.require2FA}
                        onChange={(val) => handleSettingChange("require2FA", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Require Special Characters</p>
                        <p className="text-sm text-gray-500">
                          Passwords must include special characters
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.passwordRequireSpecial}
                        onChange={(val) => handleSettingChange("passwordRequireSpecial", val)}
                      />
                    </div>
                  </div>

                  {/* Change Admin Password */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaKey className="text-amber-500" />
                      Change Admin Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        disabled={
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                        className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Verification Settings */}
              {activeTab === "verification" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaUsersCog className="text-violet-600" />
                    Doctor Verification Settings
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.verificationExpiryDays}
                        onChange={(e) =>
                          handleSettingChange("verificationExpiryDays", parseInt(e.target.value))
                        }
                        min={30}
                        max={730}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Days until doctor verification expires and needs renewal
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Auto-approve Verified Doctors</p>
                        <p className="text-sm text-gray-500">
                          Automatically approve doctors with valid credentials
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.autoApproveVerifiedDoctors}
                        onChange={(val) => handleSettingChange("autoApproveVerifiedDoctors", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Require License Verification</p>
                        <p className="text-sm text-gray-500">
                          Doctors must upload medical license
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.requireLicenseVerification}
                        onChange={(val) => handleSettingChange("requireLicenseVerification", val)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Require ID Verification</p>
                        <p className="text-sm text-gray-500">
                          Doctors must upload government-issued ID
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.requireIDVerification}
                        onChange={(val) => handleSettingChange("requireIDVerification", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Settings */}
              {activeTab === "maintenance" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaServer className="text-violet-600" />
                    Maintenance Settings
                  </h2>

                  <div
                    className={`p-4 rounded-xl border-2 ${
                      systemSettings.maintenanceMode
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            systemSettings.maintenanceMode ? "bg-red-500" : "bg-green-500"
                          } animate-pulse`}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {systemSettings.maintenanceMode ? "Maintenance Mode ON" : "System Online"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {systemSettings.maintenanceMode
                              ? "Users cannot access the platform"
                              : "Platform is accessible to all users"}
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={systemSettings.maintenanceMode}
                        onChange={(val) => handleSettingChange("maintenanceMode", val)}
                      />
                    </div>
                  </div>

                  {systemSettings.maintenanceMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maintenance Message
                      </label>
                      <textarea
                        value={systemSettings.maintenanceMessage}
                        onChange={(e) => handleSettingChange("maintenanceMessage", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition resize-none"
                        placeholder="Message displayed to users during maintenance..."
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={systemSettings.backupFrequency}
                        onChange={(e) => handleSettingChange("backupFrequency", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention (days)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.dataRetentionDays}
                        onChange={(e) =>
                          handleSettingChange("dataRetentionDays", parseInt(e.target.value))
                        }
                        min={30}
                        max={3650}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        How long to keep deleted/archived data
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-800">Warning</p>
                        <p className="text-sm text-amber-700">
                          Enabling maintenance mode will immediately restrict access for all users.
                          Only administrators can access the system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Last saved: {new Date().toLocaleString()}
                </p>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save All Settings
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
