import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUser,
  FaHeart,
  FaHeartbeat,
  FaTint,
  FaWeight,
  FaRulerVertical,
  FaThermometerHalf,
  FaLungs,
  FaSave,
  FaEdit,
  FaTimes,
  FaPlus,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaAllergies,
  FaPills,
  FaNotesMedical,
  FaShieldAlt,
  FaUserMd,
  FaFileMedical,
  FaIdCard,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronRight,
  FaHistory,
  FaSyringe,
  FaStethoscope,
  FaChartLine,
  FaBell,
  FaCog,
  FaArrowLeft,
  FaPercentage,
  FaRunning,
  FaBrain,
  FaAppleAlt,
  FaBed,
  FaWalking,
} from "react-icons/fa";
import { MdHealthAndSafety, MdMonitorHeart, MdBloodtype, MdEmergency } from "react-icons/md";
import { GiMedicines, GiHealthNormal, GiLungs } from "react-icons/gi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiBody, BiPulse } from "react-icons/bi";
import { IoFitness, IoWater } from "react-icons/io5";
import { RiMentalHealthLine, RiHeartPulseLine } from "react-icons/ri";

const PatientProfile = () => {
  const { id } = useParams(); // For admin/doctor viewing specific patient
  const { apiCall, dbUser, isAdmin, isDoctor, isPatient } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [successMessage, setSuccessMessage] = useState("");

  // Determine if viewing own profile or another patient's profile
  const isOwnProfile = !id && isPatient;
  const viewingAsAdmin = isAdmin && id;
  const viewingAsDoctor = isDoctor && id;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    medicalInfo: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      familyHistory: [],
      surgicalHistory: [],
      immunizations: [],
    },
    vitals: {
      height: "",
      weight: "",
      bmi: "",
    },
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      subscriberName: "",
      subscriberRelation: "self",
    },
    preferences: {
      preferredLanguage: "en",
      preferredContactMethod: "email",
      appointmentReminders: true,
      medicationReminders: true,
      healthTipsNotifications: true,
    },
  });

  // New item inputs
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];
  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      let response;
      if (id) {
        // Admin/Doctor viewing specific patient
        response = await apiCall(`/patients/${id}`);
      } else {
        // Patient viewing own profile
        response = await apiCall("/patients/me/profile");
      }

      if (response.success && response.data) {
        setProfile(response.data);
        populateForm(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data) => {
    setFormData({
      firstName: data.user?.firstName || "",
      lastName: data.user?.lastName || "",
      displayName: data.user?.displayName || "",
      phone: data.user?.phone || "",
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
      gender: data.gender || "",
      bloodType: data.bloodType || "Unknown",
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zipCode || "",
        country: data.address?.country || "USA",
      },
      emergencyContact: {
        name: data.emergencyContact?.name || "",
        relationship: data.emergencyContact?.relationship || "",
        phone: data.emergencyContact?.phone || "",
        email: data.emergencyContact?.email || "",
      },
      medicalInfo: {
        allergies: data.medicalInfo?.allergies || [],
        chronicConditions: data.medicalInfo?.chronicConditions || [],
        currentMedications: data.medicalInfo?.currentMedications || [],
        familyHistory: data.medicalInfo?.familyHistory || [],
        surgicalHistory: data.medicalInfo?.surgicalHistory || [],
        immunizations: data.medicalInfo?.immunizations || [],
      },
      vitals: {
        height: data.vitals?.height || "",
        weight: data.vitals?.weight || "",
        bmi: data.vitals?.bmi || "",
      },
      insurance: {
        provider: data.insurance?.provider || "",
        policyNumber: data.insurance?.policyNumber || "",
        groupNumber: data.insurance?.groupNumber || "",
        subscriberName: data.insurance?.subscriberName || "",
        subscriberRelation: data.insurance?.subscriberRelation || "self",
      },
      preferences: {
        preferredLanguage: data.preferences?.preferredLanguage || "en",
        preferredContactMethod: data.preferences?.preferredContactMethod || "email",
        appointmentReminders: data.preferences?.appointmentReminders ?? true,
        medicationReminders: data.preferences?.medicationReminders ?? true,
        healthTipsNotifications: data.preferences?.healthTipsNotifications ?? true,
      },
    });
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addToList = (section, field, value, setter) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...prev[section][field], value.trim()],
        },
      }));
      setter("");
    }
  };

  const removeFromList = (section, field, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiCall("/patients/me/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setEditMode(false);
        fetchProfile();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getHealthScore = () => {
    // Calculate a simple health score based on profile completeness and vitals
    let score = profile?.profileCompleteness || 0;
    if (profile?.vitals?.bmi) {
      const bmi = profile.vitals.bmi;
      if (bmi >= 18.5 && bmi <= 24.9) score += 20;
      else if (bmi >= 25 && bmi <= 29.9) score += 10;
    }
    return Math.min(score, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading health profile...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // PATIENT VIEW - "My Health Profile"
  // ============================================
  if (isOwnProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Decorative Elements */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-blue-200/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
              >
                <FaCheckCircle />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/patient/dashboard" className="hover:text-blue-600 transition">
                Dashboard
              </Link>
              <FaChevronRight className="text-xs" />
              <span className="text-gray-900">My Health Profile</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-purple-500/25">
                    {profile?.user?.firstName?.[0] || "P"}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaHeart className="text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    My Health Profile
                    <HiSparkles className="text-yellow-500" />
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back, {profile?.user?.firstName || "there"}! Track your health journey.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition font-medium shadow-lg shadow-purple-500/25"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        populateForm(profile);
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-medium shadow-lg shadow-green-500/25 disabled:opacity-50"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Health Score & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {/* Health Score Card */}
            <div className="md:col-span-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <p className="text-blue-100 text-sm mb-2">Health Score</p>
                <div className="text-5xl font-bold mb-2">{getHealthScore()}%</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getHealthScore()}%` }}
                  />
                </div>
                <p className="text-blue-100 text-sm mt-3">Profile Completeness</p>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <MdBloodtype className="text-2xl text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="text-xl font-bold text-gray-900">{profile?.bloodType || "Unknown"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BiBody className="text-2xl text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-xl font-bold text-gray-900">
                    {profile?.vitals?.bmi || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaBirthdayCake className="text-2xl text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateAge(profile?.dateOfBirth)} years
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {[
              { id: "overview", label: "Overview", icon: MdHealthAndSafety },
              { id: "medical", label: "Medical Info", icon: FaNotesMedical },
              { id: "vitals", label: "Vitals", icon: FaHeartbeat },
              { id: "emergency", label: "Emergency", icon: MdEmergency },
              { id: "insurance", label: "Insurance", icon: FaShieldAlt },
              { id: "settings", label: "Preferences", icon: FaCog },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    {editMode ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange(null, "firstName", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange(null, "lastName", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange(null, "dateOfBirth", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Gender
                            </label>
                            <select
                              value={formData.gender}
                              onChange={(e) => handleInputChange(null, "gender", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Gender</option>
                              {genders.map((g) => (
                                <option key={g.value} value={g.value}>
                                  {g.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Blood Type
                            </label>
                            <select
                              value={formData.bloodType}
                              onChange={(e) => handleInputChange(null, "bloodType", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {bloodTypes.map((bt) => (
                                <option key={bt} value={bt}>
                                  {bt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange(null, "phone", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">
                            {profile?.user?.firstName} {profile?.user?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium">
                            {profile?.dateOfBirth
                              ? new Date(profile.dateOfBirth).toLocaleDateString()
                              : "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium capitalize">{profile?.gender || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile?.user?.phone || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile?.user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blood Type</p>
                          <p className="font-medium">{profile?.bloodType || "Unknown"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    Address
                  </h3>
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => handleInputChange("address", "street", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange("address", "city", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => handleInputChange("address", "state", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={formData.address.zipCode}
                          onChange={(e) => handleInputChange("address", "zipCode", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      {profile?.address?.street ? (
                        <>
                          <p>{profile.address.street}</p>
                          <p>
                            {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                          </p>
                          <p>{profile.address.country}</p>
                        </>
                      ) : (
                        <p className="text-gray-400">No address set</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Health Insights */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiSparkles className="text-yellow-500" />
                    AI Health Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FaAppleAlt className="text-green-500" />
                        </div>
                        <p className="font-medium text-gray-900">Nutrition</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Track your diet and get personalized recommendations
                      </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaRunning className="text-blue-500" />
                        </div>
                        <p className="font-medium text-gray-900">Activity</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Monitor your physical activity and exercise
                      </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FaBed className="text-purple-500" />
                        </div>
                        <p className="font-medium text-gray-900">Sleep</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Analyze sleep patterns for better rest
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Info Tab */}
            {activeTab === "medical" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Allergies */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaAllergies className="text-red-500" />
                    Allergies
                  </h3>
                  {editMode && (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add allergy..."
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addToList("medicalInfo", "allergies", newAllergy, setNewAllergy)
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addToList("medicalInfo", "allergies", newAllergy, setNewAllergy)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalInfo.allergies.length > 0 ? (
                      formData.medicalInfo.allergies.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {item}
                          {editMode && (
                            <button
                              onClick={() => removeFromList("medicalInfo", "allergies", index)}
                              className="hover:text-red-900"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No allergies recorded</p>
                    )}
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaNotesMedical className="text-orange-500" />
                    Chronic Conditions
                  </h3>
                  {editMode && (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add condition..."
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addToList("medicalInfo", "chronicConditions", newCondition, setNewCondition)
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() =>
                          addToList("medicalInfo", "chronicConditions", newCondition, setNewCondition)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalInfo.chronicConditions.length > 0 ? (
                      formData.medicalInfo.chronicConditions.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {item}
                          {editMode && (
                            <button
                              onClick={() => removeFromList("medicalInfo", "chronicConditions", index)}
                              className="hover:text-orange-900"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No conditions recorded</p>
                    )}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaPills className="text-purple-500" />
                    Current Medications
                  </h3>
                  {editMode && (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add medication..."
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addToList("medicalInfo", "currentMedications", newMedication, setNewMedication)
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() =>
                          addToList("medicalInfo", "currentMedications", newMedication, setNewMedication)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalInfo.currentMedications.length > 0 ? (
                      formData.medicalInfo.currentMedications.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {item}
                          {editMode && (
                            <button
                              onClick={() => removeFromList("medicalInfo", "currentMedications", index)}
                              className="hover:text-purple-900"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No medications recorded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vitals Tab */}
            {activeTab === "vitals" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaRulerVertical className="text-xl text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      {editMode ? (
                        <input
                          type="number"
                          placeholder="cm"
                          value={formData.vitals.height}
                          onChange={(e) => handleInputChange("vitals", "height", e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {profile?.vitals?.height || "N/A"} cm
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaWeight className="text-xl text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      {editMode ? (
                        <input
                          type="number"
                          placeholder="kg"
                          value={formData.vitals.weight}
                          onChange={(e) => handleInputChange("vitals", "weight", e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {profile?.vitals?.weight || "N/A"} kg
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BiBody className="text-xl text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">BMI</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile?.vitals?.bmi || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FaHeartbeat className="text-xl text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile?.vitals?.bloodPressure?.systolic
                          ? `${profile.vitals.bloodPressure.systolic}/${profile.vitals.bloodPressure.diastolic}`
                          : "N/A"}{" "}
                        mmHg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <RiHeartPulseLine className="text-xl text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile?.vitals?.heartRate?.value || "N/A"} bpm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <FaLungs className="text-xl text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Oxygen Saturation</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile?.vitals?.oxygenSaturation?.value || "N/A"}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === "emergency" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MdEmergency className="text-red-500" />
                  Emergency Contact
                </h3>
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange("emergencyContact", "name", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) =>
                          handleInputChange("emergencyContact", "relationship", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange("emergencyContact", "phone", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.emergencyContact.email}
                        onChange={(e) => handleInputChange("emergencyContact", "email", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.emergencyContact?.name ? (
                      <>
                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-red-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {profile.emergencyContact.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {profile.emergencyContact.relationship}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-gray-400" />
                          <span>{profile.emergencyContact.phone || "No phone"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-gray-400" />
                          <span>{profile.emergencyContact.email || "No email"}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-3" />
                        <p className="text-gray-600">No emergency contact set</p>
                        <p className="text-sm text-gray-400">
                          Add an emergency contact for safety
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Insurance Tab */}
            {activeTab === "insurance" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-500" />
                  Insurance Information
                </h3>
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        value={formData.insurance.provider}
                        onChange={(e) => handleInputChange("insurance", "provider", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          value={formData.insurance.policyNumber}
                          onChange={(e) =>
                            handleInputChange("insurance", "policyNumber", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Group Number
                        </label>
                        <input
                          type="text"
                          value={formData.insurance.groupNumber}
                          onChange={(e) =>
                            handleInputChange("insurance", "groupNumber", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.insurance?.provider ? (
                      <>
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-lg font-semibold text-gray-900">
                            {profile.insurance.provider}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Policy Number</p>
                            <p className="font-medium">{profile.insurance.policyNumber || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Group Number</p>
                            <p className="font-medium">{profile.insurance.groupNumber || "N/A"}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FaIdCard className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No insurance information</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCog className="text-gray-500" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>Appointment Reminders</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences.appointmentReminders}
                      onChange={(e) =>
                        handleInputChange("preferences", "appointmentReminders", e.target.checked)
                      }
                      disabled={!editMode}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <FaPills className="text-purple-500" />
                      <span>Medication Reminders</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences.medicationReminders}
                      onChange={(e) =>
                        handleInputChange("preferences", "medicationReminders", e.target.checked)
                      }
                      disabled={!editMode}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <HiSparkles className="text-yellow-500" />
                      <span>Health Tips & Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences.healthTipsNotifications}
                      onChange={(e) =>
                        handleInputChange("preferences", "healthTipsNotifications", e.target.checked)
                      }
                      disabled={!editMode}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN/DOCTOR VIEW - Patient Medical Profile
  // ============================================
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
            <Link
              to={isAdmin ? "/admin/users" : "/doctor/dashboard"}
              className="hover:text-teal-600 transition flex items-center gap-2"
            >
              <FaArrowLeft />
              Back
            </Link>
            <span>/</span>
            <span className="text-gray-900">Patient Profile</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profile?.user?.firstName?.[0] || "P"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.user?.firstName} {profile?.user?.lastName}
                </h1>
                <p className="text-gray-600">{profile?.user?.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    <FaBirthdayCake className="inline mr-1" />
                    {calculateAge(profile?.dateOfBirth)} years old
                  </span>
                  <span className="text-sm text-gray-500">
                    <MdBloodtype className="inline mr-1" />
                    {profile?.bloodType || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medical Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allergies & Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Important Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.medicalInfo?.allergies?.length > 0 ? (
                      profile.medicalInfo.allergies.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">None recorded</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.medicalInfo?.chronicConditions?.length > 0 ? (
                      profile.medicalInfo.chronicConditions.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">None recorded</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Current Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaPills className="text-purple-500" />
                Current Medications
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.medicalInfo?.currentMedications?.length > 0 ? (
                  profile.medicalInfo.currentMedications.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No medications recorded</span>
                )}
              </div>
            </motion.div>

            {/* Vitals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-teal-500" />
                Latest Vitals
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.vitals?.height || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Height (cm)</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.vitals?.weight || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Weight (kg)</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">{profile?.vitals?.bmi || "N/A"}</p>
                  <p className="text-sm text-gray-500">BMI</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.vitals?.bloodPressure?.systolic
                      ? `${profile.vitals.bloodPressure.systolic}/${profile.vitals.bloodPressure.diastolic}`
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <span>{profile?.user?.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="truncate">{profile?.user?.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <span>
                    {profile?.address?.city
                      ? `${profile.address.city}, ${profile.address.state}`
                      : "No address"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-red-50 rounded-2xl border border-red-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdEmergency className="text-red-500" />
                Emergency Contact
              </h3>
              {profile?.emergencyContact?.name ? (
                <div className="space-y-2">
                  <p className="font-semibold">{profile.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">{profile.emergencyContact.relationship}</p>
                  <p className="text-sm">{profile.emergencyContact.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No emergency contact set</p>
              )}
            </motion.div>

            {/* Insurance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-blue-500" />
                Insurance
              </h3>
              {profile?.insurance?.provider ? (
                <div className="space-y-2">
                  <p className="font-semibold">{profile.insurance.provider}</p>
                  <p className="text-sm text-gray-600">Policy: {profile.insurance.policyNumber}</p>
                  <p className="text-sm text-gray-600">Group: {profile.insurance.groupNumber}</p>
                </div>
              ) : (
                <p className="text-gray-500">No insurance information</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
