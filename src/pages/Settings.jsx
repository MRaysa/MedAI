import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
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
  FaToggleOn,
  FaToggleOff,
  FaArrowLeft,
  FaUserMd,
  FaCalendarAlt,
  FaHeartbeat,
  FaPills,
  FaHistory,
  FaDownload,
  FaUpload,
  FaLink,
  FaMobile,
  FaDesktop,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { MdHealthAndSafety, MdNotifications, MdSecurity, MdPrivacyTip } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  const { user, dbUser, signOutUser, apiCall } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Settings state
  const [settings, setSettings] = useState({
    // Account settings
    displayName: "",
    email: "",
    phone: "",
    photoURL: "",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    healthTipsNotifications: true,
    labResultsNotifications: true,
    billingNotifications: true,
    marketingEmails: false,
    reminderTime: "24", // hours before

    // Privacy settings
    profileVisibility: "private",
    shareDataWithDoctors: true,
    shareAnonymousData: false,
    showOnlineStatus: true,

    // Appearance settings
    theme: "light",
    fontSize: "medium",
    language: "en",
    timezone: "America/New_York",

    // Security settings
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30", // minutes
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
    { id: "account", label: "Account", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: MdPrivacyTip },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "security", label: "Security", icon: FaShieldAlt },
  ];

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await apiCall('/users/me');
        if (response.success && response.user) {
          const userData = response.user;
          setSettings(prev => ({
            ...prev,
            displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email || "",
            phone: userData.phone || "",
            photoURL: userData.photoURL || "",
            // Spread saved settings
            ...(userData.settings || {})
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, apiCall]);

  // Also update from dbUser if available
  useEffect(() => {
    if (dbUser) {
      setSettings(prev => ({
        ...prev,
        displayName: dbUser.displayName || `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim(),
        email: dbUser.email || "",
        phone: dbUser.phone || "",
        photoURL: dbUser.photoURL || "",
        ...(dbUser.settings || {}),
      }));
    }
  }, [dbUser]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save profile changes (display name, phone)
  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await apiCall('/users/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: settings.displayName,
          phone: settings.phone,
        })
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await apiCall('/users/me/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: {
            emailNotifications: settings.emailNotifications,
            pushNotifications: settings.pushNotifications,
            smsNotifications: settings.smsNotifications,
            appointmentReminders: settings.appointmentReminders,
            medicationReminders: settings.medicationReminders,
            healthTipsNotifications: settings.healthTipsNotifications,
            labResultsNotifications: settings.labResultsNotifications,
            billingNotifications: settings.billingNotifications,
            marketingEmails: settings.marketingEmails,
            reminderTime: settings.reminderTime,
            profileVisibility: settings.profileVisibility,
            shareDataWithDoctors: settings.shareDataWithDoctors,
            shareAnonymousData: settings.shareAnonymousData,
            showOnlineStatus: settings.showOnlineStatus,
            theme: settings.theme,
            fontSize: settings.fontSize,
            language: settings.language,
            timezone: settings.timezone,
            twoFactorEnabled: settings.twoFactorEnabled,
            loginAlerts: settings.loginAlerts,
            sessionTimeout: settings.sessionTimeout,
          }
        })
      });

      if (response.success) {
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to save settings. Please try again.");
      console.error("Error saving settings:", error);
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
      // Import Firebase auth functions
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setSuccessMessage("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      if (error.code === 'auth/wrong-password') {
        setErrorMessage("Current password is incorrect.");
      } else if (error.code === 'auth/requires-recent-login') {
        setErrorMessage("Please sign out and sign in again before changing password.");
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Account deletion logic
      alert("Please contact support to delete your account.");
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-teal-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaCog className="text-6xl text-gray-300 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Please sign in to access settings</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="text-6xl text-teal-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition mb-4"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
              <FaCog className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500">Manage your account preferences</p>
            </div>
          </div>
        </div>

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
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
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
              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-teal-600" />
                    Account Settings
                  </h2>

                  {/* Profile Photo */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {settings.photoURL ? (
                        <img
                          src={settings.photoURL}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-teal-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                          <FaUser className="text-3xl text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{settings.displayName || "User"}</h3>
                      <p className="text-gray-500 text-sm">{settings.email}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">{dbUser?.role || "Patient"}</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => handleSettingChange("displayName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={settings.email}
                          disabled
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={settings.phone}
                          onChange={(e) => handleSettingChange("phone", e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
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
                          value={settings.timezone}
                          onChange={(e) => handleSettingChange("timezone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition appearance-none"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Asia/Kolkata">India Standard Time (IST)</option>
                          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Update Profile Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                      <FaExclamationTriangle />
                      Danger Zone
                    </h3>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete Account
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      This will permanently delete your account and all associated data.
                    </p>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaBell className="text-teal-600" />
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Notification Channels */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaEnvelope className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">Email Notifications</p>
                              <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.emailNotifications}
                            onChange={(val) => handleSettingChange("emailNotifications", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaMobile className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">Push Notifications</p>
                              <p className="text-sm text-gray-500">Browser and app notifications</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.pushNotifications}
                            onChange={(val) => handleSettingChange("pushNotifications", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaPhone className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">SMS Notifications</p>
                              <p className="text-sm text-gray-500">Receive text messages</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.smsNotifications}
                            onChange={(val) => handleSettingChange("smsNotifications", val)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Health Notifications */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MdHealthAndSafety className="text-teal-500" />
                        Health Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-blue-400" />
                            <div>
                              <p className="font-medium text-gray-700">Appointment Reminders</p>
                              <p className="text-sm text-gray-500">Remind me about upcoming appointments</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.appointmentReminders}
                            onChange={(val) => handleSettingChange("appointmentReminders", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaPills className="text-purple-400" />
                            <div>
                              <p className="font-medium text-gray-700">Medication Reminders</p>
                              <p className="text-sm text-gray-500">Remind me to take medications</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.medicationReminders}
                            onChange={(val) => handleSettingChange("medicationReminders", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaHeartbeat className="text-red-400" />
                            <div>
                              <p className="font-medium text-gray-700">Health Tips</p>
                              <p className="text-sm text-gray-500">Personalized wellness recommendations</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.healthTipsNotifications}
                            onChange={(val) => handleSettingChange("healthTipsNotifications", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MdHealthAndSafety className="text-teal-400" />
                            <div>
                              <p className="font-medium text-gray-700">Lab Results</p>
                              <p className="text-sm text-gray-500">Notify when lab results are ready</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.labResultsNotifications}
                            onChange={(val) => handleSettingChange("labResultsNotifications", val)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Other Notifications */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Other Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaHistory className="text-green-400" />
                            <div>
                              <p className="font-medium text-gray-700">Billing Notifications</p>
                              <p className="text-sm text-gray-500">Payment and billing updates</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.billingNotifications}
                            onChange={(val) => handleSettingChange("billingNotifications", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaEnvelope className="text-amber-400" />
                            <div>
                              <p className="font-medium text-gray-700">Marketing Emails</p>
                              <p className="text-sm text-gray-500">News, promotions, and updates</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.marketingEmails}
                            onChange={(val) => handleSettingChange("marketingEmails", val)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reminder Timing */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Reminder Timing</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appointment reminder before
                        </label>
                        <select
                          value={settings.reminderTime}
                          onChange={(e) => handleSettingChange("reminderTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                        >
                          <option value="1">1 hour before</option>
                          <option value="2">2 hours before</option>
                          <option value="6">6 hours before</option>
                          <option value="12">12 hours before</option>
                          <option value="24">24 hours before</option>
                          <option value="48">48 hours before</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdPrivacyTip className="text-teal-600" />
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Profile Visibility */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={settings.profileVisibility === "private"}
                            onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                            className="w-4 h-4 text-teal-600"
                          />
                          <div>
                            <p className="font-medium text-gray-700">Private</p>
                            <p className="text-sm text-gray-500">Only you and your doctors can view your profile</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="radio"
                            name="visibility"
                            value="doctors_only"
                            checked={settings.profileVisibility === "doctors_only"}
                            onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                            className="w-4 h-4 text-teal-600"
                          />
                          <div>
                            <p className="font-medium text-gray-700">Doctors Only</p>
                            <p className="text-sm text-gray-500">Verified doctors can view your profile</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Data Sharing */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Data Sharing</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaUserMd className="text-blue-400" />
                            <div>
                              <p className="font-medium text-gray-700">Share with Doctors</p>
                              <p className="text-sm text-gray-500">Allow doctors to access your health records</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.shareDataWithDoctors}
                            onChange={(val) => handleSettingChange("shareDataWithDoctors", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaShieldAlt className="text-purple-400" />
                            <div>
                              <p className="font-medium text-gray-700">Anonymous Data for Research</p>
                              <p className="text-sm text-gray-500">Contribute anonymized data to improve healthcare</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.shareAnonymousData}
                            onChange={(val) => handleSettingChange("shareAnonymousData", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaEye className="text-green-400" />
                            <div>
                              <p className="font-medium text-gray-700">Show Online Status</p>
                              <p className="text-sm text-gray-500">Let others see when you're online</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={settings.showOnlineStatus}
                            onChange={(val) => handleSettingChange("showOnlineStatus", val)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Data Management</h3>
                      <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-700">
                          <FaDownload className="text-teal-500" />
                          Download My Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-700">
                          <FaHistory className="text-blue-500" />
                          View Activity Log
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaPalette className="text-teal-600" />
                    Appearance Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Theme */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => handleSettingChange("theme", "light")}
                          className={`p-4 rounded-xl border-2 transition ${
                            settings.theme === "light"
                              ? 'border-teal-500 bg-white'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <FaSun className={`text-2xl mx-auto mb-2 ${settings.theme === "light" ? 'text-amber-500' : 'text-gray-400'}`} />
                          <p className="font-medium text-gray-700">Light</p>
                        </button>
                        <button
                          onClick={() => handleSettingChange("theme", "dark")}
                          className={`p-4 rounded-xl border-2 transition ${
                            settings.theme === "dark"
                              ? 'border-teal-500 bg-gray-800'
                              : 'border-gray-200 bg-gray-800 hover:border-gray-300'
                          }`}
                        >
                          <FaMoon className={`text-2xl mx-auto mb-2 ${settings.theme === "dark" ? 'text-purple-400' : 'text-gray-400'}`} />
                          <p className={`font-medium ${settings.theme === "dark" ? 'text-white' : 'text-gray-300'}`}>Dark</p>
                        </button>
                        <button
                          onClick={() => handleSettingChange("theme", "system")}
                          className={`p-4 rounded-xl border-2 transition ${
                            settings.theme === "system"
                              ? 'border-teal-500 bg-gradient-to-br from-white to-gray-800'
                              : 'border-gray-200 bg-gradient-to-br from-white to-gray-800 hover:border-gray-300'
                          }`}
                        >
                          <FaDesktop className={`text-2xl mx-auto mb-2 ${settings.theme === "system" ? 'text-teal-500' : 'text-gray-400'}`} />
                          <p className="font-medium text-gray-500">System</p>
                        </button>
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Font Size</h3>
                      <div className="flex gap-4">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSettingChange("fontSize", size)}
                            className={`flex-1 p-3 rounded-xl border-2 transition ${
                              settings.fontSize === size
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-medium capitalize ${
                              size === "small" ? "text-sm" : size === "large" ? "text-lg" : "text-base"
                            }`}>{size}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Language</h3>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaShieldAlt className="text-teal-600" />
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Change Password */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaKey className="text-amber-500" />
                        Change Password
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
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
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
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaMobile className="text-blue-400 text-xl" />
                          <div>
                            <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={settings.twoFactorEnabled}
                          onChange={(val) => handleSettingChange("twoFactorEnabled", val)}
                        />
                      </div>
                    </div>

                    {/* Login Alerts */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaBell className="text-amber-400 text-xl" />
                          <div>
                            <p className="font-semibold text-gray-900">Login Alerts</p>
                            <p className="text-sm text-gray-500">Get notified of new sign-ins to your account</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={settings.loginAlerts}
                          onChange={(val) => handleSettingChange("loginAlerts", val)}
                        />
                      </div>
                    </div>

                    {/* Session Timeout */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Session Timeout</h3>
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="never">Never</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Automatically sign out after a period of inactivity
                      </p>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaDesktop className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">Current Session</p>
                              <p className="text-sm text-gray-500">Windows - Chrome</p>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                        </div>
                      </div>
                      <button className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
                        Sign out of all other sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
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

export default Settings;
