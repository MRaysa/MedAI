import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHeartbeat,
  FaShieldAlt,
  FaUserMd,
  FaBrain,
  FaCheckCircle,
  FaArrowRight,
  FaStethoscope,
  FaUserInjured,
  FaUserShield,
} from "react-icons/fa";
import { MdHealthAndSafety, MdEmail } from "react-icons/md";
import { useNavigate, useLocation, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { ROLES, DOCTOR_VERIFICATION_STATUS } from "../contexts/AuthProvider";

const SignIn = () => {
  const {
    signInUser,
    googleSignIn,
    resetPassword,
    apiCall,
    fetchCurrentUser,
    loading: authLoading,
    authError,
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();

  // Get redirect path based on user role
  const getRedirectPath = (dbUser, profile) => {
    // If there's a specific destination from state, use it (unless role-restricted)
    const fromPath = location?.state?.from;

    if (!dbUser) return fromPath || "/";

    switch (dbUser.role) {
      case ROLES.ADMIN:
        return fromPath?.startsWith("/admin") ? fromPath : "/admin/dashboard";
      case ROLES.DOCTOR:
        // Check if doctor is verified
        if (profile?.verificationStatus === DOCTOR_VERIFICATION_STATUS.APPROVED) {
          return fromPath?.startsWith("/doctor") ? fromPath : "/doctor/dashboard";
        }
        return "/doctor/verification-pending";
      case ROLES.PATIENT:
        return fromPath?.startsWith("/patient") ? fromPath : "/patient/dashboard";
      default:
        return fromPath || "/";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInUser(email, password);

      // Store login data and show success modal
      setLoginData({
        firstName: result.dbUser?.firstName,
        role: result.dbUser?.role,
        email: result.dbUser?.email,
        redirectPath: getRedirectPath(result.dbUser, result.profile),
        isGoogleLogin: false,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Sign-in error:", error);

      let errorMessage = error.message;
      if (error.message.includes("wrong-password") || error.message.includes("invalid-credential")) {
        errorMessage = "Incorrect email or password";
      } else if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email";
      } else if (error.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message.includes("not found")) {
        errorMessage = "Account not registered. Please sign up first.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // First, try to sign in with Google to get user info
      const result = await googleSignIn();

      if (result.isNewUser) {
        // New user - show role selection modal
        setPendingGoogleUser({
          firebaseUser: result.firebaseUser,
          dbUser: result.dbUser,
        });
        setShowRoleSelectionModal(true);
      } else {
        // Existing user - show success modal and redirect
        setLoginData({
          firstName: result.dbUser?.firstName || result.firebaseUser?.displayName?.split(" ")[0],
          role: result.dbUser?.role,
          email: result.dbUser?.email || result.firebaseUser?.email,
          redirectPath: getRedirectPath(result.dbUser, result.profile),
          isGoogleLogin: true,
          isNewUser: false,
        });
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle role selection for new Google users
  const handleRoleSelection = async () => {
    if (!pendingGoogleUser) return;

    setLoading(true);
    setShowRoleSelectionModal(false);

    try {
      // Update the user's role in the database if they selected doctor
      if (selectedRole === ROLES.DOCTOR && pendingGoogleUser.dbUser?.role !== ROLES.DOCTOR) {
        await apiCall("/auth/update-role", {
          method: "PUT",
          body: JSON.stringify({ role: selectedRole }),
        });
        // Refresh user context to update the navbar and other components
        await fetchCurrentUser();
      }

      const redirectPath = selectedRole === ROLES.DOCTOR
        ? "/doctor/complete-profile"
        : "/patient/dashboard";

      setLoginData({
        firstName: pendingGoogleUser.firebaseUser?.displayName?.split(" ")[0] || "User",
        role: selectedRole,
        email: pendingGoogleUser.firebaseUser?.email,
        redirectPath: redirectPath,
        isGoogleLogin: true,
        isNewUser: true,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Role selection error:", error);
      setError(error.message);
      // Still show success modal but with default patient role
      setLoginData({
        firstName: pendingGoogleUser.firebaseUser?.displayName?.split(" ")[0] || "User",
        role: ROLES.PATIENT,
        email: pendingGoogleUser.firebaseUser?.email,
        redirectPath: "/patient/dashboard",
        isGoogleLogin: true,
        isNewUser: true,
      });
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
      setPendingGoogleUser(null);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(loginData?.redirectPath || "/");
  };

  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState("");

  const handleForgetPassword = async () => {
    const emailValue = emailRef.current?.value;
    setError("");

    if (!emailValue) {
      setError("Please enter your email first");
      return;
    }

    try {
      await resetPassword(emailValue);
      setPasswordResetEmail(emailValue);
      setShowPasswordResetModal(true);
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email address.";
      }
      setError(errorMessage);
    }
  };

  const getRoleWelcomeMessage = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "Access your admin dashboard to manage the platform.";
      case ROLES.DOCTOR:
        return "Access your dashboard to manage patients and appointments.";
      case ROLES.PATIENT:
        return "Access your health dashboard and connect with doctors.";
      default:
        return "Your health journey continues.";
    }
  };

  const features = [
    { icon: FaHeartbeat, text: "Real-time Health Monitoring" },
    { icon: FaUserMd, text: "Connect with Expert Doctors" },
    { icon: FaBrain, text: "AI-Powered Health Insights" },
    { icon: FaShieldAlt, text: "HIPAA Compliant & Secure" },
  ];

  const displayError = error || authError;
  const isLoading = loading || authLoading;

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
              Welcome Back to
              <span className="block text-cyan-300">Your Health Journey</span>
            </h2>
            <p className="text-teal-100 text-lg max-w-md">
              Access your personalized health dashboard, connect with doctors,
              and take control of your wellness with AI-powered insights.
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

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-500 mt-2">Access your health dashboard</p>
            </div>

            {/* Error Message */}
            {displayError && (
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
                <p className="text-sm">{displayError}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg ${
                  isLoading
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-teal-500/25"
                }`}
              >
                {isLoading ? (
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
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-red-500 text-lg" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700 transition">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-teal-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-teal-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Role Selection Modal for New Google Users */}
      <AnimatePresence>
        {showRoleSelectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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

              {/* Google Icon */}
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
                    className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <FaGoogle className="text-white text-3xl" />
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
                  Hi {pendingGoogleUser?.firebaseUser?.displayName?.split(" ")[0] || "there"}! Choose how you'd like to use MedAI.
                </motion.p>

                {/* Role Selection Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 mb-6"
                >
                  {/* Patient Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.PATIENT)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedRole === ROLES.PATIENT
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedRole === ROLES.PATIENT
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <FaUserInjured
                          className={`text-xl ${
                            selectedRole === ROLES.PATIENT ? "text-white" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${selectedRole === ROLES.PATIENT ? "text-gray-800" : "text-gray-700"}`}>
                          Patient
                        </h4>
                        <p className="text-sm text-gray-500">Track health, book appointments, access records</p>
                      </div>
                      {selectedRole === ROLES.PATIENT && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Doctor Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.DOCTOR)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedRole === ROLES.DOCTOR
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedRole === ROLES.DOCTOR
                            ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <FaStethoscope
                          className={`text-xl ${
                            selectedRole === ROLES.DOCTOR ? "text-white" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${selectedRole === ROLES.DOCTOR ? "text-gray-800" : "text-gray-700"}`}>
                          Doctor
                        </h4>
                        <p className="text-sm text-gray-500">Manage patients, appointments, consultations</p>
                      </div>
                      {selectedRole === ROLES.DOCTOR && (
                        <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>

                {/* Doctor Verification Notice */}
                {selectedRole === ROLES.DOCTOR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Verification Required</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Doctor accounts require verification. You'll need to provide your medical license for admin approval.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRoleSelection}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      Continue as {selectedRole === ROLES.DOCTOR ? "Doctor" : "Patient"}
                      <FaArrowRight className="text-sm" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Success Modal */}
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
                  {loginData?.isNewUser ? "Welcome to MedAI!" : `Welcome back${loginData?.firstName ? `, ${loginData.firstName}` : ""}!`}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mb-6"
                >
                  {getRoleWelcomeMessage(loginData?.role)}
                </motion.p>

                {/* Role Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 mb-6"
                >
                  <div className={`bg-gradient-to-r ${
                    loginData?.role === ROLES.ADMIN
                      ? "from-purple-50 to-indigo-50 border-purple-100"
                      : loginData?.role === ROLES.DOCTOR
                      ? "from-teal-50 to-emerald-50 border-teal-100"
                      : "from-blue-50 to-cyan-50 border-blue-100"
                  } border rounded-xl p-4 flex items-start gap-3`}>
                    <div className={`w-10 h-10 ${
                      loginData?.role === ROLES.ADMIN
                        ? "bg-purple-100"
                        : loginData?.role === ROLES.DOCTOR
                        ? "bg-teal-100"
                        : "bg-blue-100"
                    } rounded-full flex items-center justify-center flex-shrink-0`}>
                      {loginData?.role === ROLES.ADMIN ? (
                        <FaUserShield className="text-purple-600 text-xl" />
                      ) : loginData?.role === ROLES.DOCTOR ? (
                        <FaStethoscope className="text-teal-600 text-xl" />
                      ) : (
                        <FaUserInjured className="text-blue-600 text-xl" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 text-sm">
                        {loginData?.role === ROLES.ADMIN
                          ? "Administrator Access"
                          : loginData?.role === ROLES.DOCTOR
                          ? "Doctor Dashboard"
                          : "Patient Portal"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Signed in as {loginData?.email}
                      </p>
                    </div>
                  </div>

                  {/* Google Login Badge */}
                  {loginData?.isGoogleLogin && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaGoogle className="text-green-600 text-lg" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Google Account</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Securely authenticated via Google
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
                  Go to Dashboard
                  <FaArrowRight className="text-sm" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Success Modal */}
      <AnimatePresence>
        {showPasswordResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPasswordResetModal(false)}
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
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
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
                    className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <MdEmail className="text-white text-4xl" />
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
                  Check Your Email
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mb-6"
                >
                  We've sent a password reset link to your email address.
                </motion.p>

                {/* Email Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdEmail className="text-blue-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 text-sm">Password Reset Link Sent</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Check your inbox at {passwordResetEmail}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordResetModal(false)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Got it
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-gray-400 mt-4"
                >
                  Didn't receive the email? Check your spam folder
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignIn;
