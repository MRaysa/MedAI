import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaHeartbeat,
  FaShieldAlt,
  FaUserMd,
  FaBrain,
  FaCamera,
  FaCheck,
  FaStethoscope,
  FaUserInjured,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdHealthAndSafety, MdEmail, MdVerified } from "react-icons/md";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { ROLES } from "../contexts/AuthProvider";

const SignUp = () => {
  const { createUser, googleSignIn, loading, authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    photoURL: "",
    phone: "",
    role: ROLES.PATIENT, // Default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters with uppercase and lowercase";
    }
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (formData.photoURL && !isValidUrl(formData.photoURL)) {
      newErrors.photoURL = "Please enter a valid image URL";
    }

    setErrors(newErrors);

    // Log validation errors for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoURL: url }));

    if (isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, validating...");
    console.log("Form data:", { ...formData, password: "***hidden***" });
    if (!validateForm()) {
      console.log("Validation failed, errors:", errors);
      return;
    }
    console.log("Validation passed, creating user...");

    setIsSubmitting(true);
    try {
      const result = await createUser(formData.email, formData.password, formData.role, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        photoURL: formData.photoURL,
      });

      // Store registration data and show success modal
      setRegistrationData({
        role: formData.role,
        email: formData.email,
        firstName: formData.firstName,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ firebase: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect based on role
    if (registrationData?.role === ROLES.DOCTOR) {
      // New doctors go to complete profile, returning doctors go to dashboard
      if (registrationData?.isNewUser !== false) {
        navigate("/doctor/complete-profile");
      } else {
        navigate("/doctor/dashboard");
      }
    } else if (registrationData?.role === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else {
      navigate("/patient/dashboard");
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      const result = await googleSignIn(formData.role);

      // Store registration data and show success modal
      setRegistrationData({
        role: result.dbUser?.role || formData.role,
        email: result.firebaseUser?.email,
        firstName: result.firebaseUser?.displayName?.split(" ")[0] || "User",
        isGoogleSignup: true,
        isNewUser: result.isNewUser,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ firebase: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: FaHeartbeat, text: "Track Your Health Metrics" },
    { icon: FaUserMd, text: "Connect with Specialists" },
    { icon: FaBrain, text: "AI-Powered Diagnostics" },
    { icon: FaShieldAlt, text: "Secure Health Records" },
  ];

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 4) return { strength: 2, label: "Medium", color: "bg-yellow-500" };
    return { strength: 3, label: "Strong", color: "bg-green-500" };
  };

  const pwStrength = passwordStrength();

  const roleOptions = [
    {
      role: ROLES.PATIENT,
      title: "Patient",
      description: "Track health, book appointments, access records",
      icon: FaUserInjured,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      role: ROLES.DOCTOR,
      title: "Doctor",
      description: "Manage patients, appointments, consultations",
      icon: FaStethoscope,
      color: "from-teal-500 to-emerald-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-500",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Floating Medical Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 text-white/20 text-6xl"
          >
            <FaHeartbeat />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 text-white/20 text-5xl"
          >
            <FaUserMd />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-32 text-white/20 text-7xl"
          >
            <MdHealthAndSafety />
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-32 text-white/20 text-5xl"
          >
            <FaBrain />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <MdHealthAndSafety className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-3xl">MedAI</h1>
              <p className="text-teal-200 text-sm">Healthcare System</p>
            </div>
          </Link>

          {/* Welcome Text */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Start Your
              <span className="block text-cyan-300">Health Journey Today</span>
            </h2>
            <p className="text-teal-100 text-lg max-w-md">
              Join thousands of users taking control of their health with
              AI-powered insights, personalized care, and seamless doctor
              connectivity.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon className="text-white text-lg" />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-12 flex items-center gap-3 text-teal-200 text-sm">
            <FaShieldAlt className="text-lg" />
            <span>256-bit SSL Encrypted | HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdHealthAndSafety className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-gray-800 font-bold text-2xl">MedAI</h1>
              <p className="text-teal-600 text-xs">Healthcare System</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-2">Join MedAI for better healthcare</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? <FaCheck className="text-xs" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-1 mx-1 rounded ${
                        currentStep > step ? "bg-teal-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="flex justify-between text-xs text-gray-500 mb-6 px-2">
              <span className={currentStep >= 1 ? "text-teal-600 font-medium" : ""}>Role</span>
              <span className={currentStep >= 2 ? "text-teal-600 font-medium" : ""}>Account</span>
              <span className={currentStep >= 3 ? "text-teal-600 font-medium" : ""}>Details</span>
            </div>

            {/* Error Message */}
            {(errors.firebase || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{errors.firebase || authError}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Role Selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">I want to join as a</h3>
                    <p className="text-sm text-gray-500">Select your account type</p>
                  </div>

                  <div className="space-y-3">
                    {roleOptions.map((option) => (
                      <motion.button
                        key={option.role}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect(option.role)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          formData.role === option.role
                            ? `${option.borderColor} ${option.bgColor}`
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              formData.role === option.role
                                ? `bg-gradient-to-r ${option.color}`
                                : "bg-gray-100"
                            }`}
                          >
                            <option.icon
                              className={`text-xl ${
                                formData.role === option.role ? "text-white" : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-semibold ${
                                formData.role === option.role ? "text-gray-800" : "text-gray-700"
                              }`}
                            >
                              {option.title}
                            </h4>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                          {formData.role === option.role && (
                            <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {formData.role === ROLES.DOCTOR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"
                    >
                      <div className="flex items-start gap-3">
                        <FaShieldAlt className="text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium">Verification Required</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Doctor accounts require verification. You'll need to provide your medical license
                            and credentials for admin approval.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/25 mt-6"
                  >
                    Continue as {formData.role === ROLES.DOCTOR ? "Doctor" : "Patient"}
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Basic Info */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center overflow-hidden border-3 border-teal-200 shadow-lg">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-teal-400 text-2xl" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:from-teal-600 hover:to-cyan-600 transition">
                        <FaCamera className="text-white text-xs" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Upload profile photo</p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.firstName ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white`}
                        placeholder="John"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.lastName ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white`}
                        placeholder="Doe"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 border ${
                          errors.email ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white`}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border ${
                          errors.password ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white`}
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-lg" />
                        ) : (
                          <FaEye className="text-lg" />
                        )}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${
                                pwStrength.strength >= level ? pwStrength.color : "bg-gray-200"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            pwStrength.strength === 1
                              ? "text-red-500"
                              : pwStrength.strength === 2
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {pwStrength.label} password
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-3.5 px-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => {
                        if (
                          formData.firstName &&
                          formData.lastName &&
                          formData.email &&
                          formData.password
                        ) {
                          setCurrentStep(3);
                        } else {
                          validateForm();
                        }
                      }}
                      className="flex-1 py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Show validation errors from previous steps */}
                  {(errors.firstName || errors.lastName || errors.email || errors.password) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                    >
                      <p className="font-medium text-sm mb-2">Please fix the following errors:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        {errors.firstName && <li>{errors.firstName}</li>}
                        {errors.lastName && <li>{errors.lastName}</li>}
                        {errors.email && <li>{errors.email}</li>}
                        {errors.password && <li>{errors.password}</li>}
                      </ul>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                      >
                        Go back to fix
                      </button>
                    </motion.div>
                  )}

                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 border ${
                          errors.phone ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Image URL Option */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useImageUrl}
                        onChange={() => setUseImageUrl(!useImageUrl)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-600">Use image URL instead</span>
                    </label>

                    {useImageUrl && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <input
                          type="text"
                          name="photoURL"
                          value={formData.photoURL}
                          onChange={handleImageUrlChange}
                          placeholder="https://example.com/your-photo.jpg"
                          className={`w-full px-4 py-3 border ${
                            errors.photoURL ? "border-red-300" : "border-gray-200"
                          } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white text-sm`}
                        />
                        {errors.photoURL && (
                          <p className="text-red-500 text-xs mt-1">{errors.photoURL}</p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Account Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Account Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Type:</span>
                        <span className="font-medium text-gray-800 capitalize">{formData.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium text-gray-800">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-gray-800">{formData.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="w-4 h-4 mt-0.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link to="/terms" className="text-teal-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-teal-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-3.5 px-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading || isSubmitting}
                      className={`flex-1 py-3.5 px-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg ${
                        loading || isSubmitting
                          ? "bg-teal-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-teal-500/25"
                      }`}
                    >
                      {loading || isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleGoogleRegister}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-red-500 text-lg" />
                <span className="font-medium text-gray-700">
                  Continue with Google as {formData.role === ROLES.DOCTOR ? "Doctor" : "Patient"}
                </span>
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-teal-600 hover:text-teal-700 transition"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleSuccessModalClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600"></div>
              <div className="absolute top-0 left-0 right-0 h-32 opacity-20">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full opacity-20"></div>
                <div className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full opacity-20"></div>
              </div>

              {/* Success Icon */}
              <div className="relative flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mt-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center"
                  >
                    <FaCheckCircle className="text-white text-4xl" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="text-center relative z-10 mt-4">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Welcome to MedAI!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mb-6"
                >
                  {registrationData?.firstName && `Hi ${registrationData.firstName}, `}
                  {registrationData?.isNewUser === false
                    ? "welcome back! You're now signed in."
                    : "your account has been created successfully!"}
                </motion.p>

                {/* Info Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 mb-6"
                >
                  {/* Email Verification Card - Only for new users with email signup */}
                  {registrationData?.isNewUser !== false && !registrationData?.isGoogleSignup && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MdEmail className="text-blue-600 text-xl" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Verify Your Email</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          We've sent a verification link to {registrationData?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Google Account Connected - For Google signups */}
                  {registrationData?.isGoogleSignup && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaGoogle className="text-green-600 text-lg" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Google Account Connected</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Signed in as {registrationData?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Doctor Verification Card - Only for new doctors */}
                  {registrationData?.role === ROLES.DOCTOR && registrationData?.isNewUser !== false && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MdVerified className="text-amber-600 text-xl" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Profile Review</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Complete your profile for admin verification
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSuccessModalClose}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {registrationData?.role === ROLES.DOCTOR && registrationData?.isNewUser !== false
                    ? "Complete Your Profile"
                    : "Go to Dashboard"}
                  <FaArrowRight className="text-sm" />
                </motion.button>

                {/* Skip/Later Link */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-gray-400 mt-4"
                >
                  You can also close this modal to continue
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUp;
