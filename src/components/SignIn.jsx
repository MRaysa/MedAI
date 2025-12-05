import React, { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
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
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { useNavigate, useLocation, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { ROLES, DOCTOR_VERIFICATION_STATUS } from "../contexts/AuthProvider";

const SignIn = () => {
  const {
    signInUser,
    googleSignIn,
    resetPassword,
    loading: authLoading,
    authError,
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Welcome back${result.dbUser?.firstName ? `, ${result.dbUser.firstName}` : ""}!`,
        text: getRoleWelcomeMessage(result.dbUser?.role),
        showConfirmButton: false,
        timer: 2000,
      });

      const redirectPath = getRedirectPath(result.dbUser, result.profile);
      navigate(redirectPath);
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
      const result = await googleSignIn();

      if (result.isNewUser) {
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Welcome to MedAI!",
          text: "Your account has been created successfully.",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Welcome back${result.dbUser?.firstName ? `, ${result.dbUser.firstName}` : ""}!`,
          text: getRoleWelcomeMessage(result.dbUser?.role),
          showConfirmButton: false,
          timer: 2000,
        });
      }

      const redirectPath = getRedirectPath(result.dbUser, result.profile);
      navigate(redirectPath);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    const emailValue = emailRef.current?.value;
    setError("");

    if (!emailValue) {
      setError("Please enter your email first");
      return;
    }

    try {
      await resetPassword(emailValue);
      await Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: "Please check your inbox for the password reset link.",
      });
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
    </div>
  );
};

export default SignIn;
