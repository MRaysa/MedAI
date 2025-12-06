import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaSave,
  FaEdit,
  FaTimes,
  FaPlus,
  FaTrash,
  FaGraduationCap,
  FaHospital,
  FaIdCard,
  FaMoneyBillWave,
  FaLanguage,
  FaClock,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStethoscope,
  FaVideo,
  FaComments,
  FaStar,
  FaCheckCircle,
  FaSpinner,
  FaCamera,
} from "react-icons/fa";
import { MdVerified, MdPending, MdLocalHospital } from "react-icons/md";

const DoctorProfile = () => {
  const { apiCall, dbUser, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    // User Info
    firstName: "",
    lastName: "",
    displayName: "",
    phone: "",

    // Professional Info
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    npiNumber: "",
    specialization: "General Practice",
    yearsOfExperience: 0,
    bio: "",

    // Practice Info
    practiceInfo: {
      clinicName: "",
      clinicPhone: "",
      clinicEmail: "",
      clinicAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
    },

    // Consultation Settings
    consultationSettings: {
      types: ["in_person"],
      defaultDuration: 30,
      bufferTime: 10,
      maxPatientsPerDay: 20,
    },

    // Fees
    fees: {
      inPersonConsultation: 0,
      videoConsultation: 0,
      phoneConsultation: 0,
      followUpDiscount: 0,
      currency: "USD",
    },

    // Other
    languages: ["English"],
    qualifications: [],
    hospitalAffiliations: [],
    acceptsNewPatients: true,
  });

  // Availability state
  const [availability, setAvailability] = useState({
    monday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { isAvailable: false, slots: [] },
    sunday: { isAvailable: false, slots: [] },
  });

  const specializations = [
    "General Practice",
    "Internal Medicine",
    "Family Medicine",
    "Pediatrics",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery",
    "Urology",
    "Gynecology",
    "Emergency Medicine",
    "Nephrology",
    "Allergy and Immunology",
  ];

  const consultationTypes = [
    { id: "in_person", label: "In-Person", icon: MdLocalHospital },
    { id: "video", label: "Video Call", icon: FaVideo },
    { id: "phone", label: "Phone", icon: FaPhone },
    { id: "chat", label: "Chat", icon: FaComments },
  ];

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/doctors/me/profile");
      if (response.success && response.data) {
        setProfile(response.data);
        populateFormData(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (data) => {
    setFormData({
      firstName: data.user?.firstName || "",
      lastName: data.user?.lastName || "",
      displayName: data.user?.displayName || "",
      phone: data.user?.phone || "",
      licenseNumber: data.licenseNumber || "",
      licenseState: data.licenseState || "",
      licenseExpiry: data.licenseExpiry ? data.licenseExpiry.split("T")[0] : "",
      npiNumber: data.npiNumber || "",
      specialization: data.specialization || "General Practice",
      yearsOfExperience: data.yearsOfExperience || 0,
      bio: data.bio || "",
      practiceInfo: {
        clinicName: data.practiceInfo?.clinicName || "",
        clinicPhone: data.practiceInfo?.clinicPhone || "",
        clinicEmail: data.practiceInfo?.clinicEmail || "",
        clinicAddress: {
          street: data.practiceInfo?.clinicAddress?.street || "",
          city: data.practiceInfo?.clinicAddress?.city || "",
          state: data.practiceInfo?.clinicAddress?.state || "",
          zipCode: data.practiceInfo?.clinicAddress?.zipCode || "",
          country: data.practiceInfo?.clinicAddress?.country || "USA",
        },
      },
      consultationSettings: {
        types: data.consultationSettings?.types || ["in_person"],
        defaultDuration: data.consultationSettings?.defaultDuration || 30,
        bufferTime: data.consultationSettings?.bufferTime || 10,
        maxPatientsPerDay: data.consultationSettings?.maxPatientsPerDay || 20,
      },
      fees: {
        inPersonConsultation: data.fees?.inPersonConsultation || 0,
        videoConsultation: data.fees?.videoConsultation || 0,
        phoneConsultation: data.fees?.phoneConsultation || 0,
        followUpDiscount: data.fees?.followUpDiscount || 0,
        currency: data.fees?.currency || "USD",
      },
      languages: data.languages || ["English"],
      qualifications: data.qualifications || [],
      hospitalAffiliations: data.hospitalAffiliations || [],
      acceptsNewPatients: data.acceptsNewPatients ?? true,
    });

    if (data.availability?.schedule) {
      setAvailability(data.availability.schedule);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      setFormData((prev) => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = type === "checkbox" ? checked : value;
        return updated;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleConsultationTypeToggle = (typeId) => {
    setFormData((prev) => {
      const types = prev.consultationSettings.types.includes(typeId)
        ? prev.consultationSettings.types.filter((t) => t !== typeId)
        : [...prev.consultationSettings.types, typeId];
      return {
        ...prev,
        consultationSettings: {
          ...prev.consultationSettings,
          types,
        },
      };
    });
  };

  const handleLanguageAdd = () => {
    const language = prompt("Enter language:");
    if (language && !formData.languages.includes(language)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
    }
  };

  const handleLanguageRemove = (lang) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleQualificationAdd = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { degree: "", institution: "", year: "" },
      ],
    }));
  };

  const handleQualificationChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.qualifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, qualifications: updated };
    });
  };

  const handleQualificationRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSlotChange = (day, slotIndex, field, value) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      updated[day] = { ...updated[day] };
      updated[day].slots = [...updated[day].slots];
      updated[day].slots[slotIndex] = { ...updated[day].slots[slotIndex], [field]: value };
      return updated;
    });
  };

  const handleAddSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const handleRemoveSlot = (day, index) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      // Save profile data
      const profileResponse = await apiCall("/doctors/me/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      // Save availability separately
      const availabilityResponse = await apiCall("/doctors/me/availability", {
        method: "PUT",
        body: JSON.stringify({ schedule: availability }),
      });

      if (profileResponse.success) {
        setSuccessMessage("Profile updated successfully!");
        setEditMode(false);
        fetchProfile(); // Refresh data
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                  {profile?.user?.photoURL ? (
                    <img
                      src={profile.user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserMd className="text-3xl text-teal-600" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700">
                  <FaCamera className="text-xs" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dr. {formData.firstName} {formData.lastName}
                  </h1>
                  {profile?.verificationStatus === "approved" ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      <MdVerified /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                      <MdPending /> Pending
                    </span>
                  )}
                </div>
                <p className="text-teal-600 font-medium">{formData.specialization}</p>
                <p className="text-gray-500 text-sm">
                  Profile Completeness: {profile?.profileCompleteness || 0}%
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      populateFormData(profile);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <FaCheckCircle /> {successMessage}
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { id: "basic", label: "Basic Info", icon: FaUserMd },
              { id: "professional", label: "Professional", icon: FaIdCard },
              { id: "practice", label: "Practice", icon: FaHospital },
              { id: "consultation", label: "Consultation", icon: FaStethoscope },
              { id: "availability", label: "Availability", icon: FaClock },
              { id: "fees", label: "Fees", icon: FaMoneyBillWave },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="e.g., Dr. John Smith"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio / About Me
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      placeholder="Tell patients about yourself, your experience, and approach to healthcare..."
                    />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                      >
                        {lang}
                        {editMode && (
                          <button
                            onClick={() => handleLanguageRemove(lang)}
                            className="hover:text-red-600"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        )}
                      </span>
                    ))}
                    {editMode && (
                      <button
                        onClick={handleLanguageAdd}
                        className="flex items-center gap-1 px-3 py-1 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-teal-500 hover:text-teal-600"
                      >
                        <FaPlus /> Add Language
                      </button>
                    )}
                  </div>
                </div>

                {/* Accepts New Patients */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="acceptsNewPatients"
                    name="acceptsNewPatients"
                    checked={formData.acceptsNewPatients}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="acceptsNewPatients" className="text-gray-700">
                    I am currently accepting new patients
                  </label>
                </div>
              </motion.div>
            )}

            {/* Professional Tab */}
            {activeTab === "professional" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    >
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="0"
                      placeholder="e.g., 10"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="e.g., MD123456"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License State
                    </label>
                    <input
                      type="text"
                      name="licenseState"
                      value={formData.licenseState}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="e.g., California, NY"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NPI Number
                    </label>
                    <input
                      type="text"
                      name="npiNumber"
                      value={formData.npiNumber}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="e.g., 1234567890"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Qualifications / Degrees
                    </label>
                    {editMode && (
                      <button
                        onClick={handleQualificationAdd}
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm"
                      >
                        <FaPlus /> Add Qualification
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {formData.qualifications.length === 0 ? (
                      <p className="text-gray-500 text-sm">No qualifications added yet.</p>
                    ) : (
                      formData.qualifications.map((qual, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Degree (e.g., MBBS, MD)"
                              value={qual.degree}
                              onChange={(e) =>
                                handleQualificationChange(index, "degree", e.target.value)
                              }
                              disabled={!editMode}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Institution"
                              value={qual.institution}
                              onChange={(e) =>
                                handleQualificationChange(index, "institution", e.target.value)
                              }
                              disabled={!editMode}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Year"
                              value={qual.year}
                              onChange={(e) =>
                                handleQualificationChange(index, "year", e.target.value)
                              }
                              disabled={!editMode}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-100"
                            />
                          </div>
                          {editMode && (
                            <button
                              onClick={() => handleQualificationRemove(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Practice Tab */}
            {activeTab === "practice" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic / Hospital Name
                    </label>
                    <input
                      type="text"
                      name="practiceInfo.clinicName"
                      value={formData.practiceInfo.clinicName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="e.g., City Medical Center"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Phone
                    </label>
                    <input
                      type="tel"
                      name="practiceInfo.clinicPhone"
                      value={formData.practiceInfo.clinicPhone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="+1 (555) 987-6543"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Email
                    </label>
                    <input
                      type="email"
                      name="practiceInfo.clinicEmail"
                      value={formData.practiceInfo.clinicEmail}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="clinic@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Clinic Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="practiceInfo.clinicAddress.street"
                        value={formData.practiceInfo.clinicAddress.street}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="123 Medical Drive, Suite 100"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="practiceInfo.clinicAddress.city"
                        value={formData.practiceInfo.clinicAddress.city}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., Los Angeles"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="practiceInfo.clinicAddress.state"
                        value={formData.practiceInfo.clinicAddress.state}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., California"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="practiceInfo.clinicAddress.zipCode"
                        value={formData.practiceInfo.clinicAddress.zipCode}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., 90001"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="practiceInfo.clinicAddress.country"
                        value={formData.practiceInfo.clinicAddress.country}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., USA"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Consultation Tab */}
            {activeTab === "consultation" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Consultation Types Offered
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {consultationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => editMode && handleConsultationTypeToggle(type.id)}
                        disabled={!editMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                          formData.consultationSettings.types.includes(type.id)
                            ? "bg-teal-50 border-teal-500 text-teal-700"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        } ${!editMode ? "cursor-default" : "cursor-pointer hover:border-teal-400"}`}
                      >
                        <type.icon />
                        {type.label}
                        {formData.consultationSettings.types.includes(type.id) && (
                          <FaCheckCircle className="text-teal-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Appointment Duration (mins)
                    </label>
                    <select
                      name="consultationSettings.defaultDuration"
                      value={formData.consultationSettings.defaultDuration}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buffer Time Between Appointments (mins)
                    </label>
                    <select
                      name="consultationSettings.bufferTime"
                      value={formData.consultationSettings.bufferTime}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Patients Per Day
                    </label>
                    <input
                      type="number"
                      name="consultationSettings.maxPatientsPerDay"
                      value={formData.consultationSettings.maxPatientsPerDay}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="1"
                      max="100"
                      placeholder="e.g., 20"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-sm text-gray-500 mb-4">
                  Set your weekly availability schedule. Patients will be able to book appointments during these hours.
                </p>
                {days.map((day) => (
                  <div
                    key={day}
                    className={`p-4 rounded-lg border ${
                      availability[day].isAvailable
                        ? "bg-white border-gray-200"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={availability[day].isAvailable}
                          onChange={(e) =>
                            handleAvailabilityChange(day, "isAvailable", e.target.checked)
                          }
                          disabled={!editMode}
                          className="w-5 h-5 text-teal-600 rounded"
                        />
                        <span className="font-medium text-gray-900 capitalize">{day}</span>
                      </div>
                      {availability[day].isAvailable && editMode && (
                        <button
                          onClick={() => handleAddSlot(day)}
                          className="text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1"
                        >
                          <FaPlus /> Add Slot
                        </button>
                      )}
                    </div>
                    {availability[day].isAvailable && (
                      <div className="space-y-2 ml-8">
                        {availability[day].slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) =>
                                handleSlotChange(day, idx, "start", e.target.value)
                              }
                              disabled={!editMode}
                              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-100"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) =>
                                handleSlotChange(day, idx, "end", e.target.value)
                              }
                              disabled={!editMode}
                              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-100"
                            />
                            {editMode && availability[day].slots.length > 1 && (
                              <button
                                onClick={() => handleRemoveSlot(day, idx)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Fees Tab */}
            {activeTab === "fees" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      In-Person Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="fees.inPersonConsultation"
                      value={formData.fees.inPersonConsultation}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="0"
                      placeholder="e.g., 150"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="fees.videoConsultation"
                      value={formData.fees.videoConsultation}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="0"
                      placeholder="e.g., 100"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="fees.phoneConsultation"
                      value={formData.fees.phoneConsultation}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="0"
                      placeholder="e.g., 75"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follow-up Discount (%)
                    </label>
                    <input
                      type="number"
                      name="fees.followUpDiscount"
                      value={formData.fees.followUpDiscount}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      min="0"
                      max="100"
                      placeholder="e.g., 20"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <h4 className="font-medium text-teal-900 mb-2">Fee Summary</h4>
                  <div className="space-y-1 text-sm text-teal-800">
                    <p>In-Person: ${formData.fees.inPersonConsultation}</p>
                    <p>Video: ${formData.fees.videoConsultation}</p>
                    <p>Phone: ${formData.fees.phoneConsultation}</p>
                    {formData.fees.followUpDiscount > 0 && (
                      <p>Follow-up visits get {formData.fees.followUpDiscount}% discount</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Your Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{profile.stats?.totalPatients || 0}</p>
                <p className="text-sm text-gray-500">Total Patients</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{profile.stats?.completedAppointments || 0}</p>
                <p className="text-sm text-gray-500">Completed Appointments</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1">
                  <FaStar /> {profile.ratings?.average?.toFixed(1) || "0.0"}
                </p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{profile.ratings?.count || 0}</p>
                <p className="text-sm text-gray-500">Total Reviews</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
